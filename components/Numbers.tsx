import { NUMBERS } from '@/lib/content';
import { Counter } from './Counter';
import { Reveal } from './Reveal';
import { SectionHeader } from './SectionHeader';

export function Numbers() {
  const { ledger } = NUMBERS;

  return (
    <section id="numbers" className="py-section">
      <div className="mb-[clamp(44px,6vw,76px)]">
        <SectionHeader id="numbers" />
      </div>

      {/* --- the ledger: one verified figure per row --- */}
      <div className="border-t border-strong">
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
