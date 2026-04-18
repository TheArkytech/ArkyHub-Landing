"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SparklesCore } from "@/components/ui/sparkles";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─── Constants ─── */
const ACCENT = "#0f8983";
const ACCENT_2 = "#2ba59e";
const PARTICLE_COUNT = 1400;

/* ─── Shared inline-style objects (card-interior dark palette) ─── */
const S = {
  cardBg: {
    background: `radial-gradient(120% 80% at 50% -20%, color-mix(in oklab, ${ACCENT} 22%, transparent), transparent 60%), linear-gradient(160deg, #063532 0%, #021613 100%)`,
    boxShadow: `0 60px 120px -20px rgba(0,0,0,0.55), 0 24px 48px -16px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -2px 4px rgba(0,0,0,0.5)`,
    border: "1px solid rgba(255,255,255,0.05)",
  },
  sheen: {
    background: "radial-gradient(800px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.08) 0%, transparent 40%)",
    mixBlendMode: "screen" as const,
  },
  chrome: {
    background: "linear-gradient(180deg, #0f2322 0%, #0a1c1b 100%)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  sidebar: {
    borderRight: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(0,0,0,0.2)",
  },
  tileThumb: {
    background: "linear-gradient(180deg, rgba(43,165,158,0.06), rgba(0,0,0,0)) , #081817",
  },
  panel: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: 12,
  },
  featureCard: {
    borderRadius: 24,
    padding: "36px 40px",
    background: `radial-gradient(120% 80% at 0% 0%, rgba(43,165,158,0.18), transparent 55%), linear-gradient(160deg, rgba(8,24,23,0.95) 0%, rgba(6,18,17,0.98) 100%)`,
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 40px 80px -20px rgba(0,0,0,0.6), 0 2px 0 rgba(255,255,255,0.06) inset, 0 -1px 0 rgba(0,0,0,0.4) inset",
    backdropFilter: "blur(40px) saturate(1.4)",
    WebkitBackdropFilter: "blur(40px) saturate(1.4)",
    color: "#e9f6f4",
  },
} as const;

/* ─────────────────────────────────────────────────────────────────
   CinematicHero
   Replaces Hero + Problem + ProjectCard with one scroll-pinned,
   GSAP-driven cinematic flow.
   ───────────────────────────────────────────────────────────────── */
export function CinematicHero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlePhaseRef = useRef("idle");

  const tHero = useTranslations("home.hero");
  const tMockup = useTranslations("home.mockup");
  const tProblem = useTranslations("home.problem");
  const tCin = useTranslations("home.cinematic");
  const tCta = useTranslations("common.cta");
  const tStk = useTranslations("home.mockup.stakeholders");

  /* ── Particle system (2-D canvas) ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const particles: {
      bx: number; by: number;
      phaseX: number; phaseY: number;
      speedX: number; speedY: number;
      ampX: number; ampY: number;
      radius: number;
      ring: { x: number; y: number };
      cluster: { x: number; y: number };
    }[] = [];

    function resize() {
      const r = canvas!.getBoundingClientRect();
      canvas!.width = r.width * DPR;
      canvas!.height = r.height * DPR;
    }
    resize();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
      const ringR = 140 + (i % 5) * 28;
      const k = i % 5;
      const clAngle = (k / 5) * Math.PI * 2 - Math.PI / 2;
      particles.push({
        bx: (Math.random() - 0.5) * 1400,
        by: (Math.random() - 0.5) * 900,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        speedX: 0.4 + Math.random() * 2.8,
        speedY: 0.4 + Math.random() * 2.8,
        ampX: 15 + Math.random() * 55,
        ampY: 15 + Math.random() * 55,
        radius: 0.4 + Math.pow(Math.random(), 2) * 4.5,
        ring: { x: Math.cos(angle) * ringR, y: Math.sin(angle) * ringR },
        cluster: {
          x: Math.cos(clAngle) * 220 + (Math.random() - 0.5) * 18,
          y: Math.sin(clAngle) * 220 + (Math.random() - 0.5) * 18,
        },
      });
    }

    const t0 = performance.now();
    let phaseStart = t0;
    let lastPhase = "idle";
    let animId: number;
    const ease = (v: number) => (v < 0.5 ? 2 * v * v : 1 - Math.pow(-2 * v + 2, 2) / 2);

    function frame(now: number) {
      const t = (now - t0) / 1000;
      const phase = particlePhaseRef.current;
      if (phase !== lastPhase) { phaseStart = now; lastPhase = phase; }
      const tp = Math.min((now - phaseStart) / 1400, 1);
      const e = ease(tp);

      const w = canvas!.width, h = canvas!.height;
      ctx2d!.clearRect(0, 0, w, h);
      ctx2d!.save();
      ctx2d!.translate(w / 2, h / 2);
      ctx2d!.scale(DPR, DPR);

      ctx2d!.fillStyle = ACCENT_2;
      ctx2d!.globalAlpha = 0.85;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];
        const cx = p.bx + Math.sin(t * p.speedX + p.phaseX) * p.ampX;
        const cy = p.by + Math.cos(t * p.speedY + p.phaseY) * p.ampY;
        let tx = cx, ty = cy;

        if (phase === "order") {
          tx = cx + (p.ring.x - cx) * e;
          ty = cy + (p.ring.y - cy) * e;
        } else if (phase === "clusters" || phase === "done") {
          tx = p.ring.x + (p.cluster.x - p.ring.x) * e;
          ty = p.ring.y + (p.cluster.y - p.ring.y) * e;
        }

        ctx2d!.beginPath();
        ctx2d!.arc(tx, ty, p.radius, 0, Math.PI * 2);
        ctx2d!.fill();
      }
      ctx2d!.restore();
      animId = requestAnimationFrame(frame);
    }

    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  /* ── GSAP scroll timeline ── */
  useEffect(() => {
    if (!stageRef.current) return;

    const ctx = gsap.context(() => {
      const isMob = window.innerWidth < 768;

      /* Initial states */
      gsap.set(".ch-eyebrow, .ch-line-a, .ch-line-b, .ch-sparkles, .ch-sub, .ch-pills", {
        autoAlpha: 0, y: 40, filter: "blur(14px)",
      });
      gsap.set(".ch-card", {
        y: window.innerHeight + 120,
        autoAlpha: 1,
        width: "min(88vw, 1400px)",
        height: "min(80vh, 780px)",
        borderRadius: 40,
      });
      gsap.set(".ch-card-right", { autoAlpha: 0 });
      gsap.set(".ch-ws-wrap", {
        autoAlpha: 0, y: 120, rotationX: 30, rotationY: -12, scale: 0.7,
      });
      gsap.set(".ch-reveal", { autoAlpha: 0, y: 20 });
      gsap.set(".ch-cta-wrap", { autoAlpha: 0, scale: 0.85, filter: "blur(24px)" });
      gsap.set(".ch-hint", { autoAlpha: 0 });
      gsap.set(".ch-order-label", { opacity: 0 });
      /* Stacked cards: all visible, layered with offset */
      gsap.set('.ch-feat[data-f="plans"]', { autoAlpha: 1, y: 0, scale: 1 });
      gsap.set('.ch-feat[data-f="bim"]',   { autoAlpha: 1, y: 8, scale: 0.97 });
      gsap.set('.ch-feat[data-f="tour"]',  { autoAlpha: 1, y: 16, scale: 0.94 });
      gsap.set('.ch-feat[data-f="stk"]',   { autoAlpha: 1, y: 24, scale: 0.91 });
      gsap.set(".ch-feat-stack", { autoAlpha: 0, y: 60, filter: "blur(12px)" });
      gsap.set(".ch-fill", { scaleX: 0 });
      gsap.set("#chCanvas", { opacity: 0 });
      gsap.set(".ch-chaos, .ch-order", { opacity: 0 });

      /* Intro */
      const intro = gsap.timeline({ delay: 0.2 });
      intro
        .to(".ch-eyebrow",  { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out" })
        .to(".ch-line-a",   { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.0, ease: "expo.out" }, "-=0.4")
        .to(".ch-line-b",   { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "expo.out" }, "-=0.7")
        .to(".ch-sparkles", { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.0, ease: "power3.out" }, "-=0.6")
        .to(".ch-sub",      { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power3.out" }, "-=0.8")
        .to(".ch-pills",    { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out" }, "-=0.6")
        .to(".ch-hint",     { autoAlpha: 1, duration: 0.6 }, "-=0.3");

      /* Scroll-driven timeline */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.current,
          start: "top top",
          end: "+=11500",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      tl
        /* 1 — hero recedes */
        .to(".ch-hero", { scale: 1.12, filter: "blur(18px)", opacity: 0.15, ease: "power2.inOut", duration: 1.2 }, 0)
        .to(".ch-hint", { autoAlpha: 0, duration: 0.4 }, 0)

        /* 2 — card rises */
        .to(".ch-card", { y: 0, ease: "power3.inOut", duration: 1.6 }, 0)

        /* 3 — particle act */
        .to("#chCanvas",  { opacity: 1, duration: 0.8, ease: "power2.out" }, "pIn")
        .to(".ch-chaos",  { opacity: 1, duration: 0.8, ease: "power2.out" }, "pIn+=0.3")
        .call(() => { particlePhaseRef.current = "chaos"; }, undefined, "pIn")
        .to({}, { duration: 1.6 })
        .call(() => { particlePhaseRef.current = "order"; })
        .to(".ch-chaos", { opacity: 0, duration: 0.6 })
        .to(".ch-order", { opacity: 1, duration: 0.8 }, "-=0.3")
        .to({}, { duration: 1.6 })
        .call(() => { particlePhaseRef.current = "clusters"; })
        .to({}, { duration: 1.2 })

        /* 4 — "brings order" fades, ArkyHub migrates to top-right */
        .to(".ch-order-sub", { opacity: 0, y: 20, duration: 0.6, ease: "power3.in" })
        .to("#chCanvas", { opacity: 0, duration: 0.8 }, "<")
        .call(() => { particlePhaseRef.current = "done"; })

        /* card expands + ArkyHub moves to top-right simultaneously */
        .addLabel("expand")
        .to(".ch-card", { width: "100vw", height: "100vh", borderRadius: 0, ease: "power3.inOut", duration: 1.3 }, "expand")
        .to(".ch-order", {
          top: "8%", left: "auto", right: "6%",
          xPercent: 0, yPercent: 0,
          x: 0, y: 0,
          fontSize: "clamp(2.5rem, 5.5vw, 5rem)",
          textAlign: "right",
          lineHeight: 0.9,
          duration: 1.4,
          ease: "expo.inOut",
        }, "expand")

        /* show ARKYTECH BRAND label */
        .to(".ch-order-label", { opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.4")

        /* hold so brand is visible alone */
        .to({}, { duration: 1.4 })

        /* 5 — workspace reveals */
        .to(".ch-ws-wrap", { autoAlpha: 1, y: 0, rotationX: 0, rotationY: 0, scale: 1, ease: "expo.out", duration: 2.0 })
        .to(".ch-card-right", { autoAlpha: 1, x: 0, duration: 1.2, ease: "expo.out" }, "<")
        .fromTo(".ch-card-right", { x: 40, scale: 0.9 }, { x: 0, scale: 1, duration: 1.2, ease: "expo.out" }, "<")

        /* 6 — widgets stagger */
        .to(".ch-reveal", { autoAlpha: 1, y: 0, stagger: 0.12, ease: "back.out(1.1)", duration: 0.9 }, "-=1.4")
        .to(".ch-counter", { innerText: 148, snap: { innerText: 1 }, duration: 1.8, ease: "expo.out" }, "-=1.6")

        /* hold */
        .to({}, { duration: 1.0 })

        /* 8 — stacked feature cards */
        .addLabel("fStack", "+=0.4")
        /* Reveal the whole stack */
        .to(".ch-feat-stack", { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.0, ease: "expo.out" }, "fStack")
        .to(".ch-fill-1", { scaleX: 1, duration: 1.8, ease: "none" }, "fStack")
        .to({}, { duration: 1.0 })

        /* Peel card 1 (plans) → card 2 (bim) moves to front */
        .addLabel("f2")
        .to('.ch-feat[data-f="plans"]', { y: -120, autoAlpha: 0, scale: 0.92, duration: 0.8, ease: "power3.in" }, "f2")
        .to('.ch-feat[data-f="bim"]',   { y: 0, scale: 1, duration: 0.8, ease: "expo.out" }, "f2")
        .to('.ch-feat[data-f="tour"]',  { y: 8, scale: 0.97, duration: 0.8, ease: "expo.out" }, "f2")
        .to('.ch-feat[data-f="stk"]',   { y: 16, scale: 0.94, duration: 0.8, ease: "expo.out" }, "f2")
        .to(".ch-fill-2", { scaleX: 1, duration: 1.8, ease: "none" }, "f2")
        .to({}, { duration: 1.0 })

        /* Peel card 2 (bim) → card 3 (tour) moves to front */
        .addLabel("f3")
        .to('.ch-feat[data-f="bim"]',  { y: -120, autoAlpha: 0, scale: 0.92, duration: 0.8, ease: "power3.in" }, "f3")
        .to('.ch-feat[data-f="tour"]', { y: 0, scale: 1, duration: 0.8, ease: "expo.out" }, "f3")
        .to('.ch-feat[data-f="stk"]',  { y: 8, scale: 0.97, duration: 0.8, ease: "expo.out" }, "f3")
        .to(".ch-fill-3", { scaleX: 1, duration: 1.8, ease: "none" }, "f3")
        .to({}, { duration: 1.0 })

        /* Peel card 3 (tour) → card 4 (stk) is last */
        .addLabel("f4")
        .to('.ch-feat[data-f="tour"]', { y: -120, autoAlpha: 0, scale: 0.92, duration: 0.8, ease: "power3.in" }, "f4")
        .to('.ch-feat[data-f="stk"]',  { y: 0, scale: 1, duration: 0.8, ease: "expo.out" }, "f4")
        .to(".ch-fill-4", { scaleX: 1, duration: 1.8, ease: "none" }, "f4")
        .to({}, { duration: 1.2 })

        /* 9 — CTA swap */
        .set(".ch-hero", { autoAlpha: 0 })
        .set(".ch-cta-wrap", { autoAlpha: 1 })
        .to({}, { duration: 0.4 })
        .to(".ch-card", {
          width: isMob ? "94vw" : "82vw",
          height: isMob ? "82vh" : "72vh",
          borderRadius: isMob ? 28 : 36,
          ease: "expo.inOut", duration: 1.6,
        }, "pull")
        .to(".ch-cta-wrap", { scale: 1, filter: "blur(0px)", ease: "expo.inOut", duration: 1.6 }, "pull")

        /* 10 — card exits */
        .to(".ch-card", { y: -(window.innerHeight + 200), autoAlpha: 0, ease: "power3.in", duration: 1.4 });

    }, stageRef);

    return () => ctx.revert();
  }, []);

  /* ── Mouse sheen + mockup tilt ── */
  useEffect(() => {
    let rafId = 0;
    const handler = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 2) return;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const cardEl = stageRef.current?.querySelector(".ch-card") as HTMLElement | null;
        const wsEl = stageRef.current?.querySelector(".ch-ws") as HTMLElement | null;
        if (!cardEl) return;
        const r = cardEl.getBoundingClientRect();
        cardEl.style.setProperty("--mx", `${e.clientX - r.left}px`);
        cardEl.style.setProperty("--my", `${e.clientY - r.top}px`);
        if (wsEl) {
          gsap.to(wsEl, {
            rotationY: ((e.clientX / window.innerWidth) - 0.5) * 16,
            rotationX: -((e.clientY / window.innerHeight) - 0.5) * 12,
            ease: "power3.out",
            duration: 1.2,
            transformPerspective: 1200,
          });
        }
      });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  /* ── Resize → refresh ScrollTrigger ── */
  useEffect(() => {
    const h = () => ScrollTrigger.refresh();
    window.addEventListener("resize", h, { passive: true });
    return () => window.removeEventListener("resize", h);
  }, []);

  /* ──────────── JSX ──────────── */
  return (
    <div
      ref={stageRef}
      className="relative w-screen h-screen overflow-hidden flex items-center justify-center"
      style={{ perspective: 1600 }}
    >
      {/* ── Ambient teal radial ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute -z-0"
        style={{
          inset: "-20% -10% auto -10%",
          height: "80%",
          background: `radial-gradient(60% 50% at 50% 30%, color-mix(in oklab, ${ACCENT} 14%, transparent), transparent 70%)`,
        }}
      />
      {/* ── Hairline grid ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 opacity-55"
        style={{
          backgroundImage: `linear-gradient(to right, color-mix(in oklab, var(--fg, #0a0a0a) 7%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--fg, #0a0a0a) 7%, transparent) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 70% 55% at 50% 40%, #000 10%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 55% at 50% 40%, #000 10%, transparent 80%)",
        }}
      />

      {/* ═══════ HERO TEXT ═══════ */}
      <div className="ch-hero absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 will-change-transform">
        {/* Eyebrow */}
        <div
          className="ch-eyebrow mb-7 inline-flex items-center gap-2.5 rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-3.5 py-2"
          style={{ boxShadow: "0 1px 2px rgba(15,23,23,0.04)" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" style={{ boxShadow: `0 0 0 3px color-mix(in oklab, ${ACCENT} 18%, transparent)` }} />
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">{tHero("eyebrow")}</span>
        </div>

        {/* Headline */}
        <h1
          className="font-[family-name:var(--font-display)] font-bold max-w-[1100px] mx-auto"
          style={{ fontSize: "clamp(2.5rem, 8vw, 6.25rem)", lineHeight: 1.05, letterSpacing: "-0.035em" }}
        >
          <span
            className="ch-line-a block text-[var(--text-primary)]"
            style={{ textShadow: "0 18px 40px color-mix(in oklab, var(--fg, #0a0a0a) 10%, transparent), 0 2px 4px color-mix(in oklab, var(--fg, #0a0a0a) 6%, transparent)" }}
          >
            {tHero("h1Pre")}
          </span>
          <span
            className="ch-line-b block"
            style={{
              background: `linear-gradient(180deg, ${ACCENT} 0%, var(--text-accent) 100%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              filter: `drop-shadow(0px 12px 24px color-mix(in oklab, ${ACCENT} 25%, transparent)) drop-shadow(0px 2px 4px color-mix(in oklab, ${ACCENT} 18%, transparent))`,
            }}
          >
            {tHero("h1Accent")}
          </span>
        </h1>

        {/* ── Sparkles divider ── */}
        <div
          className="ch-sparkles relative w-full max-w-[48rem] h-36 mt-1"
          style={{
            maskImage: "radial-gradient(420px 180px at 50% 0%, black 30%, transparent 85%)",
            WebkitMaskImage: "radial-gradient(420px 180px at 50% 0%, black 30%, transparent 85%)",
          }}
        >
          {/* Gradient glow lines */}
          <div className="absolute left-[10%] right-[10%] top-0 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent h-[2px] blur-sm opacity-80" />
          <div className="absolute left-[10%] right-[10%] top-0 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent h-px opacity-90" />
          <div className="absolute left-[30%] right-[30%] top-0 bg-gradient-to-r from-transparent via-teal-400 to-transparent h-[5px] blur-sm opacity-70" />
          <div className="absolute left-[30%] right-[30%] top-0 bg-gradient-to-r from-transparent via-teal-400 to-transparent h-px opacity-80" />

          {/* Sparkles canvas */}
          <SparklesCore
            background="transparent"
            minSize={0.5}
            maxSize={1.8}
            particleDensity={1400}
            className="w-full h-full"
            particleColor={ACCENT_2}
            speed={0.5}
          />
        </div>

        {/* Subheadline — Holded style */}
        <p
          className="ch-sub mx-auto max-w-[560px] text-[var(--text-secondary)] leading-relaxed"
          style={{ fontSize: "clamp(1rem, 1.3vw, 1.125rem)", textWrap: "pretty" }}
        >
          {tHero("subhead")}
        </p>

        {/* Arkytech family tag */}
        <p className="ch-pills mt-5 text-[12px] tracking-[0.04em] text-[var(--text-muted)]">
          {tHero("familyTag")}{" "}
          <span
            className="font-semibold"
            style={{
              background: `linear-gradient(180deg, var(--text-primary) 0%, ${ACCENT_2} 100%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Arkytech
          </span>
        </p>
      </div>

      {/* ═══════ CTA LAYER (revealed at end) ═══════ */}
      <div className="ch-cta-wrap absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
        <div className="pointer-events-auto max-w-[720px]">
          <h2
            className="font-[family-name:var(--font-display)] font-bold mx-auto mb-4"
            style={{
              fontSize: "clamp(2rem, 5.4vw, 4.5rem)",
              lineHeight: 1.02,
              background: "linear-gradient(180deg, var(--text-primary) 0%, var(--text-accent) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {tCin("ctaH1")}<br />{tCin("ctaH2")}
          </h2>
          <p className="text-[var(--text-secondary)] text-[1.05rem] leading-relaxed max-w-[560px] mx-auto mb-8" style={{ textWrap: "pretty" }}>
            {tCin("ctaSub")}
          </p>
          <div className="flex gap-3.5 justify-center flex-wrap">
            <Link
              href="#final-cta"
              className="inline-flex items-center gap-2.5 h-[52px] px-5 rounded-xl font-semibold text-[0.95rem] text-white no-underline"
              style={{
                background: `linear-gradient(180deg, ${ACCENT_2} 0%, ${ACCENT} 100%)`,
                boxShadow: `0 0 0 1px color-mix(in oklab, ${ACCENT} 60%, transparent), 0 12px 28px -8px color-mix(in oklab, ${ACCENT} 60%, transparent), inset 0 1px 0 rgba(255,255,255,0.25)`,
              }}
            >
              {tCta("getEarlyAccess")}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>
            </Link>
            <Link
              href="#final-cta"
              className="inline-flex items-center gap-2.5 h-[52px] px-5 rounded-xl font-semibold text-[0.95rem] text-[var(--text-primary)] no-underline border border-[var(--border-strong)] bg-[var(--surface-elevated)]"
              style={{ boxShadow: "0 1px 2px rgba(15,23,23,0.04)" }}
            >
              {tCta("scheduleDemo")}
            </Link>
          </div>
        </div>
      </div>

      {/* ═══════ CINEMATIC CARD ═══════ */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" style={{ perspective: 1800 }}>
        <div
          className="ch-card relative overflow-hidden pointer-events-auto will-change-transform"
          style={{ ...S.cardBg, borderRadius: 40, width: "min(88vw, 1400px)", height: "min(80vh, 780px)" }}
        >
          {/* Blueprint grain inside card */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage: "radial-gradient(ellipse at 50% 40%, #000 40%, transparent 85%)",
              WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, #000 40%, transparent 85%)",
            }}
          />
          {/* Mouse sheen */}
          <div className="absolute inset-0 pointer-events-none z-[2]" style={S.sheen} />

          {/* ── Particle canvas ── */}
          <canvas
            ref={canvasRef}
            id="chCanvas"
            className="absolute inset-0 w-full h-full pointer-events-none z-[4]"
            style={{ borderRadius: "inherit", opacity: 0 }}
          />

          {/* ── Chaos / order text overlays ── */}
          <div
            className="ch-chaos absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-[5] text-white font-[family-name:var(--font-display)] font-bold max-w-[86%]"
            style={{
              fontSize: "clamp(2rem, 5vw, 4.5rem)", lineHeight: 1.02, letterSpacing: "-0.035em",
              filter: "drop-shadow(0 12px 28px rgba(0,0,0,0.55))",
            }}
          >
            {tProblem("chaosHeadline")}
          </div>
          <div
            className="ch-order absolute text-center pointer-events-none z-[5] text-white font-[family-name:var(--font-display)] font-bold"
            style={{
              top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              fontSize: "clamp(2rem, 5vw, 4.5rem)", lineHeight: 1.15, letterSpacing: "-0.035em",
              filter: "drop-shadow(0 12px 28px rgba(0,0,0,0.55))",
            }}
          >
            <span
              className="ch-order-word block"
              style={{
                background: "linear-gradient(180deg, #ffffff 0%, #8cbfbb 85%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                letterSpacing: "-0.06em",
                fontWeight: 800,
              }}
            >
              ArkyHub
            </span>
            <span className="ch-order-sub block">{tProblem("orderHeadlinePre").trim()} <span style={{ color: ACCENT_2 }}>{tProblem("orderHeadlineAccent")}</span></span>
            <small
              className="ch-order-label block font-semibold"
              style={{
                fontSize: "0.18em",
                letterSpacing: "0.28em",
                marginTop: 10,
                color: "rgba(227,242,240,0.55)",
                opacity: 0,
              }}
            >
              ARKYTECH BRAND
            </small>
          </div>

          {/* ── Card content grid ── */}
          <div
            className="relative z-[3] w-full h-full grid items-center gap-12 p-12 max-w-[1280px] mx-auto"
            style={{ gridTemplateColumns: "1.6fr 1fr" }}
          >
            {/* LEFT — workspace mockup */}
            <div className="ch-ws-wrap relative flex items-center justify-center" style={{ height: 540, transformStyle: "preserve-3d" }}>
              <div
                className="ch-ws relative w-full h-full overflow-hidden will-change-transform"
                style={{
                  maxWidth: 540,
                  borderRadius: 20,
                  background: "#0b1b1a",
                  boxShadow: "0 40px 80px -20px rgba(0,0,0,0.7), 0 18px 30px -10px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.06)",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Screen glare */}
                <div className="absolute inset-0 pointer-events-none z-50" style={{ background: "linear-gradient(115deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 42%)" }} />

                {/* Chrome bar */}
                <div className="flex items-center gap-3 px-3.5 py-3" style={S.chrome}>
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.16)" }} />
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.16)" }} />
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.16)" }} />
                  </div>
                  <div
                    className="flex-1 h-6 rounded-md flex items-center justify-center font-[family-name:var(--font-mono)] text-[10.5px]"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(227,242,240,0.55)" }}
                  >
                    arkyhub.app/projects/casa-ribera
                  </div>
                </div>

                {/* Body */}
                <div className="grid h-[calc(100%-49px)]" style={{ gridTemplateColumns: "140px 1fr" }}>
                  {/* Sidebar */}
                  <aside className="p-3" style={S.sidebar}>
                    <p className="font-[family-name:var(--font-mono)] text-[9.5px] tracking-[0.16em] uppercase mb-2 ml-1" style={{ color: "rgba(227,242,240,0.42)" }}>
                      {tMockup("projects")}
                    </p>
                    <ul className="flex flex-col gap-0.5 list-none m-0 p-0">
                      {["Casa Ribera", "Edificio Marítimo", "Estudio Soler", "Vivienda Olivos"].map((name, i) => (
                        <li
                          key={name}
                          className="flex items-center gap-2 px-2 py-1.5 rounded-[7px] text-[11.5px]"
                          style={i === 0
                            ? { background: `rgba(43,165,158,0.08)`, color: "#e9f6f4", boxShadow: `inset 0 0 0 1px rgba(43,165,158,0.25)` }
                            : { color: "rgba(227,242,240,0.62)" }
                          }
                        >
                          <span
                            className="w-[5px] h-[5px] rounded-full"
                            style={i === 0
                              ? { background: ACCENT_2, boxShadow: `0 0 0 3px rgba(43,165,158,0.22)` }
                              : { background: "rgba(255,255,255,0.2)" }
                            }
                          />
                          {name}
                        </li>
                      ))}
                    </ul>
                  </aside>

                  {/* Main */}
                  <div className="p-4 flex flex-col gap-3.5" style={{ color: "#e9f6f4" }}>
                    {/* Header */}
                    <div className="ch-reveal flex items-center justify-between">
                      <div>
                        <h4 className="font-[family-name:var(--font-display)] font-semibold text-sm m-0 tracking-tight">Casa Ribera</h4>
                        <span className="font-[family-name:var(--font-mono)] text-[10px]" style={{ color: "rgba(227,242,240,0.45)" }}>
                          {tMockup("lastUpdated")}
                        </span>
                      </div>
                      <span
                        className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-full"
                        style={{ background: `rgba(43,165,158,0.14)`, color: ACCENT_2, border: `1px solid rgba(43,165,158,0.3)` }}
                      >
                        <span className="w-[5px] h-[5px] rounded-full" style={{ background: ACCENT_2, boxShadow: `0 0 6px ${ACCENT_2}` }} />
                        {tMockup("inProgress")}
                      </span>
                    </div>

                    {/* Tabs */}
                    <div className="ch-reveal flex gap-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 4 }}>
                      {(["Plans", "BIM", "Tour", "Stakeholders"] as const).map((tab, i) => (
                        <button
                          key={tab}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium bg-transparent border-none cursor-default"
                          style={{
                            color: i === 0 ? "#fff" : "rgba(227,242,240,0.5)",
                            borderBottom: i === 0 ? `2px solid ${ACCENT_2}` : "2px solid transparent",
                          }}
                        >
                          {tMockup(`tabs.${tab}`)}
                        </button>
                      ))}
                    </div>

                    {/* Plan tiles */}
                    <div className="ch-reveal grid grid-cols-3 gap-2.5">
                      {[
                        { name: tMockup("plans.floorPlanL0"), v: "v07" },
                        { name: tMockup("plans.floorPlanL1"), v: "v04" },
                        { name: "BIM · IFC", v: "42.6MB" },
                      ].map((tile) => (
                        <div key={tile.name} className="rounded-[10px] overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                          <div className="relative h-[72px] overflow-hidden" style={S.tileThumb}>
                            <div
                              className="absolute inset-0 opacity-35"
                              style={{
                                backgroundImage: `linear-gradient(to right, rgba(43,165,158,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(43,165,158,0.3) 1px, transparent 1px)`,
                                backgroundSize: "9px 9px",
                              }}
                            />
                          </div>
                          <div className="flex items-center justify-between px-2 py-1.5 text-[10.5px]" style={{ color: "rgba(227,242,240,0.78)" }}>
                            <span>{tile.name}</span>
                            <span className="font-[family-name:var(--font-mono)] text-[10px]" style={{ color: ACCENT_2 }}>{tile.v}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Sub-grid: version history + stakeholders */}
                    <div className="ch-reveal grid gap-2.5" style={{ gridTemplateColumns: "1.2fr 1fr" }}>
                      {/* Version history */}
                      <div style={S.panel}>
                        <h5 className="font-[family-name:var(--font-mono)] text-[9.5px] tracking-[0.16em] uppercase font-medium mb-2.5" style={{ color: "rgba(227,242,240,0.45)", margin: "0 0 10px" }}>
                          {tCin("versionHistory")}
                        </h5>
                        {[
                          { tag: "v07", name: tMockup("plans.floorPlanL0"), when: "2h" },
                          { tag: "v06", name: tMockup("plans.floorPlanL0"), when: "Yday" },
                          { tag: "v04", name: tMockup("plans.floorPlanL1"), when: "3d" },
                        ].map((row, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2.5 py-1.5 text-[11px]"
                            style={{
                              color: "rgba(227,242,240,0.78)",
                              borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : undefined,
                            }}
                          >
                            <span
                              className="font-[family-name:var(--font-mono)] text-[9.5px] px-1.5 py-px rounded"
                              style={{ color: ACCENT_2, border: `1px solid rgba(43,165,158,0.3)`, background: `rgba(43,165,158,0.08)` }}
                            >
                              {row.tag}
                            </span>
                            <span className="flex-1 truncate">{row.name}</span>
                            <span className="font-[family-name:var(--font-mono)] text-[9.5px]" style={{ color: "rgba(227,242,240,0.4)" }}>{row.when}</span>
                          </div>
                        ))}
                        <div className="flex items-baseline gap-2 pt-2.5">
                          <span className="ch-counter font-[family-name:var(--font-display)] font-extrabold text-[30px] tracking-tight text-white">0</span>
                          <span className="text-[11px] tracking-[0.06em] uppercase" style={{ color: "rgba(227,242,240,0.55)" }}>{tCin("plansVersioned")}</span>
                        </div>
                      </div>

                      {/* Stakeholders */}
                      <div style={S.panel}>
                        <h5 className="font-[family-name:var(--font-mono)] text-[9.5px] tracking-[0.16em] uppercase font-medium mb-2.5" style={{ color: "rgba(227,242,240,0.45)", margin: "0 0 10px" }}>
                          {tCin("stakeholdersHeading")}
                        </h5>
                        {[
                          { initials: "ML", role: tStk("architect"), scope: tStk("fullAccess"), accent: true },
                          { initials: "GC", role: tStk("contractor"), scope: tStk("plansIssues"), accent: false },
                          { initials: "MR", role: tStk("client"), scope: tStk("dashboardTour"), accent: false },
                          { initials: "II", role: "MEP", scope: tStk("plansOnly"), accent: false },
                        ].map((s, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 py-1.5"
                            style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : undefined }}
                          >
                            <span
                              className="w-[22px] h-[22px] rounded-full flex items-center justify-center font-[family-name:var(--font-mono)] text-[9.5px] font-semibold"
                              style={s.accent
                                ? { background: `rgba(43,165,158,0.15)`, color: ACCENT_2, border: `1px solid rgba(43,165,158,0.4)` }
                                : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#e9f6f4" }
                              }
                            >
                              {s.initials}
                            </span>
                            <span className="text-[11px] font-medium text-[#e9f6f4]">{s.role}</span>
                            <span className="ml-auto font-[family-name:var(--font-mono)] text-[9.5px]" style={{ color: "rgba(227,242,240,0.45)" }}>{s.scope}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — feature deck */}
            <div className="ch-card-right flex flex-col justify-center items-stretch gap-7 h-full">
              {/* Feature deck — stacked cards */}
              <div className="ch-feat-stack relative w-full" style={{ height: 260, marginTop: 8 }}>
                {([
                  { key: "plans", step: tCin("feat1Step"), title: tCin("feat1Title"), body: tCin("feat1Body") },
                  { key: "bim",   step: tCin("feat2Step"), title: tCin("feat2Title"), body: tCin("feat2Body") },
                  { key: "tour",  step: tCin("feat3Step"), title: tCin("feat3Title"), body: tCin("feat3Body") },
                  { key: "stk",   step: tCin("feat4Step"), title: tCin("feat4Title"), body: tCin("feat4Body") },
                ] as const).map((f, i) => (
                  <div
                    key={f.key}
                    className="ch-feat absolute inset-x-0 top-0 will-change-transform"
                    data-f={f.key}
                    style={{
                      ...S.featureCard,
                      height: "auto",
                      minHeight: 200,
                      zIndex: 4 - i,
                    }}
                  >
                    <div className="font-[family-name:var(--font-mono)] text-[10.5px] tracking-[0.18em] uppercase mb-3 inline-flex items-center gap-2" style={{ color: ACCENT_2 }}>
                      <span className="w-6 h-px" style={{ background: ACCENT_2 }} />
                      {f.step}
                    </div>
                    <h4 className="font-[family-name:var(--font-display)] font-bold text-white m-0 mb-2.5" style={{ fontSize: "clamp(1.3rem, 2vw, 1.65rem)", lineHeight: 1.15, letterSpacing: "-0.025em" }}>
                      {f.title}
                    </h4>
                    <p className="text-[0.9rem] leading-relaxed m-0" style={{ color: "rgba(227,242,240,0.72)" }}>{f.body}</p>
                  </div>
                ))}

                {/* Progress dots */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-2.5">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="relative overflow-hidden" style={{ width: 28, height: 3, borderRadius: 3, background: "rgba(255,255,255,0.12)" }}>
                      <div className={`ch-fill ch-fill-${n} absolute inset-0`} style={{ background: ACCENT_2, transformOrigin: "left", transform: "scaleX(0)" }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ SCROLL HINT ═══════ */}
      <div className="ch-hint absolute left-1/2 bottom-7 -translate-x-1/2 z-[12] flex flex-col items-center gap-2 text-[var(--text-muted)] text-[11px] tracking-[0.14em] uppercase font-semibold opacity-80">
        <span>{tCin("scrollHint")}</span>
        <div className="relative w-[22px] h-[34px] rounded-xl" style={{ border: "1.5px solid var(--text-muted)" }}>
          <span
            className="absolute left-1/2 top-1.5 -translate-x-1/2 w-0.5 h-1.5 rounded-sm bg-[var(--text-muted)]"
            style={{ animation: "chScrollDot 1.6s ease-in-out infinite" }}
          />
        </div>
      </div>

      {/* ═══════ FILM GRAIN ═══════ */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none z-[60] opacity-[0.04]"
        style={{
          mixBlendMode: "multiply",
          background: `url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23n)"/></svg>')`,
        }}
      />

      {/* Keyframe for scroll-dot animation */}
      <style>{`
        @keyframes chScrollDot {
          0% { opacity: 0; transform: translate(-50%, 0); }
          40% { opacity: 1; }
          100% { opacity: 0; transform: translate(-50%, 10px); }
        }
      `}</style>
    </div>
  );
}

