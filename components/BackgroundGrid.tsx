/** Six barely-visible column rules, fixed behind everything. */
export function BackgroundGrid() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 mx-auto max-w-container px-gutter">
      <div
        className="h-full border-r border-grid"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(255,255,255,.032) 0 1px, transparent 1px calc(100% / 6))',
        }}
      />
    </div>
  );
}
