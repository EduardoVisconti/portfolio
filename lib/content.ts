/**
 * SINGLE SOURCE OF TRUTH for every number and string on the page.
 *
 * Every figure here is verified and owner-supplied. Do not change, round, or
 * invent one. Adding work over the years = append to WORK; the layout follows.
 */

export const SITE = 'https://eduardo-visconti.vercel.app';

export const IDENTITY = {
  name: { first: 'Eduardo', last: 'Visconti' },
  role: 'AI ENGINEER · FULL-STACK',
  location: 'TAMPA, FL',
  languages: 'EN · PT · ES',
  email: 'eduardo.visconti.dev@gmail.com',
  title: 'AI Developer',
  employer: 'United Financial Resources',
  employerCity: 'Bradenton, FL',
  since: 'April 2026',
  authorized: 'Authorized to work in the United States',
  resume: '/resume.pdf',
  linkedin: 'https://linkedin.com/in/eduardo-visconti',
  github: 'https://github.com/eduardovisconti',
} as const;

export const HERO = {
  ledeBefore: 'I build production systems where an ',
  ledeAccent: 'LLM agent is part of the runtime',
  ledeAfter: ' — not a demo bolted to the side of one.',
  now:
    `${IDENTITY.title} at ${IDENTITY.employer} since ${IDENTITY.since}, working ` +
    'across a Python backend and a TypeScript frontend. ' +
    'Five years at Tesla before software; self-taught into it from 2021.',
  support:
    'The deed agent is capped by iterations, and a person approves any change to ' +
    'how a county is validated or searched. Frontend is my favorite half of ' +
    'full-stack, so this page is a work sample too.',
  stats: [
    { label: 'PORTAL PLATFORMS', value: 70,   suffix: '+' },
    { label: 'COUNTIES SET UP',  value: 840,  suffix: '+' },
    { label: 'DECISION RECORDS', value: 60,   suffix: '' },
    { label: 'TESTS PER PR',     value: 7500, suffix: '+' },
  ],
} as const;

export const NUMBERS = {
  ledger: [
    { label: 'Records-portal platforms with an automated integration', value: 70, suffix: '+' },
    { label: 'Counties set up for automated search', value: 840, suffix: '+' },
    { label: 'Architecture decision records written', value: 60, suffix: '' },
    { label: 'Tests run inside the shipped image on every pull request', value: 7500, suffix: '+' },
    {
      label: 'Employees on AI Hub, the platform whose frontend I lead',
      qualifier: '· approximate',
      value: 60,
      suffix: '',
    },
    { label: 'Tests on Forja', qualifier: '· my own product', value: 5000, suffix: '+' },
  ],
} as const;

/** Each decision names the project it came from. The section offers them
  * instead of the private work, and all three are in fact from Forja - which
  * anyone who opens the case study will notice. Better to say it. */
export const THINKING = [
  {
    n: '01',
    project: 'FORJA',
    category: 'SYNC · CONSISTENCY',
    claim: 'Deletions sync as tombstones, under the same last-write-wins rule as any write.',
    because:
      'A delete that is merely an absence is indistinguishable from a record the peer ' +
      'has not seen yet. Treat it as absence and the row resurrects on the next sync — ' +
      "silently, on someone else's device, with no error anywhere in the log.",
  },
  {
    n: '02',
    project: 'FORJA',
    category: 'TIME · TEST DESIGN',
    claim: 'Date-sensitive tests run in a non-UTC timezone. Always.',
    because:
      'A suite running in UTC cannot tell local day from UTC day — the two are the same ' +
      'number, so every off-by-one-day bug passes CI and ships. Move the runner to ',
    becauseMono: 'Asia/Tokyo',
    becauseAfter: ' and the class of bug stops being invisible.',
  },
  {
    n: '03',
    project: 'FORJA',
    category: 'STRUCTURE · CI',
    claim: 'A CI gate blocks screens and components from importing services or the database client directly.',
    because:
      'A written-down rule decays within a month. An architecture is only real if ' +
      'something mechanical refuses the commit that breaks it — the gate is the ' +
      'document, the markdown is the footnote.',
  },
] as const;

export type WorkItem = {
  title: string;
  /** A figure without a time denominator is a shrug. */
  period: string;
  kicker: string;
  kickerAccent?: boolean;
  description: string;
  meta: string[];
  links?: { label: string; href: string; external?: boolean }[];
  privateBadge?: { label: string; note: string };
  /** Normalized to a common height, so a phone and a desktop sit in one band. */
  shots?: { src: string; w: number; h: number; alt: string }[];
};

export const WORK: WorkItem[] = [
  {
    title: 'Forja',
    period: 'MAR 2026 — NOW',
    kicker: 'MY OWN PRODUCT · IOS BETA',
    kickerAccent: true,
    description:
      'A training app for people who take training seriously and mix lifting, HYROX, ' +
      'functional work and running. Workouts, cardio, programs, habits, body weight and ' +
      'progress live in one app, and the whole workout fits on one screen like a ' +
      'spreadsheet, edited with a tap. I tested the popular apps and none of them covered ' +
      'all of it, so I built Forja from what each one did best. The iOS beta on TestFlight ' +
      'is open to anyone with the link and has 10 testers, and the web app is live. A full ' +
      'redesign is in progress.',
    meta: ['5,000+ TESTS', 'OFFLINE-FIRST', 'REACT NATIVE', 'SUPABASE'],
    links: [
      { label: 'LIVE APP ↗', href: 'https://app.forjahybrid.com', external: true },
      { label: 'TESTFLIGHT ↗', href: 'https://testflight.apple.com/join/bRREz5sS', external: true },
      {
        label: 'CASE STUDY ↗',
        href: 'https://github.com/EduardoVisconti/forja-case-study',
        external: true,
      },
    ],
    shots: [
      { src: '/work/forja-1-runner.jpg', w: 349, h: 760, alt: 'Guided session: exercise, set, rest timer, next' },
      { src: '/work/forja-2-summary.jpg', w: 349, h: 760, alt: 'Session summary with volume, sets and personal records' },
      { src: '/work/forja-3-progress.jpg', w: 349, h: 760, alt: 'Monthly progress calendar and cardio trends' },
      { src: '/work/forja-4-habits.jpg', w: 349, h: 760, alt: 'Daily habit protocol with streaks' },
    ],
  },
  {
    title: 'Deed Retrieval Platform',
    period: 'APR 2026 — NOW',
    kicker: 'BUILT FROM SCRATCH · OWNER',
    description:
      'Built to replace a deed lookup that takes someone 10 to 30 minutes by hand. Given ' +
      "an owner and a county, it finds the county's records portal, logs in, runs the " +
      'search, checks the PDF and returns the deed to AI Hub or the company CRM. When a ' +
      'portal breaks, an agent capped by iterations diagnoses it and proposes a fix, and ' +
      "a person approves any change to a county's validation or retrieval settings.",
    meta: ['70+ PLATFORMS', '840+ COUNTIES', '60 ADRs', '7,500+ TESTS'],
    privateBadge: {
      label: 'SOURCE PRIVATE',
      note: 'Described by scale, not screenshots. Happy to walk through the architecture live.',
    },
  },
  {
    title: 'AI Hub',
    period: 'APR 2026 — NOW',
    kicker: 'FRONTEND LEAD · IN PRODUCTION',
    description:
      "The company's internal multi-agent chat platform, used by about 60 employees. I " +
      'lead the frontend: I redesigned the whole interface on my own, built how people ' +
      'organize their work in projects and pinned and archived chats, fixed a streaming ' +
      'race that lost or merged up to 75% of agent replies, and wrote the MCP server that ' +
      'lets its agents search for deeds.',
    meta: ['ABOUT 60 USERS', 'FRONTEND LEAD', 'NEXT.JS 16', 'MCP'],
    privateBadge: {
      label: 'INTERNAL',
      note: 'Company platform, so no link and no screenshots. Happy to walk through the streaming fix live.',
    },
  },
  {
    title: 'ConsciencIA',
    period: 'SEP 2026 — NOW',
    kicker: 'CLIENT WORK · LIVE',
    description:
      "A private journaling app where a psychology practice's patients get AI feedback on " +
      'what they write. Entries are encrypted at rest, patients consent item by item and ' +
      'are asked again only when the consent text changes, and the AI key never reaches ' +
      'the browser. It lives in its own repository, apart from the practice site, so ' +
      'access to the site never grants access to code that handles health data.',
    meta: ['ASTRO', 'PHP + MYSQL', 'ENCRYPTED AT REST', 'CONSENT BY ITEM'],
    privateBadge: {
      label: 'CLIENT · PRIVATE',
      note: 'The app holds patient data, so the screens are its public landing. Happy to walk through the consent model live.',
    },
    shots: [
      {
        src: '/work/consciencia-1-landing.jpg',
        w: 1216,
        h: 760,
        alt: 'Landing page with a sample entry and the feedback it gets',
      },
      {
        src: '/work/consciencia-2-example.jpg',
        w: 349,
        h: 760,
        alt: 'The same sample entry and feedback on a phone',
      },
    ],
  },
  {
    title: 'Sueli Repulho',
    period: '2025 — NOW',
    kicker: 'CLIENT WORK',
    description:
      'The website and course sales pages for a clinical psychologist with 42 years of ' +
      'practice. A static Astro build for a shared host with no Node, so the only backend ' +
      'is a PHP lead form with a honeypot, an origin check, dedup and two rate limits. ' +
      "Google's tags load only after the visitor accepts, and end-to-end tests run on " +
      'desktop and mobile.',
    meta: ['ASTRO', 'PHP + MYSQL', 'CONSENT MODE', 'CI SECURITY GATES'],
    shots: [
      { src: '/work/sueli-site-1-home.jpg', w: 1216, h: 760, alt: 'Practice home page, built for conversion' },
      { src: '/work/sueli-site-2-home-phone.jpg', w: 349, h: 760, alt: 'The same home page on a phone' },
    ],
  },
];

export const STACK = [
  { layer: 'AGENT',     accent: true, items: ['LLM agents', 'Tool calling', 'MCP', 'LiteLLM'], qualifiers: ['self-hosted models'] },
  { layer: 'RUNTIME',   items: ['Python', 'FastAPI', 'asyncio', 'Docker', 'GitHub Actions'] },
  { layer: 'DATA',      items: ['PostgreSQL'], qualifiers: ['row-level security'] },
  { layer: 'INTERFACE', items: ['TypeScript', 'React', 'React Native', 'Expo', 'Next.js'] },
  { layer: 'PROOF',     items: ['pytest', 'Playwright', 'Vitest'], qualifiers: ['7,500+ tests in the shipped image'] },
] as const;

export const ASK = {
  headBefore: "Don't read about me. ",
  headAccent: 'Interrogate',
  headAfter: ' the site.',
  support:
    'A real model-backed route with my context loaded — the same one running in ' +
    "production here. If you're screening me, this is faster than the résumé and it " +
    'answers follow-ups.',
  emptyPrompt:
    "Ask about the architecture, the failure modes, the hiring fit — or the parts I can't show you.",
  chips: [
    'How do you keep an agent from changing the wrong thing?',
    'What breaks across 70+ portal platforms?',
    'Why run the tests inside the shipped image?',
    'Is he senior enough for an AI platform role?',
  ],
  placeholder: 'Type a question…',
  fallback:
    "The live route isn't reachable right now. Meanwhile, " +
    'eduardo.visconti.dev@gmail.com reaches me directly.',
  rateLimited:
    'That is the hourly limit for one visitor. It exists so a script cannot spend ' +
    'the budget. Come back in an hour, or email eduardo.visconti.dev@gmail.com.',
  dailyLimit:
    'That is the whole allowance for today, across every visitor. It resets at ' +
    'midnight UTC. eduardo.visconti.dev@gmail.com does not have a quota.',
  unconfigured:
    'This console is not wired to a key right now. ' +
    'eduardo.visconti.dev@gmail.com reaches me directly.',
} as const;

export const CONTACT = {
  headline: "Tell me what you're building.",
  support:
    "If it has an agent in the runtime and a real failure budget, I'll have opinions " +
    'before the call ends.',
} as const;

export const SECTIONS = [
  { n: '01', id: 'top',      title: 'Hero',            aside: null,                         nav: false },
  { n: '02', id: 'work',     title: 'Work',            aside: 'SELECTED · 2025 — 2026',     nav: true  },
  { n: '03', id: 'thinking', title: 'How I Think',     aside: '3 DECISIONS FROM PRODUCTION', nav: true },
  { n: '04', id: 'numbers',  title: 'The Numbers',     aside: 'ALL VERIFIED',               nav: true  },
  { n: '05', id: 'stack',    title: 'Stack',           aside: 'BY LAYER, NOT BY LOGO',      nav: false },
  { n: '06', id: 'ask',      title: 'Ask Me Anything', aside: 'LIVE · /api/chat',           nav: true  },
  { n: '07', id: 'contact',  title: 'Contact',         aside: 'DIRECT · I ANSWER',          nav: false },
] as const;

export const FOOTER = {
  resumeLabel: 'RÉSUMÉ (PDF) ↗',
  copyright: '© 2026 EDUARDO VISCONTI',
  place: 'TAMPA, FL · EN · PT · ES',
  built: 'NEXT.JS · TAILWIND · TYPESCRIPT',
} as const;
