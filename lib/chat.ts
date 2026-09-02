/**
 * The two pieces of /api/chat that are logic rather than plumbing, lifted out
 * so they can be tested without standing up a route or calling Gemini.
 */

export type Msg = { role: 'user' | 'assistant'; content: string };
export type GeminiTurn = { role: 'user' | 'model'; parts: { text: string }[] };

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

  return function overLimit(ip: string): boolean {
    const t = now();
    const today = dayKey(t);
    if (today !== day) {
      day = today;
      dayCount = 0;
      hits.clear();
    }

    const recent = (hits.get(ip) ?? []).filter((x) => t - x < ipWindowMs);

    if (recent.length >= ipMax) {
      hits.set(ip, recent);
      return true;
    }
    if (dayCount >= dayMax) return true;

    dayCount += 1;
    recent.push(t);
    hits.set(ip, recent);
    return false;
  };
}

/**
 * Gemini takes the history separately from the message being answered, and a
 * history must open on a user turn. Trimming to the last N exchanges can cut
 * mid-pair and leave an assistant turn first, so the leading turns are dropped
 * until one opens correctly.
 */
export function toGeminiHistory(
  messages: Msg[],
  { maxTurns, maxChars }: { maxTurns: number; maxChars: number },
): { history: GeminiTurn[]; latest: GeminiTurn | undefined } {
  const turns: GeminiTurn[] = messages
    .slice(-maxTurns * 2)
    .map((m) => ({
      role: m.role === 'assistant' ? ('model' as const) : ('user' as const),
      parts: [{ text: String(m.content ?? '').slice(0, maxChars) }],
    }))
    .filter((m) => m.parts[0].text.length > 0);

  const latest = turns.pop();
  while (turns.length && turns[0].role !== 'user') turns.shift();

  return { history: turns, latest };
}
