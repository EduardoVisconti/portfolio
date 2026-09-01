import type { Variants } from 'framer-motion';

/** SPEC-motion.md — the one easing curve in the design. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Framer fallback for the CSS scroll-driven reveal. Prefer the .reveal class;
 * use these only where you need JS anyway (counters, transcript, form states)
 * or for browsers without animation-timeline.
 *
 * once: true is REQUIRED — re-animating on scroll-back cheapens the whole page.
 */
export const reveal: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export const heroLine: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number = 0) => ({
    opacity: 1, y: 0, transition: { duration: 1, delay, ease: EASE },
  }),
};

export const drawX: Variants = {
  hidden: { opacity: 0, scaleX: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1, scaleX: 1, transition: { duration: 0.9, delay, ease: EASE },
  }),
};

/** amount values matching SPEC-motion.md's cover N% ranges. */
export const VIEWPORT = {
  tight:  { once: true, amount: 0.2 },
  normal: { once: true, amount: 0.25 },
  loose:  { once: true, amount: 0.3 },
} as const;

/** ease-out-cubic — the counter curve. */
export const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);
