"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Global motion configuration.
 * `reducedMotion="user"` defers to the OS / browser `prefers-reduced-motion` setting:
 * when reduced motion is requested, all motion components fall back to instant
 * transitions (no transform / opacity tweens).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionConfig>
  );
}
