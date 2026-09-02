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
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const fail = [];
const check = (ok, msg) => { if (!ok) fail.push(msg); };
const read = (f) => readFileSync(f, 'utf8');

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);

const CODE = ['app', 'components', 'lib', 'scripts']
  .flatMap(walk)
  .filter((f) => /\.(ts|tsx|mjs|css)$/.test(f));

// Prose surfaces state the same facts to readers and to extractors, so the
// copy rules apply to them too. llms.txt shipped "Not actively job searching"
// for a while precisely because it was out of scope.
const PROSE = ['README.md', 'CONTRIBUTING.md', 'public/llms.txt'].filter(existsSync);
const ALL = [...CODE, ...PROSE];

const content = read('lib/content.ts');
const assistant = read('lib/assistant-context.ts');

// 1. The site reads as someone with work, not someone seeking it. Standing
//    constraint from the owner - not a copy preference.
const SEEKING = /open to (new )?opportunit|available for hire|looking for (work|a role|opportunit)|hire me|let's work together|actively (job )?search|job hunting/i;
for (const f of ALL) {
  let body = read(f);
  // The assistant prompt must name the phrase in order to forbid it; only that
  // one line is exempt, not the whole file.
  if (f.endsWith('assistant-context.ts')) {
    body = body.split('\n').filter((l) => !/^Never state or imply/.test(l)).join('\n');
  }
  // This file quotes the forbidden phrases to match them.
  if (f.endsWith('invariants.mjs')) continue;
  const m = body.match(SEEKING);
  check(!m, `${f}: says it is looking for work (${m?.[0]})`);
}
check(/Never state or imply/.test(assistant), 'assistant-context.ts: lost the rule forbidding "open to opportunities"');

// 2. No emoji anywhere.
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{1F000}-\u{1F2FF}\u{2B00}-\u{2BFF}\u{FE0F}]/u;
for (const f of CODE) check(!EMOJI.test(read(f)), `${f}: contains an emoji`);

// 3. Zero radius, zero shadow - in the utility names AND in raw CSS, which the
//    class-name check alone could not see.
for (const f of CODE) {
  const body = read(f);
  check(!/\brounded(-|\b)/.test(body), `${f}: uses a border radius utility`);
  check(!/\bshadow(-|\b)/.test(body), `${f}: uses a box shadow utility`);
  const radius = body.match(/border-radius\s*:\s*(?!0\s*[;}])[^;}]+/);
  check(!radius, `${f}: sets a non-zero border-radius (${radius?.[0]?.trim()})`);
  const shadow = body.match(/box-shadow\s*:\s*(?!none\s*[;}])[^;}]+/);
  check(!shadow, `${f}: sets a box-shadow (${shadow?.[0]?.trim()})`);
}

// 4. Colour resolves through tailwind.config.ts and nowhere else. rgba() counts
//    - a raw colour is a raw colour whatever notation it wears.
for (const f of CODE.filter((f) => !f.includes('tailwind.config'))) {
  for (const [i, line] of read(f).split('\n').entries()) {
    if (/^\s*--[\w-]+\s*:/.test(line)) continue;          // a CSS variable definition
    const c = line.match(/#[0-9a-fA-F]{3,8}\b|rgba?\(/);
    check(!c, `${f}:${i + 1}: hardcodes a colour (${c?.[0]})`);
  }
}

// 5. Figures are load-bearing. If one changes in content.ts and not in the
//    assistant's context, the assistant contradicts the page out loud. Checked
//    as label->value pairs: presence alone let the two numbers be swapped.
const PAIRS = [
  [/1,?271 of 1,?297|1,?271 commits/i, 'the 1,271 of 1,297 commit share'],
  [/77 (vendor-portal )?integrations/i, 'the 77 integrations'],
  [/3,?000\+? (US )?count/i, 'the 3,000+ counties'],
  [/46 architecture decision/i, 'the 46 ADRs'],
  [/120 pull requests/i, 'the 120 pull requests'],
  [/93% merged?/i, 'the 93% merge rate'],
  [/68,?672 lines of tests? against 50,?302 lines of source/i,
   'the tests-against-source ratio, in that order'],
  [/187 pull requests/i, 'the 187 Forja pull requests'],
  [/32 pull requests/i, 'the 32 AI Hub pull requests'],
  [/1,?300 unit and 200 end-to-end/i, 'the AI Hub test counts'],
];
for (const [re_, what] of PAIRS) {
  check(re_.test(assistant), `lib/assistant-context.ts: missing or reworded ${what}`);
}
for (const n of ['1271', '1297', '77', '3000', '46', '120', '93', '68672', '50302', '187']) {
  check(content.includes(n), `lib/content.ts: lost the figure ${n}`);
}

// 6. The page's motion ships zero JS. This is a count, not a permission list -
//    a list can never fail "when a fourth appears", which is what the README
//    promises.
const clients = CODE
  .filter((f) => f.startsWith('components') && /^['"]use client['"]/m.test(read(f)))
  .map((f) => f.split(/[\\/]/).pop())
  .sort();
check(
  clients.length === 3 &&
    ['AskMeAnything.tsx', 'Counter.tsx', 'SectionRail.tsx'].every((c) => clients.includes(c)),
  `expected exactly 3 client components, found ${clients.length}: ${clients.join(', ')}`,
);

// 7. No dead links.
for (const f of CODE) {
  check(!/href[:=]\s*['"]#['"]/.test(read(f)), `${f}: has a placeholder href`);
}

// 8. One spelling. The audience is American; mixed spelling in the sentence a
//    recruiter reads hardest is the kind of detail this page claims to care about.
const BRITISH = /\b(authorised|normalised|colour|licence|favourite|behaviour|organis(e|ed|ation))\b/i;
for (const f of ALL) {
  if (f.endsWith('invariants.mjs')) continue;
  const m = read(f).match(BRITISH);
  check(!m, `${f}: en-GB spelling (${m?.[0]})`);
}

if (fail.length) {
  console.error('\ninvariants: %d violation(s)\n', fail.length);
  for (const m of fail) console.error('  - ' + m);
  process.exit(1);
}
console.log('invariants: all clear (%d files)', ALL.length);
