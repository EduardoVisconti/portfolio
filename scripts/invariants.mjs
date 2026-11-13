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
import { pathToFileURL } from 'node:url';

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
  // These two quote the forbidden phrases in order to forbid them.
  if (f.endsWith('invariants.mjs') || f.endsWith('CONTRIBUTING.md')) continue;
  const m = body.match(SEEKING);
  check(!m, `${f}: says it is looking for work (${m?.[0]})`);
}
check(/Never state or imply/.test(assistant), 'assistant-context.ts: lost the rule forbidding "open to opportunities"');

// 2. No emoji anywhere.
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{1F000}-\u{1F2FF}\u{2B00}-\u{2BFF}\u{FE0F}]/u;
// This file names every pattern it hunts, so it cannot be one of its own targets.
const SELF = (f) => f.endsWith('invariants.mjs');
for (const f of CODE) check(SELF(f) || !EMOJI.test(read(f)), `${f}: contains an emoji`);

// 3. Zero radius, zero shadow - in the utility names AND in raw CSS, which the
//    class-name check alone could not see.
for (const f of CODE) {
  if (SELF(f)) continue;
  const body = read(f);
  check(!/\brounded(-|\b)/.test(body), `${f}: uses a border radius utility`);
  check(!/\bshadow(-|\b)/.test(body), `${f}: uses a box shadow utility`);
  // Capture the value and test it. A lookahead here backtracks: `\s*` gives
  // back the space, the lookahead then passes because the next character is a
  // space rather than `0`, and `border-radius: 0` reads as non-zero.
  for (const m of body.matchAll(/border-radius\s*:\s*([^;}]+)/g)) {
    check(m[1].trim() === '0', `${f}: sets a non-zero border-radius (${m[1].trim()})`);
  }
  for (const m of body.matchAll(/box-shadow\s*:\s*([^;}]+)/g)) {
    check(m[1].trim() === 'none', `${f}: sets a box-shadow (${m[1].trim()})`);
  }
}

// 4. Colour resolves through tailwind.config.ts and nowhere else. rgba() counts
//    - a raw colour is a raw colour whatever notation it wears.
// tailwind.config builds from the palette, palette.ts holds the raw values,
// and this file quotes the pattern it searches for.
const COLOUR_EXEMPT = (f) => /tailwind\.config|palette\.ts|invariants\.mjs/.test(f);
for (const f of CODE.filter((f) => !COLOUR_EXEMPT(f))) {
  for (const [i, line] of read(f).split('\n').entries()) {
    if (/--[\w-]+\s*:/.test(line)) continue;   // a CSS custom-property declaration
    const c = line.match(/#[0-9a-fA-F]{3,8}\b|rgba?\(/);
    check(!c, `${f}:${i + 1}: hardcodes a colour (${c?.[0]})`);
  }
}

// 5. Figures are load-bearing. If one changes in content.ts and not in the
//    assistant's context, the assistant contradicts the page out loud. The
//    ledger is the source: it is imported, not grepped, so every row is checked
//    as a value with its suffix, and every other place the page states a figure
//    is checked against it. A list typed here would let a row drift past it.
const { HERO, NUMBERS, WORK, STACK, ASK } = await import(
  pathToFileURL(join(process.cwd(), 'lib/content.ts')).href
);
const llms = read('public/llms.txt');
const fmt = (row) => row.value.toLocaleString('en-US') + row.suffix;
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Bounded on both sides, so "70+" is not found inside "170+" and "60" is not
// found inside "600".
const figure = (f) => `(?<![\\d,.])${esc(f)}(?![\\d,])`;
// The words that say what each figure counts. A row with no key fails, so a new
// row cannot slip in unpaired.
const KEYS = [
  [/platforms/i, 'records-portal platforms'],
  [/counties/i, 'counties set up'],
  [/decision records/i, 'architecture decision records'],
  [/shipped image/i, 'tests run inside the shipped image'],
  [/AI Hub/, 'employees'],
  [/Forja/, 'tests'],
];
const ledgerFigures = new Set(NUMBERS.ledger.map(fmt));
for (const row of NUMBERS.ledger) {
  const key = KEYS.find(([re_]) => re_.test(row.label))?.[1];
  check(!!key, `lib/content.ts: ledger row "${row.label}" has no key in invariants.mjs`);
  if (!key) continue;
  const said = new RegExp(`${figure(fmt(row))}[^.]{0,30}${esc(key)}`, 'i');
  check(said.test(assistant), `lib/assistant-context.ts: does not say ${fmt(row)} ${key}`);
  check(said.test(llms), `public/llms.txt: does not say ${fmt(row)} ${key}`);
}
// The hero repeats the first four ledger rows.
HERO.stats.forEach((s, i) => {
  check(fmt(s) === fmt(NUMBERS.ledger[i]),
    `lib/content.ts: hero stat ${s.label} says ${fmt(s)}, ledger row ${i + 1} says ${fmt(NUMBERS.ledger[i])}`);
});
// Short labels elsewhere on the page may only state a ledger figure. In a tag
// the count is the number that opens it ("70+ PLATFORMS", "ABOUT 60 USERS"), so
// a version like "NEXT.JS 16" is not read as one; a question can put it anywhere.
const counts = [
  ...[...WORK.flatMap((w) => w.meta), ...STACK.flatMap((r) => ('qualifiers' in r ? r.qualifiers : []))]
    .map((label) => [label, label.match(/^(?:about\s+)?(\d[\d,]*\+?)/i)?.[1]]),
  ...ASK.chips.flatMap((chip) => [...chip.matchAll(/(?<![\d,.])\d[\d,]*\+?/g)].map(([n]) => [chip, n])),
].filter(([, n]) => n);
for (const [label, n] of counts) {
  check(ledgerFigures.has(n), `lib/content.ts: "${label}" states ${n}, which is not a ledger figure`);
}
// Figures inside the work descriptions, with the word after them, must be in
// the assistant's context too ("10 to 30 minutes", "42 years", "75% of").
for (const w of WORK) {
  for (const [, n, word] of w.description.matchAll(/(?<![\d,.])(\d[\d,]*\+?%?)\s+(\w+)/g)) {
    check(new RegExp(`${figure(n)}\\s+${esc(word)}\\b`).test(assistant),
      `lib/assistant-context.ts: does not say "${n} ${word}" (${w.title})`);
  }
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

// 7. Contrast, computed from the tokens rather than from a rendered page.
//    Lighthouse cannot judge this here: it audits without scrolling, so every
//    reveal below the fold is still on its from-state and axe measures text at
//    opacity 0. Reading the palette at the source has no such blind spot.
const CONTENT_INK = ['DEFAULT', 'bright', 'mono', 'secondary', 'prose', 'muted', 'faint', 'dim', 'label', 'idle'];
// Colours live in two files by design: lib/palette.ts holds the raw values that
// tailwind.config.ts and the OG card both build from.
const swatches = [read('tailwind.config.ts'), read('lib/palette.ts')].join('\n');
// The boundary is explicit rather than \b: a key preceded by `{` or a comma is
// not a word boundary the way it looks like it should be.
const hexOf = (name) =>
  swatches.match(new RegExp(`(?:^|[\\s{,])${name}:\\s*'(#[0-9a-fA-F]{6})'`, 'm'))?.[1];
const luminance = (hex) => {
  const ch = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
};
const ratio = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
const bg = hexOf('bg');
check(!!bg, 'tailwind.config.ts: no bg colour to measure contrast against');
for (const name of CONTENT_INK) {
  const hex = hexOf(name);
  if (!hex) { check(false, `tailwind.config.ts: ink.${name} is gone`); continue; }
  const r = ratio(hex, bg);
  // `separator` is deliberately absent: it draws the "/" glyphs and the idle
  // rail tick, both aria-hidden, and is decoration rather than text.
  check(r >= 4.5, `ink.${name} (${hex}) is ${r.toFixed(2)}:1 on ${bg} - under the 4.5:1 the config documents as its floor`);
}

// 8. No dead links.
for (const f of CODE) {
  check(!/href[:=]\s*['"]#['"]/.test(read(f)), `${f}: has a placeholder href`);
}

// 9. One spelling. The audience is American; mixed spelling in the sentence a
//    recruiter reads hardest is the kind of detail this page claims to care about.
const BRITISH = /\b(authorised|normalised|colour|licence|favourite|behaviour|organis(e|ed|ation))\b/i;
for (const f of ALL) {
  if (SELF(f)) continue;
  const m = read(f).match(BRITISH);
  check(!m, `${f}: en-GB spelling (${m?.[0]})`);
}

if (fail.length) {
  console.error('\ninvariants: %d violation(s)\n', fail.length);
  for (const m of fail) console.error('  - ' + m);
  process.exit(1);
}
console.log('invariants: all clear (%d files)', ALL.length);
