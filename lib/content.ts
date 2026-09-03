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
  title: 'Full-Stack Engineer',
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
    `AI Engineer at ${IDENTITY.employer} since ${IDENTITY.since}, working as a ` +
    'Full-Stack Engineer across a Python backend and a TypeScript front end. ' +
    'Five years at Tesla before software; self-taught into it from 2021.',
  support:
    'Budget ceilings. Human approval gates. Failure classification. Self-healing ' +
    'when an upstream source changes shape. Front-end is my favorite half of ' +
    'full-stack, so this page is a work sample too.',
  stats: [
    { label: 'INTEGRATIONS',     value: 77,    suffix: '' },
    { label: 'US COUNTIES',      value: 3000,  suffix: '+' },
    { label: 'DECISION RECORDS', value: 46,    suffix: '' },
    { label: 'LINES OF TESTS',   value: 68672, suffix: '' },
  ],
} as const;

export const NUMBERS = {
  commits:      { value: 1271, of: 1297, pct: '98.0%' },
  commitsLabel: 'COMMITS · PRODUCTION DEED-RETRIEVAL PLATFORM · SOLE ENGINEER',
  code: {
    caption: 'TEST SURFACE VS SOURCE SURFACE',
    tests:  { label: 'TESTS',  value: 68672, width: '100%' },
    source: { label: 'SOURCE', value: 50302, width: '73.2%' }, // 50302 / 68672
    ratio: '1.37×',
  },
  ledger: [
    { label: 'Vendor-portal integrations behind one dispatcher', value: 77,   suffix: '' },
    { label: 'Nationwide US county coverage',                    value: 3000, suffix: '+' },
    { label: 'Architecture decision records written',            value: 46,   suffix: '' },
    { label: 'Pull requests shipped', qualifier: '· 93% merged', value: 120,  suffix: '' },
    { label: 'Pull requests on Forja', qualifier: '· my own product', value: 187, suffix: '' },
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
    claim: 'Layer boundaries are enforced by a CI gate that fails the pull request.',
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
    period: '2026 — NOW',
    kicker: 'MY OWN PRODUCT · SHIPPING',
    kickerAccent: true,
    description:
      'Built end to end and still shipping: web app, native iOS build on TestFlight, ' +
      'and a written case study on the architecture behind it. The place I get to make ' +
      'the boundary calls with nobody to argue with but future me.',
    meta: ['187 PULL REQUESTS', 'REACT NATIVE', 'NEXT.JS', 'POSTGRESQL RLS'],
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
    kicker: 'SOLE ENGINEER · PRODUCTION',
    description:
      'An agent-driven retrieval system running against 77 county and vendor portals ' +
      'through one dispatcher, nationwide. Budget ceilings per run, human approval ' +
      'gates before anything irreversible, failure classified rather than retried ' +
      'blindly, and self-healing when an upstream page changes shape.',
    meta: ['1,271 COMMITS', '77 INTEGRATIONS', '3,000+ COUNTIES', '46 ADRs'],
    privateBadge: {
      label: 'SOURCE PRIVATE',
      note: 'Described by scale, not screenshots. Happy to walk through the architecture live.',
    },
  },
  {
    title: 'AI Hub',
    period: 'APR 2026 — NOW',
    kicker: 'TEAM · IN PRODUCTION',
    description:
      'The internal multi-agent platform several departments run on. I build the ' +
      'client: Next.js and React 19, a custom NDJSON streaming protocol, the state ' +
      'architecture and the artifact rendering layer, against a Python/FastAPI/Agno ' +
      'backend with role-based access and a retrieval pipeline. Shipped through ' +
      'review by three engineers, on a suite of 1,300 unit and 200 end-to-end tests.',
    meta: ['32 PULL REQUESTS', 'NDJSON STREAMING', 'NEXT.JS', 'FASTAPI'],
    privateBadge: {
      label: 'INTERNAL',
      note: 'Company platform, so no link. Happy to walk through the streaming protocol live.',
    },
  },
  {
    title: 'Sueli Repulho',
    period: '2025 — NOW',
    kicker: 'CLIENT WORK · SHIPPED',
    description:
      'Practice site and the subscription product beside it, for a clinical ' +
      'psychologist with 42 years of practice. Two registers on one type system: a ' +
      'warm editorial site built to convert, and a dark, quiet product for writing ' +
      'in. Design, build and delivery were all mine.',
    meta: ['ASTRO', 'DESIGN SYSTEM', 'SEO-FIRST', 'CI SECURITY GATES'],
    links: [
      { label: 'LIVE SITE ↗', href: 'https://suelirepulho.com.br', external: true },
    ],
    shots: [
      { src: '/work/sueli-1-home.jpg', w: 1216, h: 760, alt: 'Practice home page, built for conversion' },
      { src: '/work/sueli-2-app.jpg', w: 1216, h: 760, alt: 'ConsciencIA: the subscription product, same type system inverted' },
    ],
  },
  {
    title: 'LeadFlow CRM',
    period: '2025',
    kicker: 'CLIENT PLATFORM · OPEN SOURCE',
    description:
      'A full CRM for electronics resellers — drag-and-drop pipeline, contact and ' +
      'product database with stock, tasks with overdue alerts, and model-scored deal ' +
      'health. The one in this list you can open and click through right now.',
    meta: ['NEXT.JS', 'SUPABASE', 'TANSTACK QUERY', 'GEMINI API'],
    links: [
      { label: 'LIVE DEMO ↗', href: 'https://leadflow-electronics.vercel.app', external: true },
      { label: 'SOURCE ↗',    href: 'https://github.com/EduardoVisconti/leadflow', external: true },
    ],
    shots: [
      { src: '/work/leadflow-1-dashboard.jpg', w: 1216, h: 760, alt: 'Pipeline dashboard: figures, recent deals and open tasks' },
    ],
  },
];

export const STACK = [
  { layer: 'AGENT',     accent: true, items: ['Anthropic tool-use', 'OpenAI tool-use', 'MCP', 'RAG'] },
  { layer: 'RUNTIME',   items: ['Python', 'FastAPI', 'asyncio', 'Docker', 'GitHub Actions'] },
  { layer: 'DATA',      items: ['PostgreSQL'], qualifiers: ['row-level security'] },
  { layer: 'INTERFACE', items: ['TypeScript', 'React', 'React Native', 'Next.js'] },
  { layer: 'PROOF',     items: ['pytest', 'Playwright'], qualifiers: ['68,672 lines of it'] },
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
    'How do you stop an agent burning budget?',
    'What breaks at 77 integrations?',
    'Why more test than source?',
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
