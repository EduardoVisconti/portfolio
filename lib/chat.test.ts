import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  createRateLimiter,
  createStreamReader,
  frameAnswer,
  ndjsonLine,
  toGeminiHistory,
  type Msg,
  type StreamEvent,
} from './chat.ts';

const HOUR = 60 * 60 * 1000;

test('a refused request spends neither budget', () => {
  // The bug this exists for: the daily counter used to be incremented before
  // the per-address check, so one caller could exhaust the day on requests it
  // was never served and 429 everyone else until midnight.
  const t = Date.parse('2026-09-02T10:00:00Z');
  const refuse = createRateLimiter({ ipWindowMs: HOUR, ipMax: 2, dayMax: 5, now: () => t });

  assert.equal(refuse('a'), null);
  assert.equal(refuse('a'), null);
  for (let i = 0; i < 20; i++) assert.equal(refuse('a'), 'ip');

  assert.equal(refuse('b'), null);
  assert.equal(refuse('c'), null);
  assert.equal(refuse('d'), null);
  assert.equal(refuse('e'), 'day', 'only served requests spent the day');
});

test('the two refusals are distinguishable', () => {
  // They have different remedies: one clears in an hour, the other at midnight.
  const t = Date.parse('2026-09-02T10:00:00Z');
  const refuse = createRateLimiter({ ipWindowMs: HOUR, ipMax: 1, dayMax: 1, now: () => t });

  assert.equal(refuse('a'), null);
  assert.equal(refuse('a'), 'ip');
  assert.equal(refuse('b'), 'day');
});

test('the day rolls over without refilling an exhausted address', () => {
  let t = Date.parse('2026-09-02T23:58:00Z');
  const refuse = createRateLimiter({ ipWindowMs: HOUR, ipMax: 1, dayMax: 100, now: () => t });

  assert.equal(refuse('a'), null);
  assert.equal(refuse('a'), 'ip');

  t += 3 * 60 * 1000; // 00:01 - a new UTC day, but only three minutes later
  assert.equal(refuse('a'), 'ip', 'the hourly window does not reset at midnight');

  t += HOUR;
  assert.equal(refuse('a'), null, 'it resets when the window actually passes');
});

test('the daily allowance is restored by a new day', () => {
  let t = Date.parse('2026-09-02T23:00:00Z');
  const refuse = createRateLimiter({ ipWindowMs: HOUR, ipMax: 100, dayMax: 1, now: () => t });

  assert.equal(refuse('a'), null);
  assert.equal(refuse('b'), 'day');

  t += 2 * HOUR;
  assert.equal(refuse('b'), null);
});

test('the per-address window slides', () => {
  let t = 1_000_000;
  const refuse = createRateLimiter({ ipWindowMs: 1000, ipMax: 1, dayMax: 100, now: () => t });

  assert.equal(refuse('a'), null);
  t += 500;
  assert.equal(refuse('a'), 'ip');
  t += 600;
  assert.equal(refuse('a'), null, 'the first hit aged out');
});

test('history always opens on a user turn', () => {
  const messages: Msg[] = [
    { role: 'user', content: 'u1' },
    { role: 'assistant', content: 'a1' },
    { role: 'user', content: 'u2' },
    { role: 'assistant', content: 'a2' },
    { role: 'user', content: 'u3' },
  ];

  const { history, latest } = toGeminiHistory(messages, { maxTurns: 2, maxChars: 100 });

  assert.equal(latest?.parts[0].text, 'u3', 'the newest message is answered, not replayed');
  assert.equal(history[0].role, 'user');
  assert.deepEqual(history.map((h) => h.parts[0].text), ['u2', 'a2']);
});

test('a dropped empty message never leaves two same-role turns', () => {
  // The SDK validates strict alternation in the ChatSession constructor and
  // throws, which the visitor sees as "the route isn't reachable".
  const messages: Msg[] = [
    { role: 'user', content: 'first' },
    { role: 'assistant', content: '   ' },   // dropped as empty
    { role: 'user', content: 'second' },
    { role: 'assistant', content: 'answer' },
    { role: 'user', content: 'now' },
  ];

  const { history } = toGeminiHistory(messages, { maxTurns: 10, maxChars: 100 });

  for (let i = 1; i < history.length; i++) {
    assert.notEqual(history[i].role, history[i - 1].role, 'roles must alternate');
  }
  assert.deepEqual(history.map((h) => h.parts[0].text), ['second', 'answer']);
});

test('messages are clamped and empties dropped', () => {
  const messages: Msg[] = [
    { role: 'user', content: '' },
    { role: 'user', content: 'x'.repeat(50) },
  ];

  const { history, latest } = toGeminiHistory(messages, { maxTurns: 10, maxChars: 10 });

  assert.equal(latest?.parts[0].text.length, 10, 'clamped to maxChars');
  assert.equal(history.length, 0);
});

test('an empty transcript yields no latest', () => {
  const { history, latest } = toGeminiHistory([], { maxTurns: 10, maxChars: 10 });
  assert.equal(latest, undefined);
  assert.equal(history.length, 0);
});

test('an object split across chunks is held back until it is whole', () => {
  // The bug this exists for: a read can end on `{"t":"Eduar`. Parsing it throws,
  // dropping it loses the token, and painting it puts JSON in the transcript.
  const reader = createStreamReader();

  assert.deepEqual(reader.push('{"t":"Eduar'), [], 'a partial object yields nothing');
  assert.deepEqual(reader.push('do is an "}\n'), [{ t: 'Eduardo is an ' }]);
});

test('a newline inside a delta does not frame it', () => {
  // The model emits paragraph breaks. JSON.stringify escapes them to \n inside
  // the string, so splitting on the raw newline is safe - this is the test that
  // fails if the frame is ever built by concatenation instead.
  const reader = createStreamReader();
  const events = reader.push(ndjsonLine({ t: 'one\ntwo' }));

  assert.deepEqual(events, [{ t: 'one\ntwo' }]);
});

test('several events arriving in one read all come out', () => {
  const reader = createStreamReader();
  const wire = ndjsonLine({ t: 'a' }) + ndjsonLine({ t: 'b' }) + ndjsonLine({ d: 1 });

  assert.deepEqual(reader.push(wire), [{ t: 'a' }, { t: 'b' }, { d: 1 }]);
});

test('a completed answer is distinguishable from a truncated one', () => {
  // Why `d` exists. Both streams below end; only one of them finished, and
  // committing the other to the history replays half a sentence to the model
  // as something it had said.
  const finished = createStreamReader();
  finished.push(ndjsonLine({ t: 'whole' }));
  const done = finished.push(ndjsonLine({ d: 1 }));

  const cut = createStreamReader();
  const partial = cut.push(ndjsonLine({ t: 'half' }));

  assert.ok(done.some((e) => 'd' in e), 'the finished stream said so');
  assert.ok(!partial.some((e) => 'd' in e), 'the cut stream could not');
  assert.deepEqual(cut.flush(), [], 'and it leaves nothing behind either');
});

test('a line that is not JSON costs a token, not the answer', () => {
  const reader = createStreamReader();
  const wire = ndjsonLine({ t: 'before' }) + 'not json\n' + ndjsonLine({ t: 'after' });

  assert.deepEqual(reader.push(wire), [{ t: 'before' }, { t: 'after' }]);
});

test('a well-formed line of an unknown shape is skipped, not painted', () => {
  // A protocol the client does not know yet should cost a missing token rather
  // than [object Object] in the transcript.
  const reader = createStreamReader();
  const wire = '{"v":2}\n' + ndjsonLine({ t: 'kept' }) + '[]\n' + 'null\n';

  assert.deepEqual(reader.push(wire), [{ t: 'kept' }]);
});

test('the final line survives a stream that ended without its newline', () => {
  const reader = createStreamReader();

  assert.deepEqual(reader.push('{"t":"last"}'), [], 'unframed, so not yet an event');
  assert.deepEqual(reader.flush(), [{ t: 'last' }]);
  assert.deepEqual(reader.flush(), [], 'and the buffer is spent');
});

test('an error event carries its code through the frame', () => {
  const reader = createStreamReader();
  assert.deepEqual(reader.push(ndjsonLine({ e: 'upstream' })), [{ e: 'upstream' }]);
});

test('a stream delivered one character at a time reassembles exactly', () => {
  // The worst case the transport can produce, and the cheapest way to prove the
  // buffer never drops or duplicates a byte.
  const reader = createStreamReader();
  const wire = ndjsonLine({ t: 'Eduardo ' }) + ndjsonLine({ t: 'ships.' }) + ndjsonLine({ d: 1 });

  const events = [...wire].flatMap((ch) => reader.push(ch));

  assert.deepEqual(events, [{ t: 'Eduardo ' }, { t: 'ships.' }, { d: 1 }]);
  assert.equal(
    events.filter((e): e is { t: string } => 't' in e).map((e) => e.t).join(''),
    'Eduardo ships.',
  );
});

// Enough of a model chunk to frame, and no more.
const streamOf = async function* (...texts: string[]) {
  for (const text of texts) yield { text: () => text };
};
const failingAfter = async function* (...texts: string[]) {
  for (const text of texts) yield { text: () => text };
  throw new Error('the upstream went away mid-answer');
};
const collect = async (lines: AsyncGenerator<string>) => {
  const out: string[] = [];
  for await (const line of lines) out.push(line);
  return out;
};

test('a whole answer is framed a delta at a time, then marked complete', async () => {
  const lines = await collect(frameAnswer(streamOf('He owns ', 'it alone.')));

  assert.deepEqual(lines, [
    ndjsonLine({ t: 'He owns ' }),
    ndjsonLine({ t: 'it alone.' }),
    ndjsonLine({ d: 1 }),
  ]);
});

test('a chunk carrying no text is skipped rather than framed as an empty delta', async () => {
  const lines = await collect(frameAnswer(streamOf('kept', '', 'also kept')));

  assert.deepEqual(lines, [
    ndjsonLine({ t: 'kept' }),
    ndjsonLine({ t: 'also kept' }),
    ndjsonLine({ d: 1 }),
  ]);
});

test('an answer of nothing is an error, not a completion', async () => {
  // The failure mode this replaced: a 200 carrying an empty string, which the
  // console showed as a blank turn beside telemetry reporting a healthy trip.
  let told = 0;
  const lines = await collect(frameAnswer(streamOf('', ''), { empty: () => { told += 1; } }));

  assert.deepEqual(lines, [ndjsonLine({ e: 'empty' })]);
  assert.equal(told, 1, 'and it is logged, because finishReason is the only clue');
});

test('a failure mid-answer keeps the words and withholds the completion marker', async () => {
  // Both halves matter. The visitor keeps three sentences that the model really
  // said, and the client cannot commit them to the history as a finished turn.
  let failed: unknown = null;
  const lines = await collect(
    frameAnswer(failingAfter('half an ans'), { failed: (err) => { failed = err; } }),
  );

  assert.deepEqual(lines, [ndjsonLine({ t: 'half an ans' }), ndjsonLine({ e: 'upstream' })]);
  assert.ok(failed instanceof Error, 'the reason reached the log');
});

test('a chunk that throws on read is a failure, not a silent truncation', async () => {
  const hostile = (async function* () {
    yield { text: () => 'fine' };
    yield { text: () => { throw new Error('blocked'); } };
  })();

  const lines = await collect(frameAnswer(hostile));

  assert.deepEqual(lines, [ndjsonLine({ t: 'fine' }), ndjsonLine({ e: 'upstream' })]);
});

test('what the route frames is exactly what the client reader reassembles', async () => {
  // The end-to-end test this protocol can actually have: every line of code
  // between a model chunk and the transcript runs here, delivered one byte at a
  // time because the transport is allowed to do that. The single thing not
  // covered is the call to Gemini, which is the only part that needs a key.
  const reader = createStreamReader();
  const seen: StreamEvent[] = [];

  for await (const line of frameAnswer(streamOf('He owns ', 'the platform ', 'alone.'))) {
    for (const byte of line) seen.push(...reader.push(byte));
  }
  seen.push(...reader.flush());

  const painted = seen.filter((e): e is { t: string } => 't' in e).map((e) => e.t).join('');
  assert.equal(painted, 'He owns the platform alone.');
  assert.ok(seen.some((e) => 'd' in e), 'and the client can tell the answer is whole');
});

test('running out of tokens is not the same as finishing', async () => {
  // Gemini ends the stream normally on maxOutputTokens and says so only on the
  // aggregate, never on a chunk. Marking that complete hands the client half a
  // sentence to commit and replay as a finished model turn on the next
  // question - the exact failure `d` exists to prevent.
  let told = '';
  const lines = await collect(frameAnswer(streamOf('He owns the platform al'), {
    finishReason: async () => 'MAX_TOKENS',
    truncated: (reason) => { told = reason; },
  }));

  assert.deepEqual(lines, [
    ndjsonLine({ t: 'He owns the platform al' }),
    ndjsonLine({ e: 'truncated' }),
  ]);
  assert.equal(told, 'MAX_TOKENS', 'and the reason reached the log');
});

test('a safety stop after real text is not a completion either', async () => {
  // Ten of the eleven finish reasons mean cut short. MAX_TOKENS is the likely
  // one here; this is the check that the test above is not a special case.
  const lines = await collect(frameAnswer(streamOf('Partial '), {
    finishReason: async () => 'SAFETY',
  }));

  assert.deepEqual(lines, [ndjsonLine({ t: 'Partial ' }), ndjsonLine({ e: 'truncated' })]);
});

test('a clean stop is what earns the completion marker', async () => {
  const lines = await collect(frameAnswer(streamOf('A whole answer.'), {
    finishReason: async () => 'STOP',
  }));

  assert.deepEqual(lines, [ndjsonLine({ t: 'A whole answer.' }), ndjsonLine({ d: 1 })]);
});

test('a missing finish reason does not withhold the completion marker', async () => {
  // Absent is not evidence of truncation. Withholding `d` whenever the field is
  // missing would silently end multi-turn context for every visitor over an SDK
  // quirk, which is a wider failure than the one it would be guarding against.
  const lines = await collect(frameAnswer(streamOf('A whole answer.'), {
    finishReason: async () => undefined,
  }));

  assert.deepEqual(lines, [ndjsonLine({ t: 'A whole answer.' }), ndjsonLine({ d: 1 })]);
});

test('a finish reason that cannot be read is a failure, not a completion', async () => {
  let failed: unknown = null;
  const lines = await collect(frameAnswer(streamOf('Some text.'), {
    finishReason: async () => { throw new Error('the aggregate never resolved'); },
    failed: (err) => { failed = err; },
  }));

  assert.deepEqual(lines, [ndjsonLine({ t: 'Some text.' }), ndjsonLine({ e: 'upstream' })]);
  assert.ok(failed instanceof Error, 'the reason reached the log');
});

test('an answer of nothing carries the reason it was nothing', async () => {
  let seen: string | undefined = 'unset';
  const lines = await collect(frameAnswer(streamOf(''), {
    finishReason: async () => 'MAX_TOKENS',
    empty: (reason) => { seen = reason; },
  }));

  assert.deepEqual(lines, [ndjsonLine({ e: 'empty' })]);
  assert.equal(seen, 'MAX_TOKENS', 'the only clue why the model returned nothing');
});

test('a truncated answer reaches the client with its words and without permission to keep them', async () => {
  // The whole chain, on the case that matters most: the visitor keeps what the
  // model really said, and the client is told it may not commit it.
  const reader = createStreamReader();
  const seen: StreamEvent[] = [];

  for await (const line of frameAnswer(streamOf('He owns the platform al'), {
    finishReason: async () => 'MAX_TOKENS',
  })) {
    for (const byte of line) seen.push(...reader.push(byte));
  }
  seen.push(...reader.flush());

  const painted = seen.filter((e): e is { t: string } => 't' in e).map((e) => e.t).join('');
  assert.equal(painted, 'He owns the platform al', 'the words survive');
  assert.ok(!seen.some((e) => 'd' in e), 'and the client cannot commit them');
});
