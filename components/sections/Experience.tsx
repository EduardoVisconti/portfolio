"use client";

import { motion } from "framer-motion";
import { Briefcase, Code2, GraduationCap } from "lucide-react";
import SectionTitle from "@/components/shared/SectionTitle";
import { experienceData } from "@/lib/data";

const typeIcons = {
  work: <Briefcase size={16} />,
  project: <Code2 size={16} />,
  education: <GraduationCap size={16} />,
};

const typeColors = {
  work: "bg-accent text-white",
  project: "bg-blue-500 text-white",
  education: "bg-purple-500 text-white",
};

export default function Experience() {
  return (
    <section id="experience" className="py-16 md:py-24 bg-card">
      <div className="max-w-6xl mx-auto px-6">
        <SectionTitle label="Experience" title="My journey" />

        <div className="relative max-w-2xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

          <div className="space-y-10">
            {experienceData.map((exp, i) => (
              <motion.div
                key={`${exp.title}-${i}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: "easeOut" as const,
                }}
                className={`relative flex items-start gap-6 md:gap-10 ${
                  i % 2 === 0
                    ? "md:flex-row"
                    : "md:flex-row-reverse md:text-right"
                }`}
              >
                {/* Icon dot */}
                <div
                  className={`absolute left-6 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center z-10 ${typeColors[exp.type]}`}
                >
                  {typeIcons[exp.type]}
                </div>

                {/* Content - desktop alternating */}
                <div className="hidden md:block w-1/2" />
                <div className="pl-14 md:pl-0 md:w-1/2">
                  <span className="text-xs uppercase tracking-wider text-accent font-medium">
                    {exp.year}
                  </span>
                  <h3 className="text-base font-semibold text-foreground mt-1">
                    {exp.title}
                  </h3>
                  <p className="text-sm text-muted font-medium">
                    {exp.subtitle}
                  </p>
                  <p className="text-sm text-muted mt-2 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
