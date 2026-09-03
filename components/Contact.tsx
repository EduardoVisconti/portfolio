import { CONTACT, IDENTITY } from '@/lib/content';
import { Reveal } from './Reveal';
import { SectionHeader } from './SectionHeader';

/**
 * No form, deliberately. Delivering mail needs a verified sending domain and this
 * site does not own one - a form that silently fails is worse than a link that
 * works. Nothing here holds state, so it stays a Server Component.
 */
export function Contact() {
  const link =
    'inline-flex items-center gap-2 border-b border-link pb-[5px] font-mono text-m-11 ' +
    'font-medium tracking-t6 text-ink transition-colors hover:border-accent hover:text-accent';

  return (
    <section id="contact" className="pb-section-end pt-section">
      <div className="mb-[clamp(40px,5vw,64px)]">
        <SectionHeader id="contact" />
      </div>

      <Reveal range={24} className="flex flex-wrap items-start gap-[clamp(44px,6vw,96px)]">
        <div className="max-w-[520px] flex-[1_1_340px]">
          <p className="mb-7 mt-0 font-display text-d-contact font-normal text-ink [text-wrap:pretty]">
            {CONTACT.headline}
          </p>
          <p className="m-0 max-w-[420px] text-p-body-l text-ink-muted [text-wrap:pretty]">
            {CONTACT.support}
          </p>
        </div>

        <div className="max-w-[540px] flex-[1_1_380px] border-t border-rule pt-[26px]">
          <a
            href={`mailto:${IDENTITY.email}`}
            className="block break-all font-display text-d-ask font-normal leading-[1.05] text-ink transition-colors hover:text-accent"
          >
            {IDENTITY.email}
          </a>

          <div className="mt-[clamp(28px,3vw,40px)] flex flex-wrap gap-x-7 gap-y-[14px]">
            <a href={IDENTITY.linkedin} target="_blank" rel="noopener" className={link}>
              LINKEDIN ↗
            </a>
            <a href={IDENTITY.github} target="_blank" rel="noopener" className={link}>
              GITHUB ↗
            </a>
          </div>

        </div>
      </Reveal>
    </section>
  );
}
