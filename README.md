# eduardo-visconti.vercel.app

Personal site. One scrolling page, seven sections, no images: every mark on the
page is type, rule, or solid fill.

The site solves one problem. The strongest work in it is private, so it cannot be
a grid of project screenshots. It conveys judgment and scale three other ways:
verified numbers, the engineering decisions written out, and the two things a
visitor can actually touch (a Claude-backed Q&A console and a working contact form).

## Stack

Next.js (App Router) - TypeScript - Tailwind CSS - Framer Motion.
Scroll reveals are pure CSS, so the main motion of the page ships zero JavaScript.
Only four components are client components: `Counter`, `SectionRail`,
`AskMeAnything`, `Contact`.

## Content

Every number and string lives in `lib/content.ts`, and the assistant's system
prompt in `lib/assistant-context.ts`. Adding work over the years means appending
to `WORK` - the ledger layout follows without changes.

## Local

```bash
npm install
cp .env.example .env.local   # fill in the keys
npm run dev
```

## Design

Tokens, section anatomy, motion and copy are specified in the design handoff that
produced this build. Zero border-radius and zero box-shadow are deliberate and
apply everywhere.
