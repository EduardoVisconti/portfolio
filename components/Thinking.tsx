import { THINKING } from '@/lib/content';
import { Reveal } from './Reveal';
import { SectionHeader } from './SectionHeader';

/**
 * The heart of the page. The claim is set at near-headline scale because the
 * claim IS the product; the accent BECAUSE pivot turns three statements into
 * three arguments. Do not shrink the claim to fit more text.
 */
export function Thinking() {
  return (
    <section id="thinking" data-screen-label="03 How I Think" className="py-section">
      <div className="mb-[clamp(40px,5vw,64px)]">
        <SectionHeader n="03" title="How I Think" aside="3 DECISIONS FROM PRODUCTION" />
      </div>

      <Reveal
        range={24}
        as="p"
        className="m-0 mb-[clamp(48px,6vw,84px)] max-w-[640px] text-p-intro text-ink-muted [text-wrap:pretty]"
      >
        My strongest work is private. So instead of screenshots, here are three decisions I
        actually made — each one a class of bug that would otherwise have shipped green.
      </Reveal>

      {THINKING.map((adr, i) => (
        <Reveal
          key={adr.n}
          range={24}
          as="article"
          className={`flex flex-wrap gap-x-[clamp(36px,6vw,88px)] gap-y-6 border-t border-strong py-[clamp(36px,4vw,56px)] ${
            i === THINKING.length - 1 ? 'border-b' : ''
          }`}
        >
          <div className="flex flex-[0_0_160px] flex-col gap-[10px]">
            <span className="font-mono text-m-11 font-medium tracking-t7 text-accent">
              ADR — {adr.n}
            </span>
            <span className="font-mono text-m-11 tracking-t7 text-ink-label">{adr.category}</span>
          </div>

          <div className="max-w-[760px] flex-[1_1_480px]">
            <h3 className="m-0 font-display text-d-claim font-normal text-ink [text-wrap:pretty]">
              {adr.claim}
            </h3>
            <div className="mt-[26px] flex gap-[14px] border-t border-soft pt-[22px]">
              <span className="flex-[0_0_auto] font-mono text-m-10-w font-medium tracking-t8 text-accent">
                BECAUSE
              </span>
              <p className="m-0 text-p-body-l text-ink-prose [text-wrap:pretty]">
                {adr.because}
                {'becauseMono' in adr && adr.becauseMono ? (
                  <>
                    <span className="font-mono text-[.9em] text-ink-secondary">{adr.becauseMono}</span>
                    {adr.becauseAfter}
                  </>
                ) : null}
              </p>
            </div>
          </div>
        </Reveal>
      ))}
    </section>
  );
}
