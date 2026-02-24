"use client";

import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionTitle from "@/components/shared/SectionTitle";
import { aboutData, siteConfig } from "@/lib/data";

export default function About() {
  return (
    <section id="about" className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <SectionTitle label="About" title="Get to know me" />

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Photo placeholder */}
          <ScrollReveal direction="left">
            <div className="max-w-sm mx-auto">
              <div className="relative">
                <div className="w-full aspect-[3/4] rounded-2xl bg-gradient-to-br from-card to-border overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-muted text-sm">
                    Your photo here
                  </div>
                </div>
                <div className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl border-2 border-accent -z-10" />
              </div>
            </div>
          </ScrollReveal>

          {/* Bio + Stats */}
          <ScrollReveal direction="right" delay={0.2}>
            <div className="space-y-5">
              {aboutData.bio.map((paragraph, i) => (
                <p key={i} className="text-muted leading-relaxed">
                  {paragraph}
                </p>
              ))}

              <p className="text-sm text-muted">
                <span className="text-accent font-medium">
                  {siteConfig.location}
                </span>{" "}
                — Open to remote worldwide
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-border">
              {aboutData.stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl md:text-3xl font-display font-semibold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs uppercase tracking-wider text-muted mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
