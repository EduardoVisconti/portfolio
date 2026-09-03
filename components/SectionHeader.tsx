import { SECTIONS } from '@/lib/content';
import { Reveal } from './Reveal';

/**
 * The 02-07 header pattern, driven by SECTIONS rather than by props.
 *
 * Every section used to hardcode its own number, title and aside while SECTIONS
 * held a second copy that nothing read. They drifted the first time two
 * sections swapped places: the rail said 04 while the header said 02. One
 * source removes the drift by construction.
 */
export function SectionHeader({ id }: { id: string }) {
  const section = SECTIONS.find((s) => s.id === id);
  if (!section) throw new Error(`SectionHeader: no section with id "${id}"`);

  return (
    <Reveal className="flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b border-strong pb-[14px]">
      <span className="font-mono text-m-11 font-medium tracking-t6 text-accent">{section.n}</span>
      <h2 className="m-0 font-mono text-m-11 font-medium uppercase tracking-t10 text-ink">
        {section.title}
      </h2>
      {section.aside ? (
        <span className="ml-auto font-mono text-m-11 tracking-t6 text-ink-label">{section.aside}</span>
      ) : null}
    </Reveal>
  );
}
