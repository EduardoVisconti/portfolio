'use client';

import { useEffect, useRef, useState } from 'react';
import { easeOutCubic } from '@/lib/motion';

/**
 * SPEC-motion.md §3. Two robustness rules are load-bearing:
 *
 *  1. The authored numeral is rendered as real text and only replaced once the
 *     animation actually starts. A failed visibility check can therefore never
 *     leave a blank or a zero where a headline figure should be.
 *  2. A 2600ms safety timeout forces any counter that never started to its
 *     final value.
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

    const finish = () => { started.current = true; setDisplay(authored); };

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
    const safety = setTimeout(finish, 2600);

    return () => {
      window.removeEventListener('scroll', tick, { capture: true } as EventListenerOptions);
      window.removeEventListener('resize', tick);
      clearTimeout(safety);
    };
  }, [authored, value, suffix]);

  return <span ref={ref} className={className}>{display ?? authored}</span>;
}
