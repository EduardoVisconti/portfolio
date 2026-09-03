import { NUMBERS } from '@/lib/content';
import { Counter } from './Counter';
import { Reveal } from './Reveal';
import { SectionHeader } from './SectionHeader';

export function Numbers() {
  const { commits, commitsLabel, code, ledger } = NUMBERS;

  return (
    <section id="numbers" className="py-section">
      <div className="mb-[clamp(44px,6vw,76px)]">
        <SectionHeader id="numbers" />
      </div>

      <Reveal range={26} className="flex flex-wrap items-end gap-[clamp(36px,5vw,72px)]">
        {/* --- 1,271 / 1,297 with a 98% bar --- */}
        <div className="flex-[1_1_380px]">
          <div className="flex flex-wrap items-baseline gap-[14px]">
            <span className="font-display text-d-figure text-ink">
              <Counter value={commits.value} />
            </span>
            <span className="font-display text-d-denom text-ink-faint">
              / {commits.of.toLocaleString('en-US')}
            </span>
          </div>

          <div className="relative mt-[26px] h-0.5 overflow-hidden bg-bartrack">
            {/* Derived, not typed: a literal drifts the moment the commit share
                changes, and the bar would then disagree with the figure that
                labels it. */}
            <div
              className="bar-draw bar-draw-slow absolute inset-y-0 left-0 bg-accent"
              style={{
                right: `${(100 - (100 * NUMBERS.commits.value) / NUMBERS.commits.of).toFixed(1)}%`,
              }}
            />
          </div>

          <div className="mt-[14px] flex justify-between gap-5 font-mono text-m-11-r tracking-t5 text-ink-muted">
            <span>{commitsLabel}</span>
            <span className="whitespace-nowrap text-accent">{commits.pct}</span>
          </div>
        </div>

        {/* --- test vs source ---
            Both fills sit inside a shared flex:1 1 0 / min-w-0 track. Putting
            73.2% directly on a flex child makes it a flex-basis and overflows. */}
        <div className="max-w-[520px] flex-[1_1_320px]">
          <div className="mb-[22px] font-mono text-m-11 tracking-t8 text-ink-label">
            {code.caption}
          </div>

          {([code.tests, code.source] as const).map((row, i) => (
            <div key={row.label} className={`flex items-center gap-4 ${i === 0 ? 'mb-3' : ''}`}>
              <span className="flex-[0_0_62px] font-mono text-m-10 tracking-t6 text-ink-muted">
                {row.label}
              </span>
              <span className="block min-w-0 flex-[1_1_0]">
                <span
                  className={`bar-draw block h-[22px] ${i === 0 ? 'bg-accent' : 'bg-barsource'}`}
                  style={{ width: row.width, ...(i === 1 ? { animationRange: 'entry 2% cover 34%' } : {}) }}
                />
              </span>
              <span className={`flex-[0_0_auto] font-mono text-m-12 font-medium ${i === 0 ? 'text-ink' : 'text-ink-muted'}`}>
                {row.value.toLocaleString('en-US')}
              </span>
            </div>
          ))}

          <p className="mt-[22px] text-p-small text-ink-muted [text-wrap:pretty]">
            More test than source, by <span className="text-ink">{code.ratio}</span>. Lines of test
            are not a virtue on their own — they are what let one engineer change 77 integrations
            without a manual regression pass.
          </p>
        </div>
      </Reveal>

      {/* --- five-row ledger --- */}
      <div className="mt-[clamp(52px,7vw,96px)] border-t border-strong">
        {ledger.map((row, i) => (
          <Reveal
            key={row.label}
            range={20}
            className="flex flex-wrap items-baseline gap-x-6 gap-y-3 border-b border-soft py-[26px]"
          >
            <span className="flex-[0_0_34px] font-mono text-m-10 tracking-t4 text-ink-faint">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="flex-[1_1_260px] text-p-row text-ink-secondary">
              {row.label}
              {'qualifier' in row && row.qualifier ? (
                <span className="text-ink-label"> {row.qualifier}</span>
              ) : null}
            </span>
            <span className="ml-auto font-display text-d-ledger text-ink">
              <Counter value={row.value} suffix={row.suffix} />
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
