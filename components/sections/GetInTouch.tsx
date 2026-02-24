"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";

export default function GetInTouch() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center max-w-lg mx-auto">
            <p className="text-sm uppercase tracking-widest text-accent font-medium mb-3">
              Get in Touch
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-6">
              Let&apos;s work together
            </h2>
            <p className="text-muted mb-8 leading-relaxed">
              I&apos;m currently open to new opportunities. Whether you have a
              project in mind or just want to chat, feel free to reach out.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-white rounded-full font-medium hover:bg-accent-dark transition-colors"
            >
              Contact Me
              <ArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
