'use client';

import { useEffect, useRef, useState } from 'react';

/** SPEC-motion.md: ease-out-cubic, the curve every counter uses. */
const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);

/**
 * SPEC-motion.md §3. Two robustness rules are load-bearing:
 *
 * The authored numeral is rendered as real text and only replaced once the
 * animation actually starts, so a failed visibility check can never leave a
 * blank or a zero where a headline figure should be. That render fallback is
 * the whole safety net - there is deliberately no timeout backstop, because a
 * timer armed on mount fires for every counter still below the fold and marks
 * it started, which permanently disables the animation it was meant to protect.
 *
 * Deliberately NOT using IntersectionObserver: rect reads in a single shared
 * scroll handler behave predictably inside transformed / container-query
 * ancestors, where observers can silently never fire.
 */
export function Counter({
  value, suffix = '', className = '',
}: { value: number; suffix?: string; className?: string }) {
  const authored = value.toLocaleString('en-US') + suffix;
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const [display, setDisplay] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const run = () => {
      if (started.current) return;
      started.current = true;
      if (reduced) { setDisplay(authored); return; }
      const t0 = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / 1200);
        setDisplay(Math.round(value * easeOutCubic(p)).toLocaleString('en-US') + suffix);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const tick = () => {
      if (started.current) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92 && r.bottom > 0) run();
    };

    tick();
    window.addEventListener('scroll', tick, { passive: true, capture: true });
    window.addEventListener('resize', tick);

    return () => {
      window.removeEventListener('scroll', tick, { capture: true } as EventListenerOptions);
      window.removeEventListener('resize', tick);
    };
  }, [authored, value, suffix]);

  return <span ref={ref} className={className}>{display ?? authored}</span>;
}
