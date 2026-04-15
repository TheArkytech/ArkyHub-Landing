"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Stagger delay in seconds. Default 0. */
  delay?: number;
  /** Initial Y offset in px. Default 16. */
  y?: number;
  /** Viewport visibility threshold (0–1). Default 0.2. */
  amount?: number;
  className?: string;
}

/**
 * Scroll-triggered fade-up reveal. Plays once on first viewport entry.
 * Animates only `transform` and `opacity` per design system rules.
 */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  amount = 0.2,
  className,
}: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
