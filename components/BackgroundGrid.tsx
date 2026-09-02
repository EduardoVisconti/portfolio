/**
 * The column grid behind the page. Barely visible by design - it should read as
 * structure, not decoration, and vanish in a thumbnail. The gradient itself
 * lives in globals.css so every colour resolves through the config.
 */
export function BackgroundGrid() {
  return (
    <div
      aria-hidden
      className="column-grid pointer-events-none fixed inset-0 z-0 mx-auto max-w-container px-gutter"
    />
  );
}
