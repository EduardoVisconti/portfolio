/**
 * 1px accent line, scroll-linked. Pure CSS (animation-timeline: scroll(root)),
 * so it ships no JS. Browsers without support simply show no line.
 */
export function ScrollProgress() {
  return (
    <div aria-hidden className="scroll-progress fixed inset-x-0 top-0 z-[90] h-px bg-accent" />
  );
}
