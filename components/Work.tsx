import Image from 'next/image';
import { WORK } from '@/lib/content';
import { Reveal } from './Reveal';
import { SectionHeader } from './SectionHeader';

/**
 * A ledger, not a card grid. Adding work over the years = append to WORK in
 * lib/content.ts; the layout does not fight you. The bottom rule is derived
 * from the last index, never hard-coded.
 */
export function Work() {
  const linkCls =
    'inline-flex items-center gap-2 border-b border-link pb-[5px] font-mono text-m-11 ' +
    'font-medium tracking-t6 text-ink transition-colors hover:border-accent hover:text-accent';

  return (
    <section id="work" data-screen-label="04 Work" className="py-section">
      <div className="mb-[clamp(30px,4vw,48px)]">
        <SectionHeader n="02" title="Work" aside="SELECTED · 2024 — 2026" />
      </div>

      {WORK.map((item, i) => (
        <Reveal
          key={item.title}
          className={`-mx-5 flex flex-wrap gap-x-11 gap-y-7 border-t border-rule px-5 py-[clamp(30px,3.4vw,44px)] transition-colors hover:bg-rowhover ${
            i === WORK.length - 1 ? 'border-b' : ''
          }`}
        >
          <span className="flex-[0_0_34px] font-mono text-m-10-r tracking-t4 text-ink-faint">
            {String(i + 1).padStart(2, '0')}
          </span>

          <div className="max-w-[300px] flex-[1_1_230px]">
            <h3 className="mb-2 mt-0 font-display text-d-project font-normal text-ink">
              {item.title}
            </h3>
            <div className={`font-mono text-m-11-r tracking-t6 ${item.kickerAccent ? 'text-accent' : 'text-ink-dim'}`}>
              {item.kicker}
            </div>
            <span className="mt-[7px] block font-mono text-m-10-r tracking-t4 text-ink-dim">
              {item.period}
            </span>
          </div>

          <div className="max-w-[560px] flex-[2_1_360px]">
            <p className="mb-5 mt-0 text-p-body text-ink-prose [text-wrap:pretty]">
              {item.description}
            </p>
            <div className="flex flex-wrap items-center gap-x-[18px] gap-y-2 font-mono text-m-11-r tracking-t3 text-ink-dim">
              {item.meta.map((m, k) => (
                <span key={m} className="flex items-center gap-x-[18px]">
                  {k > 0 ? <span aria-hidden className="text-ink-separator">/</span> : null}
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div className="ml-auto flex flex-[0_0_auto] flex-col items-start gap-[10px]">
            {item.links?.map((l) => (
              <a
                key={l.label}
                href={l.href}
                {...(l.external ? { target: '_blank', rel: 'noopener' } : {})}
                className={linkCls}
              >
                {l.label}
              </a>
            ))}

            {item.privateBadge ? (
              <>
                {/* The design's answer to "my best work is private": reads as
                    redacted without a lock icon or a blurred fake screenshot. */}
                <span
                  className="inline-flex items-center gap-[9px] border border-chip px-[14px] py-[9px] font-mono text-m-10 font-medium tracking-t7 text-ink-muted"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(135deg, rgba(255,255,255,.05) 0 1px, transparent 1px 6px)',
                  }}
                >
                  {item.privateBadge.label}
                </span>
                <span className="max-w-[190px] font-mono text-m-11-r tracking-t2 text-ink-faint">
                  {item.privateBadge.note}
                </span>
              </>
            ) : null}
          </div>

          {/* Screens sit on a hairline, at one shared height: a phone and a
              desktop capture then read as one band instead of fighting. */}
          {item.shots?.length ? (
            <div className="-mx-5 w-full overflow-x-auto px-5 pt-2">
              <div className="flex w-max gap-3">
                {item.shots.map((s) => (
                  <Image
                    key={s.src}
                    src={s.src}
                    alt={s.alt}
                    width={s.w}
                    height={s.h}
                    sizes="(max-width: 780px) 60vw, 40vw"
                    className="h-[clamp(180px,21vw,290px)] w-auto border border-panel"
                  />
                ))}
              </div>
            </div>
          ) : null}
        </Reveal>
      ))}
    </section>
  );
}
