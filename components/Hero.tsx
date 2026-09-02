import { HERO, IDENTITY } from '@/lib/content';
import { Counter } from './Counter';

/**
 * Server component except the counters. Delay-based entrance (SPEC-motion.md §2)
 * via inline animation shorthand — the only place delays are used, because on
 * first paint there is no scroll to drive anything.
 */
export function Hero() {
  const ease = 'cubic-bezier(.16,1,.3,1)';

  return (
    <section
      id="top"
      data-screen-label="01 Hero"
      className="flex min-h-[100svh] flex-col justify-center pb-10 pt-[120px]"
    >
      <div
        className="flex flex-wrap items-center gap-x-7 gap-y-4 pb-[22px]"
        style={{ animation: 'fadeIn .8s ease .05s both' }}
      >
        <span className="inline-flex items-center gap-2 font-mono text-m-11 tracking-t8 text-accent">
          <span className="h-[5px] w-[5px] animate-pulse bg-accent" aria-hidden />
          {IDENTITY.role}
        </span>
        <span className="font-mono text-m-11 tracking-t8 text-ink-label">{IDENTITY.location}</span>
        <span className="font-mono text-m-11 tracking-t8 text-ink-label">{IDENTITY.languages}</span>
      </div>

      {/* Each line rises from a clip. 120ms offset is the whole effect. */}
      <h1 className="m-0 font-display text-d-name font-normal text-ink">
        <span className="block overflow-hidden">
          <span className="block" style={{ animation: `heroIn 1s ${ease} .1s both` }}>
            {IDENTITY.name.first}
          </span>
        </span>
        <span className="block overflow-hidden">
          <span className="block" style={{ animation: `heroIn 1s ${ease} .22s both` }}>
            {IDENTITY.name.last}
          </span>
        </span>
      </h1>

      <div
        className="h-px origin-left bg-[rgba(255,255,255,.12)] my-[clamp(26px,3vw,36px)] mt-[clamp(32px,4vw,52px)]"
        style={{ animation: `rvx .9s ${ease} .5s both` }}
        aria-hidden
      />

      <div
        className="flex flex-wrap gap-x-14 gap-y-8"
        style={{ animation: `heroIn .9s ${ease} .58s both` }}
      >
        <p className="m-0 max-w-[640px] flex-[1_1_420px] text-p-lede text-ink-bright [text-wrap:pretty]">
          {HERO.ledeBefore}
          <em className="font-display text-[1.1em] italic text-accent">{HERO.ledeAccent}</em>
          {HERO.ledeAfter}
        </p>
        <p className="m-0 max-w-[400px] flex-[1_1_280px] text-p-small text-ink-muted [text-wrap:pretty]">
          {HERO.support}
        </p>
      </div>

      {/*
        The 1px gap over a .09-white parent renders the hairlines — the cells
        look like a bordered table with no borders declared.
      */}
      <div
        className="mt-[clamp(48px,6vw,88px)] flex flex-wrap gap-px border-y border-rule bg-rule"
        style={{ animation: 'fadeIn 1s ease .8s both' }}
      >
        {HERO.stats.map((s) => (
          <div key={s.label} className="flex-[1_1_150px] bg-bg px-5 pb-4 pt-[18px]">
            <div className="mb-[9px] font-mono text-m-10 tracking-t8 text-ink-label">{s.label}</div>
            <div className="font-display text-d-stat text-ink">
              <Counter value={s.value} suffix={s.suffix} />
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-[26px] flex justify-end font-mono text-m-10 tracking-t9 text-ink-faint"
        style={{ animation: 'fadeIn 1s ease 1.1s both' }}
      >
        SCROLL ↓
      </div>
    </section>
  );
}
