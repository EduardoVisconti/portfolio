/**
 * The column grid behind the page. Barely visible by design - it should read as
 * structure, not decoration, and vanish in a thumbnail. The gradient lives in
 * globals.css so every color resolves through the config.
 */
export function BackgroundGrid() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 mx-auto max-w-container px-gutter">
      <div className="column-grid h-full border-r border-grid" />
    </div>
  );
}
