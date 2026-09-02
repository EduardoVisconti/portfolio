import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRateLimiter, toGeminiHistory, type Msg } from './chat.ts';

const HOUR = 60 * 60 * 1000;

test('a rejected request spends neither budget', () => {
  // The bug this exists for: the daily counter used to be incremented before
  // the per-address check, so one caller could exhaust the day on requests it
  // was never served and 429 everyone else until midnight.
  let t = Date.parse('2026-09-02T10:00:00Z');
  const over = createRateLimiter({ ipWindowMs: HOUR, ipMax: 2, dayMax: 5, now: () => t });

  assert.equal(over('a'), false);
  assert.equal(over('a'), false);
  for (let i = 0; i < 20; i++) assert.equal(over('a'), true, 'a is past its window');

  // Those 20 rejections must not have touched the daily allowance: three
  // remain, so a different address still gets served.
  assert.equal(over('b'), false);
  assert.equal(over('c'), false);
  assert.equal(over('d'), false);
  assert.equal(over('e'), true, 'day exhausted only by served requests');
});

test('the daily ceiling stops a spread of addresses', () => {
  let t = Date.parse('2026-09-02T10:00:00Z');
  const over = createRateLimiter({ ipWindowMs: HOUR, ipMax: 100, dayMax: 2, now: () => t });

  assert.equal(over('a'), false);
  assert.equal(over('b'), false);
  assert.equal(over('c'), true);
});

test('the day rolls over', () => {
  let t = Date.parse('2026-09-02T23:00:00Z');
  const over = createRateLimiter({ ipWindowMs: HOUR, ipMax: 100, dayMax: 1, now: () => t });

  assert.equal(over('a'), false);
  assert.equal(over('a'), true);

  t += 2 * HOUR; // past midnight UTC
  assert.equal(over('a'), false, 'a new day restores the allowance');
});

test('the per-address window slides', () => {
  let t = 1_000_000;
  const over = createRateLimiter({ ipWindowMs: 1000, ipMax: 1, dayMax: 100, now: () => t });

  assert.equal(over('a'), false);
  t += 500;
  assert.equal(over('a'), true, 'still inside the window');
  t += 600;
  assert.equal(over('a'), false, 'the first hit has aged out');
});

test('history always opens on a user turn', () => {
  // Trimming to the last N exchanges can cut mid-pair. Gemini rejects a history
  // that opens on a model turn.
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

test('messages are clamped and empties dropped', () => {
  const messages: Msg[] = [
    { role: 'user', content: '   '.repeat(0) },
    { role: 'user', content: 'x'.repeat(50) },
  ];

  const { history, latest } = toGeminiHistory(messages, { maxTurns: 10, maxChars: 10 });

  assert.equal(latest?.parts[0].text.length, 10, 'clamped to maxChars');
  assert.equal(history.length, 0, 'the empty message is dropped');
});

test('an empty transcript yields no latest', () => {
  const { history, latest } = toGeminiHistory([], { maxTurns: 10, maxChars: 10 });
  assert.equal(latest, undefined);
  assert.equal(history.length, 0);
});
