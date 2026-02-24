"use client";

import ScrollReveal from "./ScrollReveal";

interface SectionTitleProps {
  label: string;
  title: string;
  className?: string;
}

export default function SectionTitle({
  label,
  title,
  className,
}: SectionTitleProps) {
  return (
    <ScrollReveal className={className}>
      <div className="mb-12 md:mb-16">
        <p className="text-sm uppercase tracking-widest text-accent font-medium mb-3">
          {label}
        </p>
        <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground">
          {title}
        </h2>
      </div>
    </ScrollReveal>
  );
}
