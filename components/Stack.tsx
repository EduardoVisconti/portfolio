import { STACK } from '@/lib/content';
import { Reveal } from './Reveal';
import { SectionHeader } from './SectionHeader';

/**
 * By layer, not by logo. No icons, no proficiency bars, no logo wall.
 * AGENT is first and accented because it is the differentiator; PROOF is a
 * layer because tests are a capability, not a footnote.
 */
export function Stack() {
  return (
    <section id="stack" className="py-section">
      <div className="mb-[clamp(34px,4vw,52px)]">
        <SectionHeader id="stack" />
      </div>

      {STACK.map((row) => (
        <Reveal
          key={row.layer}
          range={20}
          className="flex flex-wrap items-baseline gap-x-11 gap-y-4 border-b border-soft py-[26px]"
        >
          <span className={`flex-[0_0_130px] font-mono text-m-10 font-medium tracking-t9 ${
            'accent' in row && row.accent ? 'text-accent' : 'text-ink-dim'
          }`}>
            {row.layer}
          </span>
          <div className="flex flex-[1_1_400px] flex-wrap gap-x-[26px] gap-y-[10px] font-mono text-m-15 text-ink-mono">
            {row.items.map((it) => <span key={it}>{it}</span>)}
            {'qualifiers' in row && row.qualifiers
              ? row.qualifiers.map((q) => <span key={q} className="text-ink-dim">{q}</span>)
              : null}
          </div>
        </Reveal>
      ))}
    </section>
  );
}
