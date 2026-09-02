# eduardo-visconti.vercel.app

Personal site of an AI engineer in Tampa, FL. One scrolling page, seven
anchored sections.

It is built around a constraint: **the strongest work on it is private.** There
is no repo and no source to show for the flagship platform, so the page cannot
be a grid of project links. It argues three other ways instead - verified
figures with the period they were earned over, three engineering decisions
written out in full, and the things a visitor can open and use: the live apps,
and a console that answers questions about the owner.

## Stack

Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS.

Scroll reveals are pure CSS via `animation-timeline`, so the page's motion ships
**zero JavaScript** and degrades to a fully readable page without it. Three
components hold state and are therefore client components - `Counter`,
`SectionRail`, `AskMeAnything`. Everything else renders on the server.

## The two routes

`/api/chat` backs the Ask Me Anything console. It runs on **Gemini**, on the
free tier, because the site has to work without a paid API account. The system
prompt is `lib/assistant-context.ts`. The route is public and unauthenticated,
so it carries a per-IP window and a daily ceiling; both are per-instance and
therefore soft, and the edge is the real place for a hard limit.

There is no contact route. Delivering mail needs a verified sending domain and
this site does not own one, so section 07 is an email address and two links
rather than a form that fails silently.

## Content

Every figure and every string lives in `lib/content.ts`. Adding work over the
years means appending to `WORK` - the ledger layout follows without a redesign.

Figures are stated as fact, so a stale one is a wrong one. `lib/content.ts` and
`lib/assistant-context.ts` must agree, or the assistant will contradict the page
out loud. That pairing is checked, not remembered - see below.

A scheduled workflow opens an issue on the 3rd of each month to re-derive the
numbers, because they drift silently.

## Gates

```bash
npm run invariants   # the design rules, enforced
npm run typecheck
npm run lint
npm run build
```

CI runs those on every pull request, plus a secret scan (gitleaks), a dependency
audit (osv-scanner) and a link check over every external URL the page claims.
`CONTRIBUTING.md` lists the invariants and why each one exists.

## Local

```bash
npm ci
cp .env.example .env.local   # GEMINI_API_KEY, free at aistudio.google.com/apikey
npm run dev
```

Without the key the console returns 503 and the client says so plainly instead
of pretending to be live.

## Design

Zero border-radius and zero box-shadow, everywhere, deliberately. Structure
comes from 1px hairlines rather than cards. One accent, used for data and state
only. Instrument Serif at display sizes, IBM Plex Mono for every figure and
label. Tokens live in `tailwind.config.ts` and nowhere else.
