"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import {
  AlertCircle,
  Box,
  Eye,
  FileText,
  Users,
} from "lucide-react";
import {
  RadialOrbitalTimeline,
  type OrbitalNode,
} from "@/components/ui/radial-orbital-timeline";

/**
 * Chaos → order → orbital morph. Scroll-driven, 3 phases over a 450vh track:
 *
 *   phase 1 (0.00 – 0.40) — 2000 particles swarm from chaos into concentric
 *     teal rings around a torus. Text: "Your project lives in chaos."
 *   phase 2 (0.55 – 0.75) — the rings re-aggregate into 5 tight clusters at
 *     the 5 orbital anchor angles. Text: "ArkyHub brings order."
 *   phase 3 (0.75 – 0.85) — canvas fades out while the DOM-based
 *     `RadialOrbitalTimeline` fades in at matching angles. Nodes become
 *     interactive; auto-rotation starts. Text: "Every layer, always connected."
 *
 * The particle cluster radius (world units) is tuned to visually align with
 * the DOM orbital radius (pixels) so the crossfade reads as one morph, not
 * two swapped animations.
 *
 * prefers-reduced-motion short-circuits progress to 1 (project rule §6) —
 * visitors see the interactive orbital immediately, no scroll required, and
 * auto-rotation is disabled.
 */

// Must be a literal hex — Three.js materials can't read CSS vars.
// Keep in sync with --accent in globals.css.
const ACCENT_HEX = "#0f8983";

const PARTICLE_COUNT = 2000;
const NUM_CLUSTERS = 5;
// Rough world-unit radius that visually lines up with the DOM orbital's
// 230px radius at fov=75 / camera z=200. Tuned by eye; exact alignment is
// not required because the two layers crossfade.
const CLUSTER_RADIUS = 95;
const CLUSTER_SPREAD = 10;

interface ParticleSystemProps {
  scrollProgress: number;
}

const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

const ParticleSystem: React.FC<ParticleSystemProps> = ({ scrollProgress }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [initialPositions] = useState(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = 150 + Math.random() * 300;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  });

  const [velocities] = useState(() => {
    const vel = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      vel[i * 3] = (Math.random() - 0.5) * 2;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 2;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    return vel;
  });

  // Phase 1 target: concentric rings (unchanged from the original snippet).
  const [orderPositions] = useState(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
      const radius = 80 + (i % 5) * 15;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = Math.sin(i * 0.1) * 20;
    }
    return pos;
  });

  // Phase 2 target: each particle is pre-assigned to one of 5 clusters
  // (i % 5), sitting at the matching anchor angle. Anchor angles start at
  // -90° (top) and go clockwise, matching the DOM orbital's layout so the
  // crossfade lines up.
  const [clusterPositions] = useState(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const clusterIdx = i % NUM_CLUSTERS;
      const angle =
        (clusterIdx / NUM_CLUSTERS) * Math.PI * 2 - Math.PI / 2;
      const cx = Math.cos(angle) * CLUSTER_RADIUS;
      const cy = Math.sin(angle) * CLUSTER_RADIUS;

      pos[i * 3] = cx + (Math.random() - 0.5) * CLUSTER_SPREAD;
      pos[i * 3 + 1] = cy + (Math.random() - 0.5) * CLUSTER_SPREAD;
      pos[i * 3 + 2] = (Math.random() - 0.5) * CLUSTER_SPREAD;
    }
    return pos;
  });

  useFrame((state) => {
    if (!pointsRef.current) return;

    const geometry = pointsRef.current.geometry;
    const positionAttribute = geometry.attributes.position;

    // Phase 1: chaos → order. Easing runs from progress 0 to 0.4.
    const p1 = Math.min(Math.max(scrollProgress, 0) / 0.4, 1);
    const p1Eased = easeInOut(p1);

    // Phase 2: order → 5 clusters. Runs from progress 0.55 to 0.75.
    const p2 = Math.min(Math.max(scrollProgress - 0.55, 0) / 0.2, 1);
    const p2Eased = easeInOut(p2);

    const time = state.clock.elapsedTime;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const startX = initialPositions[i * 3];
      const startY = initialPositions[i * 3 + 1];
      const startZ = initialPositions[i * 3 + 2];

      const orderX = orderPositions[i * 3];
      const orderY = orderPositions[i * 3 + 1];
      const orderZ = orderPositions[i * 3 + 2];

      const clusterX = clusterPositions[i * 3];
      const clusterY = clusterPositions[i * 3 + 1];
      const clusterZ = clusterPositions[i * 3 + 2];

      // Chaotic oscillation, only meaningful while p1 < 1.
      const chaoticX =
        startX + Math.sin(time * velocities[i * 3] * 0.5 + i) * 15;
      const chaoticY =
        startY + Math.cos(time * velocities[i * 3 + 1] * 0.5 + i) * 15;
      const chaoticZ =
        startZ + Math.sin(time * velocities[i * 3 + 2] * 0.5 + i * 0.5) * 15;

      // Step 1: chaotic → ordered rings.
      const step1X = chaoticX + (orderX - chaoticX) * p1Eased;
      const step1Y = chaoticY + (orderY - chaoticY) * p1Eased;
      const step1Z = chaoticZ + (orderZ - chaoticZ) * p1Eased;

      // Step 2: ordered rings → 5 tight clusters.
      const x = step1X + (clusterX - step1X) * p2Eased;
      const y = step1Y + (clusterY - step1Y) * p2Eased;
      const z = step1Z + (clusterZ - step1Z) * p2Eased;

      positionAttribute.setXYZ(i, x, y, z);
    }

    positionAttribute.needsUpdate = true;

    // No mesh rotation: rotating the Points group would rotate the cluster
    // targets out of alignment with the static DOM orbital below. The
    // orbital's own auto-rotation takes over after the handoff.
    pointsRef.current.rotation.z = 0;
  });

  return (
    <Points ref={pointsRef} positions={initialPositions} frustumCulled={false}>
      <PointMaterial
        transparent
        color={ACCENT_HEX}
        size={2}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.85}
      />
    </Points>
  );
};

export function Problem() {
  const t = useTranslations("home.problem");
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    // Accessibility: if the user prefers reduced motion, jump straight to
    // the resolved "orbital" state and skip scroll tracking entirely.
    if (prefersReduced) {
      setScrollProgress(1);
      return;
    }

    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementTop = rect.top;
      const elementHeight = rect.height;

      const scrollStart = -elementTop;
      const scrollRange = elementHeight - windowHeight;
      const progress = Math.max(0, Math.min(1, scrollStart / scrollRange));

      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prefersReduced]);

  /** Product pillars presented by the orbital timeline. */
  const ORBITAL_NODES: OrbitalNode[] = [
    {
      id: 1,
      title: t("nodes.floorPlans.title"),
      description: t("nodes.floorPlans.description"),
      href: "#features",
      icon: FileText,
    },
    {
      id: 2,
      title: t("nodes.bimModels.title"),
      description: t("nodes.bimModels.description"),
      href: "#features",
      icon: Box,
    },
    {
      id: 3,
      title: t("nodes.virtualTour.title"),
      description: t("nodes.virtualTour.description"),
      href: "#features",
      icon: Eye,
    },
    {
      id: 4,
      title: t("nodes.issueTracker.title"),
      description: t("nodes.issueTracker.description"),
      href: "#features",
      icon: AlertCircle,
    },
    {
      id: 5,
      title: t("nodes.stakeholders.title"),
      description: t("nodes.stakeholders.description"),
      href: "#features",
      icon: Users,
    },
  ];

  // Canvas fades out / orbital fades in across scroll 0.75 → 0.85.
  const handoff = Math.max(0, Math.min((scrollProgress - 0.75) / 0.1, 1));
  const canvasOpacity = 1 - handoff;
  const orbitalOpacity = handoff;
  const orbitalInteractive = scrollProgress >= 0.85;

  // Text overlay visibilities.
  const chaosVisible = scrollProgress < 0.3 ? 1 : 0;
  const orderVisible =
    scrollProgress >= 0.4 && scrollProgress < 0.65 ? 1 : 0;
  const orbitalTextVisible = scrollProgress >= 0.85 ? 1 : 0;

  return (
    <section
      id="problem"
      ref={containerRef}
      className="relative w-full bg-transparent"
      style={{ height: "450vh" }}
    >
      <div className="sticky top-0 left-0 h-screen w-full overflow-hidden">
        {/* Scroll progress indicator */}
        <div
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center"
          style={{ height: "30vh" }}
        >
          <div
            className="relative w-[2px] h-full rounded-full overflow-hidden"
            style={{ backgroundColor: "var(--text-secondary)", opacity: 0.45 }}
          >
            <div
              className="absolute top-0 left-0 w-full rounded-full"
              style={{
                height: `${scrollProgress * 100}%`,
                backgroundColor: ACCENT_HEX,
                transition: "height 100ms linear",
              }}
            />
          </div>
        </div>
        {/* Canvas layer — phases 1+2, fades out during handoff */}
        <div
          className="absolute inset-0"
          style={{
            opacity: canvasOpacity,
            transition: "opacity 200ms linear",
          }}
        >
          <Canvas
            camera={{ position: [0, 0, 200], fov: 75 }}
            className="h-full w-full"
          >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <ParticleSystem scrollProgress={scrollProgress} />
          </Canvas>
        </div>

        {/* Orbital layer — phase 3, fades in and becomes interactive */}
        <div
          className="absolute inset-0"
          style={{
            opacity: orbitalOpacity,
            pointerEvents: orbitalInteractive ? "auto" : "none",
            transition: "opacity 200ms linear",
          }}
        >
          <RadialOrbitalTimeline
            nodes={ORBITAL_NODES}
            autoRotate={orbitalInteractive && !prefersReduced}
          />
        </div>

        {/* Text overlays */}
        <div className="pointer-events-none absolute inset-0 px-6">
          {/* Chaos state — centered */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center transition-opacity duration-1000"
            style={{ opacity: chaosVisible }}
          >
            <h2
              className="font-[family-name:var(--font-display)] font-semibold text-[var(--text-primary)]"
              style={{
                fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
              }}
            >
              {t("chaosHeadline")}
            </h2>
          </div>

          {/* Order state — centered */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center transition-opacity duration-1000"
            style={{ opacity: orderVisible }}
          >
            <h2
              className="font-[family-name:var(--font-display)] font-semibold text-[var(--text-primary)]"
              style={{
                fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
              }}
            >
              {t("orderHeadlinePre")}
              <span style={{ color: ACCENT_HEX }}>{t("orderHeadlineAccent")}</span>
              {t("orderHeadlinePost")}
            </h2>
            <p className="mt-5 text-base text-[var(--text-secondary)] md:text-lg">
              {t("orderSubhead")}
            </p>
          </div>

          {/* Orbital state — sits at the top of the viewport so it doesn't
              collide with the orbiting nodes, which ring the center. */}
          <div
            className="absolute left-1/2 top-[10%] -translate-x-1/2 text-center transition-opacity duration-1000"
            style={{ opacity: orbitalTextVisible }}
          >
            <h2
              className="font-[family-name:var(--font-display)] font-semibold text-[var(--text-primary)]"
              style={{
                fontSize: "clamp(1.5rem, 3.5vw, 2.75rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
              }}
            >
              {t("orbitalHeadlinePre")}
              <span style={{ color: ACCENT_HEX }}>{t("orbitalHeadlineAccent")}</span>
              {t("orbitalHeadlinePost")}
            </h2>
            <p className="mt-3 text-sm text-[var(--text-secondary)] md:text-base">
              {t("orbitalSubhead")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
