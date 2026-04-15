"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "motion/react";

/**
 * Chaos-to-order scroll animation. Ported from the 21st.dev snippet with
 * only the minimum changes needed for this codebase:
 *   - brand teal instead of indigo
 *   - copy swapped to "Your project lives in chaos." → "ArkyHub brings order."
 *   - demo "Your Content Here" scaffolding removed
 *   - prefers-reduced-motion short-circuits to the resolved state (project rule §6)
 *
 * Particle count (2000), scroll distance (300vh), DPR, antialias, and the
 * use of @react-three/drei are all kept as in the original snippet — these
 * are deliberate choices of the upstream component.
 */

// Must be a literal hex — Three.js materials can't read CSS vars.
// Keep in sync with --accent in globals.css.
const ACCENT_HEX = "#0f8983";

interface ParticleSystemProps {
  scrollProgress: number;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ scrollProgress }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [initialPositions] = useState(() => {
    const pos = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
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
    const vel = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      vel[i * 3] = (Math.random() - 0.5) * 2;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 2;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    return vel;
  });

  const [targetPositions] = useState(() => {
    const pos = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      const angle = (i / 2000) * Math.PI * 2;
      const radius = 80 + (i % 5) * 15;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = Math.sin(i * 0.1) * 20;
    }
    return pos;
  });

  useFrame((state) => {
    if (!pointsRef.current) return;

    const geometry = pointsRef.current.geometry;
    const positionAttribute = geometry.attributes.position;

    for (let i = 0; i < 2000; i++) {
      const startX = initialPositions[i * 3];
      const startY = initialPositions[i * 3 + 1];
      const startZ = initialPositions[i * 3 + 2];

      const endX = targetPositions[i * 3];
      const endY = targetPositions[i * 3 + 1];
      const endZ = targetPositions[i * 3 + 2];

      const progress = Math.min(scrollProgress, 1);
      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      // Chaotic motion while in chaos state
      const time = state.clock.elapsedTime;
      const chaoticX =
        startX + Math.sin(time * velocities[i * 3] * 0.5 + i) * 15;
      const chaoticY =
        startY + Math.cos(time * velocities[i * 3 + 1] * 0.5 + i) * 15;
      const chaoticZ =
        startZ + Math.sin(time * velocities[i * 3 + 2] * 0.5 + i * 0.5) * 15;

      // Interpolate between chaotic and ordered positions
      const x = chaoticX + (endX - chaoticX) * eased;
      const y = chaoticY + (endY - chaoticY) * eased;
      const z = chaoticZ + (endZ - chaoticZ) * eased;

      positionAttribute.setXYZ(i, x, y, z);
    }

    positionAttribute.needsUpdate = true;

    if (scrollProgress >= 0.5) {
      pointsRef.current.rotation.z = state.clock.elapsedTime * 0.3;
    }
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

const LogoComponent: React.FC<{ scrollProgress: number }> = ({
  scrollProgress,
}) => {
  const logoRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!logoRef.current) return;

    const targetScale = scrollProgress >= 0.5 ? 1 : 0.3;
    const currentScale = logoRef.current.scale.x;
    logoRef.current.scale.setScalar(
      currentScale + (targetScale - currentScale) * 0.05,
    );

    const targetOpacity = scrollProgress >= 0.5 ? 1 : 0.3;
    if (logoRef.current.material instanceof THREE.MeshBasicMaterial) {
      const currentOpacity = logoRef.current.material.opacity;
      logoRef.current.material.opacity =
        currentOpacity + (targetOpacity - currentOpacity) * 0.05;
    }
  });

  return (
    <mesh ref={logoRef} position={[0, 0, 0]}>
      <torusGeometry args={[30, 8, 16, 100]} />
      <meshBasicMaterial
        color={ACCENT_HEX}
        transparent
        opacity={0.3}
        wireframe={false}
      />
    </mesh>
  );
};

export function Problem() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    // Accessibility: if the user prefers reduced motion, jump straight to
    // the resolved "order" state and skip scroll tracking entirely.
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

  return (
    <section
      id="problem"
      ref={containerRef}
      className="relative w-full bg-transparent"
      style={{ height: "300vh" }}
    >
      <div className="sticky top-0 left-0 h-screen w-full overflow-hidden">
        <Canvas
          camera={{ position: [0, 0, 200], fov: 75 }}
          className="h-full w-full"
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <ParticleSystem scrollProgress={scrollProgress} />
          <LogoComponent scrollProgress={scrollProgress} />
        </Canvas>

        {/* Text overlay */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6">
          {/* Chaos state */}
          <div
            className="absolute text-center transition-opacity duration-1000"
            style={{ opacity: scrollProgress < 0.3 ? 1 : 0 }}
          >
            <h2
              className="font-[family-name:var(--font-display)] font-semibold text-[var(--text-primary)]"
              style={{
                fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
              }}
            >
              Your project lives in chaos.
            </h2>
            <p className="mt-5 text-base text-[var(--text-secondary)] md:text-lg">
              Scroll to bring order.
            </p>
          </div>

          {/* Order state */}
          <div
            className="absolute text-center transition-opacity duration-1000"
            style={{ opacity: scrollProgress >= 0.5 ? 1 : 0 }}
          >
            <h2
              className="font-[family-name:var(--font-display)] font-semibold text-[var(--text-primary)]"
              style={{
                fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
              }}
            >
              ArkyHub brings{" "}
              <span style={{ color: ACCENT_HEX }}>order</span>.
            </h2>
            <p className="mt-5 text-base text-[var(--text-secondary)] md:text-lg">
              One workspace. Every document. Always current.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
