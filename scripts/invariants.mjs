#!/usr/bin/env node
/**
 * The design rules, as a gate.
 *
 * A written-down rule decays within a month - that is the argument the page
 * itself makes in ADR 03. These are the rules whose violation is expensive and
 * silent, so they are checked mechanically instead of remembered.
 *
 * Run: npm run invariants
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const fail = [];
const check = (ok, msg) => { if (!ok) fail.push(msg); };

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);

const SRC = ['app', 'components', 'lib']
  .flatMap(walk)
  .filter((f) => /\.(ts|tsx|css)$/.test(f));

const read = (f) => readFileSync(f, 'utf8');
const content = read('lib/content.ts');
const assistant = read('lib/assistant-context.ts');

// 1. The site reads as someone with work, not someone seeking it. Standing
//    constraint from the owner - it is not a copy preference.
const SEEKING = /open to (new )?opportunit|available for hire|looking for (work|a role|opportunit)|hire me|let's work together|actively (job )?search/i;
for (const f of SRC) {
  const body = read(f);
  // The assistant prompt is allowed to name the phrase in order to forbid it.
  if (f.endsWith('assistant-context.ts')) continue;
  check(!SEEKING.test(body), `${f}: says it is looking for work`);
}
check(/Never state or imply/.test(assistant), 'assistant-context.ts: lost the rule forbidding "open to opportunities"');

// 2. No emoji. The only non-alphanumeric glyphs allowed are the ones the design
//    specifies.
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{1F000}-\u{1F2FF}\u{2B00}-\u{2BFF}\u{FE0F}]/u;
for (const f of SRC) check(!EMOJI.test(read(f)), `${f}: contains an emoji`);

// 3. Zero radius, zero shadow. Radius and shadow are the two fastest ways to
//    read "template".
for (const f of SRC) {
  const body = read(f);
  check(!/\brounded(-|\b)/.test(body), `${f}: uses a border radius`);
  check(!/\bshadow(-|\b)/.test(body), `${f}: uses a box shadow`);
}

// 4. Semantic colour names only - no raw hex in components.
for (const f of SRC.filter((f) => f.startsWith('components'))) {
  check(!/#[0-9a-fA-F]{6}\b/.test(read(f)), `${f}: hardcodes a hex colour`);
}

// 5. Numbers are load-bearing. If one changes in content.ts and not in the
//    assistant's context, the assistant contradicts the page out loud.
const FIGURES = ['1271', '1297', '77', '3000', '46', '120', '93', '68672', '50302', '187'];
const flat = assistant.replace(/,/g, '');
for (const n of FIGURES) {
  check(content.includes(n), `lib/content.ts: lost the figure ${n}`);
  check(flat.includes(n), `lib/assistant-context.ts: missing the figure ${n} that content.ts states`);
}

// 6. The motion of the page ships zero JS. Only these hold state.
const CLIENT = ['AskMeAnything.tsx', 'Counter.tsx', 'SectionRail.tsx', 'Contact.tsx'];
for (const f of SRC.filter((f) => f.startsWith('components'))) {
  if (!/^['"]use client['"]/m.test(read(f))) continue;
  check(CLIENT.includes(f.split(/[\\/]/).pop()), `${f}: became a client component`);
}

// 7. No dead links. A placeholder href in production is a defect.
for (const f of SRC) {
  check(!/href[:=]\s*['"]#['"]/.test(read(f)), `${f}: has a placeholder href`);
}

if (fail.length) {
  console.error('\ninvariants: %d violation(s)\n', fail.length);
  for (const m of fail) console.error('  - ' + m);
  process.exit(1);
}
console.log('invariants: all clear');
