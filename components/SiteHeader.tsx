import { SECTIONS } from '@/lib/content';

/** Server component. Fixed, 60px, blurred. SPEC-sections.md §C. */
export function SiteHeader() {
  const nav = SECTIONS.filter((s) => s.nav);

  return (
    <header className="fixed inset-x-0 top-0 z-[80] border-b border-soft bg-header backdrop-blur-[14px]">
      <div className="mx-auto flex h-header max-w-container items-center gap-5 px-gutter">
        <a href="#top" className="flex items-center gap-3">
          <span className="inline-flex h-6 w-6 items-center justify-center border border-mark font-mono text-m-10 font-medium tracking-t1 text-ink">
            EV
          </span>
          <span className="font-mono text-m-12 font-medium tracking-t3 text-ink">
            EDUARDO VISCONTI
          </span>
        </a>

        <nav data-topnav className="ml-auto flex items-center gap-7">
          {nav.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="font-mono text-m-11 tracking-t7 text-ink-muted transition-colors hover:text-accent"
            >
              {s.n} {s.title.toUpperCase()}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="ml-auto inline-flex h-[30px] items-center gap-[9px] border border-link px-[15px] font-mono text-m-11 font-medium tracking-t6 text-ink transition-colors hover:border-accent hover:text-accent"
        >
          <span className="h-[5px] w-[5px] animate-pulse bg-accent" aria-hidden />
          CONTACT
        </a>
      </div>
    </header>
  );
}
