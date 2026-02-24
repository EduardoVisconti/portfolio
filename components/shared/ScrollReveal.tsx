"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
}

const directionOffsets = {
  up: { y: 40, x: 0 },
  down: { y: -40, x: 0 },
  left: { x: -40, y: 0 },
  right: { x: 40, y: 0 },
};

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 0.6,
}: ScrollRevealProps) {
  const offset = directionOffsets[direction];

  const variants: Variants = {
    hidden: { opacity: 0, ...offset },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, delay, ease: "easeOut" as const },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
