"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

interface ContainerScrollProps {
  titleComponent: ReactNode;
  children: ReactNode;
}

/**
 * Scroll-driven reveal: as the user scrolls, a card tilts flat and scales
 * in while the title above it translates up. Adapted from the Aceternity /
 * 21st.dev pattern.
 *
 * Changes from the original snippet:
 *   - Imports from `motion/react` (framer-motion was renamed in late 2024
 *     and is banned in this codebase).
 *   - Bezel uses design tokens, not hardcoded dark hex, so it works in
 *     light + dark themes.
 *   - Respects `prefers-reduced-motion` (the scroll transforms would
 *     otherwise bypass MotionConfig).
 *   - `Card` no longer accepts an unused `translate` prop.
 */
export function ContainerScroll({
  titleComponent,
  children,
}: ContainerScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const prefersReduced = useReducedMotion();

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scaleRange: [number, number] = prefersReduced
    ? [1, 1]
    : isMobile
      ? [0.75, 0.95]
      : [1.04, 1];

  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduced ? [0, 0] : [18, 0],
  );
  const scale = useTransform(scrollYProgress, [0, 1], scaleRange);
  const translate = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduced ? [0, 0] : [0, -80],
  );

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-[56rem] items-center justify-center md:min-h-[70rem]"
    >
      <div
        className="relative w-full py-10 md:py-24"
        style={{ perspective: "1000px" }}
      >
        <Header translate={translate}>{titleComponent}</Header>
        <Card rotate={rotate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
}

function Header({
  translate,
  children,
}: {
  translate: MotionValue<number>;
  children: ReactNode;
}) {
  return (
    <motion.div
      style={{ y: translate }}
      className="mx-auto max-w-5xl text-center"
    >
      {children}
    </motion.div>
  );
}

function Card({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  children: ReactNode;
}) {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "var(--shadow-xl), 0 0 80px -20px color-mix(in oklab, var(--accent) 30%, transparent)",
      }}
      className="relative mx-auto mt-12 h-[28rem] w-full max-w-5xl rounded-[var(--radius-2xl)] border border-[var(--border-strong)] bg-[var(--surface-elevated)] p-2 will-change-transform md:h-[40rem] md:p-3"
    >
      <div className="h-full w-full overflow-hidden rounded-[calc(var(--radius-2xl)-6px)] bg-[var(--background)]">
        {children}
      </div>
    </motion.div>
  );
}
