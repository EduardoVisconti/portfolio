/**
 * Server component — no JS ships. The reveal is pure CSS scroll-driven
 * animation (globals.css). Base state is visible, so browsers without
 * animation-timeline show a static readable page.
 */
type Range = 20 | 22 | 24 | 26 | 30 | 32 | 34;

export function Reveal({
  children, range = 22, className = '', as: Tag = 'div', ...rest
}: {
  children: React.ReactNode;
  range?: Range;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
} & React.HTMLAttributes<HTMLElement>) {
  const T = Tag as React.ElementType;
  return (
    <T className={`reveal ${range === 22 ? '' : `reveal-${range}`} ${className}`} {...rest}>
      {children}
    </T>
  );
}
