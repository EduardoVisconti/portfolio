import { SECTIONS } from '@/lib/content';

/** Server component. Fixed, 60px, blurred. SPEC-sections.md §C. */
export function SiteHeader() {
  const nav = SECTIONS.filter((s) => s.nav);

  return (
    <header className="fixed inset-x-0 top-0 z-[80] border-b border-soft bg-header backdrop-blur-[14px]">
      <div className="mx-auto flex h-header max-w-container items-center gap-5 px-gutter max-[480px]:gap-3">
        <a href="#top" className="flex items-center gap-3">
          <span className="inline-flex h-6 w-6 items-center justify-center border border-mark font-mono text-m-10 font-medium tracking-t1 text-ink">
            EV
          </span>
          {/* Measured at 320px: the wordmark, four numbers and CONTACT need 421px
              against 280px of content width. The page wrapper is overflow-x-hidden,
              so the surplus is clipped rather than scrollable and CONTACT simply
              disappears. The monogram carries the brand below 480px; the full name
              is the first thing in the hero anyway. */}
          <span className="font-mono text-m-12 font-medium tracking-t3 text-ink max-[480px]:hidden">
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

      {/* Below 780px the full nav hides and, until now, nothing replaced it:
          a seven-section long-scroll page with no way through it but the
          scrollbar - on the width where a shared link actually gets opened.
          Numbers only, no drawer, no JavaScript. */}
      <nav
        data-mobilenav
        aria-label="Sections"
        className="ml-auto hidden items-center gap-[14px] max-[480px]:gap-[10px]"
      >
        {SECTIONS.filter((s) => s.nav).map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-label={`${s.n} ${s.title}`}
            className="font-mono text-m-11 tracking-t6 text-ink-muted transition-colors hover:text-accent"
          >
            {s.n}
          </a>
        ))}
      </nav>

        <a
          href="#contact"
          className="inline-flex h-[30px] items-center gap-[9px] border border-link px-[15px] font-mono text-m-11 font-medium tracking-t6 text-ink transition-colors hover:border-accent hover:text-accent"
        >
          <span className="h-[5px] w-[5px] animate-pulse bg-accent" aria-hidden />
          CONTACT
        </a>
      </div>
    </header>
  );
}
