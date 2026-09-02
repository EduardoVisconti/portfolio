import { Reveal } from './Reveal';

/** The 02-07 header pattern. SPEC-sections.md §02. */
export function SectionHeader({
  n, title, aside,
}: { n: string; title: string; aside?: string | null }) {
  return (
    <Reveal className="flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b border-strong pb-[14px]">
      <span className="font-mono text-m-11 font-medium tracking-t6 text-accent">{n}</span>
      <h2 className="m-0 font-mono text-m-11 font-medium uppercase tracking-t10 text-ink">{title}</h2>
      {aside ? (
        <span className="ml-auto font-mono text-m-11 tracking-t6 text-ink-label">{aside}</span>
      ) : null}
    </Reveal>
  );
}
