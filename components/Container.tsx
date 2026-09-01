/** Server component. The page's one horizontal measure. */
export function Container({
  children, className = '', as: Tag = 'div',
}: { children: React.ReactNode; className?: string; as?: 'div' | 'main' | 'header' | 'footer' }) {
  return (
    <Tag className={`mx-auto w-full max-w-container px-gutter ${className}`}>{children}</Tag>
  );
}
