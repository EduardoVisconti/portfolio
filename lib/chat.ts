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
      for (const [k, v] of hits) if (!v.some((x) => t - x < ipWindowMs)) hits.delete(k);
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
