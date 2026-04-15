"use client";

import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";

/**
 * Theme-aware radial orbital timeline. Adapted from the 21st.dev snippet
 * with the following deviations from the original:
 *   - No shadcn `Badge` / `Button` / `Card` dependencies (inlined with
 *     design tokens) — avoids pulling `@radix-ui/react-slot` just for one
 *     `asChild` Button.
 *   - No `Energy %` progress bar and no `Connected Nodes` cross-links —
 *     ArkyHub's 5 pillars are siblings, not a lifecycle with dependencies.
 *   - Pure teal on `--surface-elevated` / `--border-accent` tokens instead
 *     of hardcoded `bg-black` and purple gradients.
 *   - Orbit radius is responsive (tighter on ≤768px so nodes don't clip).
 *   - Auto-rotation pauses whenever a node is expanded and resumes on
 *     outside-click.
 */

export interface OrbitalNode {
  id: number;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

interface RadialOrbitalTimelineProps {
  nodes: OrbitalNode[];
  /**
   * Controls the auto-rotation ticker. Problem.tsx only flips this on once
   * the particle-to-orbital crossfade has landed, so the orbit is static
   * while the handoff reads, then animates into life.
   */
  autoRotate?: boolean;
}

export function RadialOrbitalTimeline({
  nodes,
  autoRotate = true,
}: RadialOrbitalTimelineProps) {
  const [rotation, setRotation] = useState(0);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [radius, setRadius] = useState(230);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive orbit radius: 230px (desktop) / 130px (mobile).
  useEffect(() => {
    const onResize = () =>
      setRadius(window.innerWidth <= 768 ? 130 : 230);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Auto-rotation ticker. Pauses while a node is expanded so the user's
  // focus target doesn't drift under the cursor.
  useEffect(() => {
    if (!autoRotate || expandedId !== null) return;
    const id = setInterval(() => {
      setRotation((r) => (r + 0.2) % 360);
    }, 50);
    return () => clearInterval(id);
  }, [autoRotate, expandedId]);

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current) setExpandedId(null);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleBackgroundClick}
      className="relative flex h-full w-full items-center justify-center"
    >
      {/* Orbital ring (decorative) */}
      <div
        aria-hidden
        className="pointer-events-none absolute rounded-full border border-[var(--border-accent)] opacity-40"
        style={{ width: radius * 2, height: radius * 2 }}
      />

      {nodes.map((node, i) => {
        const angleDeg =
          ((i / nodes.length) * 360 + rotation - 90) % 360;
        const angleRad = (angleDeg * Math.PI) / 180;
        const x = Math.cos(angleRad) * radius;
        const y = Math.sin(angleRad) * radius;
        const Icon = node.icon;
        const isExpanded = expandedId === node.id;

        // Depth cues so nodes on the far side of the orbit recede.
        const depth = (1 + Math.sin(angleRad)) / 2; // 0 = back, 1 = front
        const zIndex = isExpanded ? 500 : Math.round(100 + 50 * depth);
        const nodeOpacity = isExpanded ? 1 : 0.55 + 0.45 * depth;

        return (
          <div
            key={node.id}
            className="absolute"
            style={{
              transform: `translate(${x}px, ${y}px)`,
              zIndex,
              opacity: nodeOpacity,
              transition: "opacity 300ms ease-out",
            }}
          >
            <button
              type="button"
              aria-label={node.title}
              aria-expanded={isExpanded}
              onClick={(e) => {
                e.stopPropagation();
                setExpandedId(isExpanded ? null : node.id);
              }}
              className={
                isExpanded
                  ? "relative flex h-12 w-12 scale-125 items-center justify-center rounded-full border-2 border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)] shadow-[0_0_24px_0_color-mix(in_oklab,var(--accent)_50%,transparent)] transition-all duration-300"
                  : "relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-[var(--border-accent)] bg-[var(--surface-elevated)] text-[var(--text-accent)] transition-all duration-300 hover:scale-110 hover:border-[var(--accent)]"
              }
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </button>

            {/* Label under each node */}
            <span
              className={
                isExpanded
                  ? "pointer-events-none absolute left-1/2 top-[3.5rem] -translate-x-1/2 whitespace-nowrap text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--text-primary)]"
                  : "pointer-events-none absolute left-1/2 top-[3.5rem] -translate-x-1/2 whitespace-nowrap text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]"
              }
            >
              {node.title}
            </span>

            {isExpanded && (
              <div
                role="dialog"
                aria-label={`${node.title} details`}
                onClick={(e) => e.stopPropagation()}
                className="absolute left-1/2 top-24 z-10 w-72 -translate-x-1/2 rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--surface-elevated)] p-4 text-left shadow-[var(--shadow-xl)] backdrop-blur-xl"
              >
                <div
                  aria-hidden
                  className="absolute -top-3 left-1/2 h-3 w-px -translate-x-1/2 bg-[var(--border-accent)]"
                />
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  {node.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                  {node.description}
                </p>
                <a
                  href={node.href}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[var(--text-accent)] hover:underline"
                >
                  See how it works
                  <span aria-hidden>→</span>
                </a>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
