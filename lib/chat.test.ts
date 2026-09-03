import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRateLimiter, toGeminiHistory, type Msg } from './chat.ts';

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
