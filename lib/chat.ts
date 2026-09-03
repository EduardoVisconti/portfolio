/**
 * The parts of /api/chat that are logic rather than plumbing, lifted out so
 * they can be tested without standing up a route or calling Gemini.
 */

export type Msg = { role: 'user' | 'assistant'; content: string };
export type GeminiTurn = { role: 'user' | 'model'; parts: { text: string }[] };

/** Why a request was refused. The two have different remedies, so they are
 *  different answers - one clears in an hour, the other at midnight UTC. */
export type Refusal = 'ip' | 'day' | null;

const dayKey = (t: number) => new Date(t).toISOString().slice(0, 10);

export type RateLimitOptions = {
  /** Sliding window per address. */
  ipWindowMs: number;
  /** Requests allowed per address per window. */
  ipMax: number;
  /** Requests allowed per instance per day, as the backstop. */
  dayMax: number;
  /** Injectable clock. The daily rollover is untestable without it. */
  now?: () => number;
};

/**
 * A request that is turned away spends neither budget. Counting the day before
 * the per-address check let one caller burn the whole daily allowance on
 * requests it was never going to be served, which handed anyone a cheap outage
 * for every other visitor until midnight UTC.
 *
 * Serverless instances do not share memory, so this is per-instance and
 * therefore soft. It stops casual abuse and bot sweeps, not a distributed
 * attacker - that belongs at the edge.
 */
export function createRateLimiter({ ipWindowMs, ipMax, dayMax, now = Date.now }: RateLimitOptions) {
  const hits = new Map<string, number[]>();
  let day = dayKey(now());
  let dayCount = 0;

  return function refuse(ip: string): Refusal {
    const t = now();
    const today = dayKey(t);
    if (today !== day) {
      day = today;
      dayCount = 0;
      // Deliberately not clearing `hits`: the per-address window is time-based
      // and expires itself below. Clearing it handed anyone who spent their
      // twenty questions at 23:58 another twenty at 00:01.
    }

    const recent = (hits.get(ip) ?? []).filter((x) => t - x < ipWindowMs);

    if (recent.length >= ipMax) {
      hits.set(ip, recent);
      return 'ip';
    }
    if (dayCount >= dayMax) return 'day';

    dayCount += 1;
    recent.push(t);
    hits.set(ip, recent);

    // `hits` only grows on a served request, so it is bounded by dayMax per
    // day; this prunes addresses whose window has fully aged out.
    if (hits.size > dayMax) {
      hits.forEach((v: number[], k: string) => {
        if (!v.some((x) => t - x < ipWindowMs)) hits.delete(k);
      });
    }
    return null;
  };
}

/**
 * Gemini takes the history separately from the message being answered, and
 * rejects a history that does not strictly alternate user/model. Two things can
 * break that: trimming to the last N exchanges can cut mid-pair and leave a
 * model turn first, and dropping empty messages can leave two same-role turns
 * adjacent. The SDK throws inside the ChatSession constructor when either
 * happens, which surfaces to the visitor as "the route isn't reachable".
 */
export function toGeminiHistory(
  messages: Msg[],
  { maxTurns, maxChars }: { maxTurns: number; maxChars: number },
): { history: GeminiTurn[]; latest: GeminiTurn | undefined } {
  const turns: GeminiTurn[] = messages
    .slice(-maxTurns * 2)
    .map((m) => ({
      role: m.role === 'assistant' ? ('model' as const) : ('user' as const),
      // Trimmed before the emptiness test: '   ' has length 3 and used to
      // survive as a turn made of whitespace.
      parts: [{ text: String(m.content ?? '').trim().slice(0, maxChars) }],
    }))
    .filter((m) => m.parts[0].text.length > 0);

  const latest = turns.pop();

  // Keep only the last of any same-role run, then drop leading model turns.
  const alternating: GeminiTurn[] = [];
  for (const turn of turns) {
    if (alternating.length && alternating[alternating.length - 1].role === turn.role) {
      alternating[alternating.length - 1] = turn;
    } else {
      alternating.push(turn);
    }
  }
  while (alternating.length && alternating[0].role !== 'user') alternating.shift();

  return { history: alternating, latest };
}

/**
 * The wire protocol between /api/chat and the console: NDJSON, one JSON object
 * per line, so the client can paint a token without waiting for the sentence
 * it belongs to.
 *
 * `d` is not ceremony. A stream that simply ends is indistinguishable from one
 * the network cut in half, and without an explicit end marker a truncated
 * answer gets committed to the transcript and replayed to the model as
 * something it had finished saying.
 */
export type StreamEvent =
  | { t: string }   // a text delta
  | { e: string }   // the turn failed; the client owns the visitor-facing copy
  | { d: 1 };       // the answer is complete

/** One event, framed. The trailing newline is the frame, so it is not optional. */
export const ndjsonLine = (event: StreamEvent) => JSON.stringify(event) + '\n';

/**
 * A line is only a line once its newline has arrived. Chunk boundaries do not
 * respect it: a read can end on `{"t":"Eduar`, which is not JSON and must not
 * be parsed, dropped, or painted. Everything after the last newline is held
 * back until the read that completes it.
 *
 * Unparseable and unrecognized lines are skipped rather than thrown on. The
 * transcript is the visitor's only view of this, and a protocol the client
 * does not know yet should cost a missing token, not the whole answer.
 */
export function createStreamReader() {
  let buffer = '';

  const parse = (line: string): StreamEvent | null => {
    const text = line.trim();
    if (!text) return null;
    let value: unknown;
    try {
      value = JSON.parse(text);
    } catch {
      return null;
    }
    if (typeof value !== 'object' || value === null) return null;
    const event = value as Record<string, unknown>;
    if (typeof event.t === 'string') return { t: event.t };
    if (typeof event.e === 'string') return { e: event.e };
    if ('d' in event) return { d: 1 };
    return null;
  };

  const keep = (events: (StreamEvent | null)[]) =>
    events.filter((e): e is StreamEvent => e !== null);

  return {
    /** Events completed by this chunk. A chunk with no newline yields none. */
    push(chunk: string): StreamEvent[] {
      buffer += chunk;
      const lines = buffer.split('\n');
      // The last element is whatever follows the final newline - '' when the
      // chunk ended cleanly, a partial object when it did not.
      buffer = lines.pop() ?? '';
      return keep(lines.map(parse));
    },
    /** The final line of a stream that ended without its trailing newline. */
    flush(): StreamEvent[] {
      const rest = buffer;
      buffer = '';
      return keep([parse(rest)]);
    },
  };
}

/** What this needs from a model chunk, and nothing more - so a test can be one. */
export type TextChunk = { text: () => string };

/**
 * The model's chunks, framed as NDJSON. Lifted out of the route for the reason
 * this whole file exists: the framing is the part that can be wrong in ways a
 * live key would never reveal, and the model call is the part that cannot be
 * exercised without one. Everything below is therefore tested; the one line
 * that calls Gemini is not.
 *
 * Failure has no status code to travel in - that was spent on the first byte -
 * so it leaves as an event. It also leaves without `d`, which is what keeps a
 * half-written answer out of the transcript history.
 */
export type FrameHooks = {
  /**
   * The aggregate response's finish reason. A function rather than a value
   * because it does not exist until the stream has been drained.
   */
  finishReason?: () => Promise<string | undefined>;
  empty?: (reason?: string) => void;
  truncated?: (reason: string) => void;
  failed?: (err: unknown) => void;
};

export async function* frameAnswer(
  chunks: AsyncIterable<TextChunk>,
  hooks: FrameHooks = {},
): AsyncGenerator<string> {
  let emitted = false;
  try {
    for await (const chunk of chunks) {
      const text = chunk.text();
      if (!text) continue;
      emitted = true;
      yield ndjsonLine({ t: text });
    }
  } catch (err) {
    hooks.failed?.(err);
    yield ndjsonLine({ e: 'upstream' });
    return;
  }

  // Reaching the end of the chunks is not the same as finishing. Gemini stops
  // on maxOutputTokens - and on a safety or recitation trip - by ending the
  // stream normally, and says so only on the aggregate, never on a chunk. Ten
  // of its eleven finish reasons mean cut short.
  let reason: string | undefined;
  try {
    reason = await hooks.finishReason?.();
  } catch (err) {
    hooks.failed?.(err);
    yield ndjsonLine({ e: 'upstream' });
    return;
  }

  // An answer of nothing is a failure, not an answer. Marking it complete makes
  // the console show a blank turn while the telemetry beside it reports a
  // healthy stream.
  if (!emitted) {
    hooks.empty?.(reason);
    yield ndjsonLine({ e: 'empty' });
    return;
  }

  // Absent is not evidence of truncation. Withholding `d` whenever the field is
  // missing would silently end multi-turn context for every visitor over an SDK
  // quirk, so only a named reason other than STOP counts as cut short.
  if (reason && reason !== 'STOP') {
    hooks.truncated?.(reason);
    // The words stay on screen - the model really said them - but without `d`
    // the client cannot commit them, so a half sentence is never replayed as a
    // finished model turn.
    yield ndjsonLine({ e: 'truncated' });
    return;
  }

  yield ndjsonLine({ d: 1 });
}
