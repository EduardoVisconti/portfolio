"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import Link from "next/link";
import { heroData } from "@/lib/data";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="max-w-3xl text-center"
      >
        <motion.p
          variants={item}
          className="text-sm uppercase tracking-widest text-accent font-medium mb-4"
        >
          {heroData.role}
        </motion.p>

        <motion.h1
          variants={item}
          className="text-5xl sm:text-6xl md:text-7xl font-display font-bold text-foreground leading-tight mb-6"
        >
          {heroData.headline}
        </motion.h1>

        <motion.p
          variants={item}
          className="text-lg md:text-xl text-muted max-w-xl mx-auto mb-10 text-balance"
        >
          {heroData.subtitle}
        </motion.p>

        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-full font-medium hover:bg-accent-dark transition-colors"
          >
            {heroData.ctaPrimary}
            <ArrowDown size={16} />
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-full font-medium text-foreground hover:border-accent hover:text-accent transition-colors"
          >
            {heroData.ctaSecondary}
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
