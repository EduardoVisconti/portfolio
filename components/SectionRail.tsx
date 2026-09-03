'use client';

import { useEffect, useState } from 'react';
import { SECTIONS } from '@/lib/content';

/**
 * Fixed 01-07 index on the left margin. Hidden below 1420px (globals.css).
 * Active = the LAST section whose top has passed 40vh.
 */
export function SectionRail() {
  const [active, setActive] = useState<string>('top');

  useEffect(() => {
    const els = SECTIONS
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const tick = () => {
      const line = window.innerHeight * 0.4;
      let cur = els[0].id;
      for (const el of els) if (el.getBoundingClientRect().top <= line) cur = el.id;
      setActive((prev) => (prev === cur ? prev : cur));
    };

    tick();
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick);
    return () => {
      window.removeEventListener('scroll', tick);
      window.removeEventListener('resize', tick);
    };
  }, []);

  return (
    <nav
      data-rail
      aria-label="Sections"
      className="fixed left-[22px] top-0 z-[70] flex h-screen flex-col justify-center gap-4"
    >
      {SECTIONS.map((s) => {
        const on = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-label={`${s.n} ${s.title}`}
            aria-current={on ? 'location' : undefined}
            className="flex items-center gap-[9px]"
          >
            <span aria-hidden className={`font-mono text-m-10 tracking-t3 ${on ? 'text-accent' : 'text-ink-idle'}`}>
              {s.n}
            </span>
            <span
              aria-hidden
              className={`h-px transition-[width,background-color] duration-[350ms] ease-standard ${
                on ? 'w-7 bg-accent' : 'w-[10px] bg-ink-separator'
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
}
