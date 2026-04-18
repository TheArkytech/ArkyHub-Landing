"use client";

import React, { useEffect, useRef, useId } from "react";
import { cn } from "@/lib/utils";

type SparklesProps = {
  className?: string;
  background?: string;
  particleSize?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};

/**
 * Lightweight canvas-based sparkles/twinkle effect.
 * No external particle library required — pure canvas animation.
 */
export function SparklesCore({
  className,
  background = "transparent",
  minSize = 0.4,
  maxSize = 1,
  speed = 1,
  particleColor = "#ffffff",
  particleDensity = 120,
}: SparklesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const id = useId();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    type Spark = {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      alpha: number;
      alphaSpeed: number;
      alphaDir: number;
    };

    let sparks: Spark[] = [];
    let w = 0;
    let h = 0;

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas!.width = w * DPR;
      canvas!.height = h * DPR;
      ctx!.scale(DPR, DPR);
    }

    function initSparks() {
      // Density: particles per 400x400 area
      const area = (w * h) / (400 * 400);
      const count = Math.round(particleDensity * area);
      sparks = [];
      for (let i = 0; i < count; i++) {
        sparks.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: minSize + Math.random() * (maxSize - minSize),
          vx: (Math.random() - 0.5) * 0.3 * speed,
          vy: (Math.random() - 0.5) * 0.3 * speed,
          alpha: Math.random(),
          alphaSpeed: (0.003 + Math.random() * 0.01) * speed,
          alphaDir: Math.random() > 0.5 ? 1 : -1,
        });
      }
    }

    resize();
    initSparks();

    let animId: number;

    function frame() {
      ctx!.clearRect(0, 0, w, h);

      if (background !== "transparent") {
        ctx!.fillStyle = background;
        ctx!.fillRect(0, 0, w, h);
      }

      ctx!.fillStyle = particleColor;

      for (const s of sparks) {
        // Move
        s.x += s.vx;
        s.y += s.vy;

        // Wrap around
        if (s.x < -2) s.x = w + 2;
        if (s.x > w + 2) s.x = -2;
        if (s.y < -2) s.y = h + 2;
        if (s.y > h + 2) s.y = -2;

        // Twinkle
        s.alpha += s.alphaSpeed * s.alphaDir;
        if (s.alpha >= 1) { s.alpha = 1; s.alphaDir = -1; }
        if (s.alpha <= 0.05) { s.alpha = 0.05; s.alphaDir = 1; }

        ctx!.globalAlpha = s.alpha;
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      ctx!.globalAlpha = 1;
      animId = requestAnimationFrame(frame);
    }

    animId = requestAnimationFrame(frame);

    const onResize = () => {
      // Reset scale before resize
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      resize();
      initSparks();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, [background, minSize, maxSize, speed, particleColor, particleDensity]);

  return (
    <canvas
      ref={canvasRef}
      id={id}
      className={cn("h-full w-full", className)}
    />
  );
}
