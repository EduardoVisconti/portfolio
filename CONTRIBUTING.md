# Contributing

One person maintains this, so this file is short. It exists for the rules whose
violation is **expensive and silent** - the ones you would not notice in review.

Everything below is enforced by `npm run invariants`, which runs on every pull
request. If you disagree with a rule, change the rule and the check together.
A rule that lives only in prose is a rule that decays; that is the argument the
site itself makes in ADR 03, so it would be strange not to apply it here.

## The invariants

1. **The site never says it is looking for work.** No "open to opportunities",
   no "available for hire", no variant. This is a standing constraint from the
   owner, not a copy preference. The page reads as someone with work.
2. **No emoji.** The only non-alphanumeric glyphs are the ones the design
   specifies: `·` `↗` `→` `↓` `/` `›` `✓` `—`.
3. **Zero border-radius, zero box-shadow.** Everywhere, no exceptions. They are
   the two fastest ways for a page to read as a template.
4. **Semantic color names only.** No raw hex and no `rgba()` in application
   code. Raw values live in `lib/palette.ts`, which `tailwind.config.ts` builds
   from and the Open Graph card imports - satori renders inline styles and
   cannot resolve a Tailwind class.
5. **Figures live in one place and are mirrored.** Every number is stated as
   fact, so a stale one is a wrong one. If a figure changes in
   `lib/content.ts`, change it in `lib/assistant-context.ts` too, or the
   assistant will contradict the page out loud, to a stranger, with confidence.
6. **Exactly three components may hold state.** `Counter`, `SectionRail`,
   `AskMeAnything`. Everything else is a Server Component, which is how the
   page's motion ships zero JavaScript. The check asserts the count, not a
   permission list, so a fourth fails the build.
7. **No placeholder `href="#"`.** A dead link in production is a defect. If the
   URL does not exist yet, remove the link.

## Things the gate cannot check

- **Do not add sections.** The seven are the site. New work is a row appended to
  `WORK` in `lib/content.ts`; the ledger layout follows without a redesign.
- **Do not scroll-jack.** No smooth-scroll library, no wheel interception.
- **Reduced motion must leave nothing stranded** at `opacity: 0`.
- **With JavaScript disabled the page must still read**, with every figure
  showing its real value.

## Before opening a pull request

```bash
npm run invariants
npm run typecheck
npm run lint
npm run build
```

CI runs those, plus a secret scan, a dependency audit, and a link check over
every external URL the page claims.

8. **One spelling: American.** The audience is US recruiters, and mixed en-GB /
   en-US in the sentence they read hardest is the detail this page claims to
   care about.
