"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import {
  Zap, Building2, FolderOpen, User, Settings,
  ChevronLeft, ChevronRight,
  ZoomIn, ZoomOut, RotateCw, MapPin, FileText,
  Link2, RefreshCw, Maximize, Play, Plus, Shield,
  MoveHorizontal, MoveVertical, Search, MoreVertical, Eye, UserPlus,
} from "lucide-react";
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
  /* ─── iPad frame styling ─── */
  ipadBezel: {
    background: "linear-gradient(158deg, #3a3a3d 0%, #1f1f22 50%, #0e0e10 100%)",
    boxShadow: `
      0 60px 120px -20px rgba(0,0,0,0.85),
      0 24px 48px -12px rgba(0,0,0,0.6),
      0 0 0 1px rgba(255,255,255,0.06),
      inset 0 0 0 1px rgba(255,255,255,0.12),
      inset 0 -3px 4px rgba(0,0,0,0.65),
      inset 0 3px 4px rgba(255,255,255,0.1)
    `,
    borderRadius: 30,
    padding: 20,
  },
  ipadScreen: {
    position: "relative" as const,
    width: "100%",
    height: "100%",
    borderRadius: 14,
    overflow: "hidden" as const,
    background: "#0b1b1a",
    boxShadow: "inset 0 0 20px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.04)",
  },
  ipadCamera: {
    position: "absolute" as const,
    top: "8px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "radial-gradient(circle at 35% 30%, #444 0%, #000 55%, #141414 100%)",
    boxShadow: "0 0 0 1px rgba(255,255,255,0.1), inset 0 0 2px rgba(100,200,255,0.15), inset 0 0 0 1px rgba(0,0,0,0.9)",
    zIndex: 60,
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
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  /* Scroll the page to the scroll-position that matches a timeline label
     (offset ~1s past the label so we land after the card-peel / tab-switch transition). */
  const scrollToLabel = (label: string) => {
    const tl = timelineRef.current;
    if (!tl?.scrollTrigger) return;
    const st = tl.scrollTrigger;
    const labelTime = tl.labels[label];
    if (labelTime === undefined) return;
    const targetTime = Math.min(labelTime + 1.0, tl.duration());
    const progress = targetTime / tl.duration();
    const scrollY = st.start + progress * (st.end - st.start);
    window.scrollTo({ top: scrollY, behavior: "smooth" });
  };

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
        autoAlpha: 0,
        y: 120, rotationX: 30, rotationY: -12, scale: 0.7,
        /* Right-column iPad position (~4:3 landscape) */
        top: "20%", bottom: "16%", left: "46%", right: "4%",
      });
      gsap.set(".ch-reveal", { autoAlpha: 0, y: 20 });
      gsap.set(".ch-cta-wrap", { autoAlpha: 0, scale: 0.85, filter: "blur(24px)" });
      gsap.set(".ch-hint", { autoAlpha: 0 });
      /* Stacked cards: all visible, layered with offset */
      gsap.set('.ch-feat[data-f="plans"]', { autoAlpha: 1, y: 0, scale: 1 });
      gsap.set('.ch-feat[data-f="bim"]',   { autoAlpha: 1, y: 8, scale: 0.97 });
      gsap.set('.ch-feat[data-f="tour"]',  { autoAlpha: 1, y: 16, scale: 0.94 });
      gsap.set('.ch-feat[data-f="stk"]',   { autoAlpha: 1, y: 24, scale: 0.91 });
      gsap.set(".ch-feat-stack", { autoAlpha: 0, y: 60, filter: "blur(12px)" });
      /* Mockup tab state — plans active on mount */
      gsap.set('.ch-tab-content', { autoAlpha: 0 });
      gsap.set('.ch-tab-content[data-tab="plans"]', { autoAlpha: 1 });
      gsap.set('.ch-tab-underline', { scaleX: 0 });
      gsap.set('.ch-tab-underline[data-tab="plans"]', { scaleX: 1 });
      gsap.set('.ch-tab-label', { color: "rgba(227,242,240,0.5)" });
      gsap.set('.ch-tab-label[data-tab="plans"]', { color: "#fff" });
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
      timelineRef.current = tl;

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

        /* 4 — "brings order" fades, ArkyHub migrates alone to top-right */
        .to(".ch-order-sub", { opacity: 0, y: 20, duration: 0.6, ease: "power3.in" })
        .to("#chCanvas", { opacity: 0, duration: 0.8 }, "<")
        .call(() => { particlePhaseRef.current = "done"; })

        /* card expands + ArkyHub moves to top-right simultaneously */
        .addLabel("expand")
        .to(".ch-card", { width: "100vw", height: "100vh", borderRadius: 0, ease: "power3.inOut", duration: 1.3 }, "expand")
        .to(".ch-order", {
          top: "18%", left: "auto", right: "8%",
          xPercent: 0, yPercent: 0,
          x: 0, y: 0,
          fontSize: "clamp(2.25rem, 5vw, 4.5rem)",
          textAlign: "right",
          lineHeight: 1.0,
          duration: 1.4,
          ease: "expo.inOut",
        }, "expand")

        /* hold so brand is visible alone */
        .to({}, { duration: 1.4 })

        /* 5 — inner mockup rises + settles into right-column iPad position */
        .to(".ch-ws-wrap", {
          autoAlpha: 1,
          y: 0, rotationX: 0, rotationY: 0, scale: 1,
          top: "16%", bottom: "14%", left: "45%", right: "3%",
          ease: "expo.out", duration: 2.0,
        })
        .fromTo(".ch-card-right",
          { autoAlpha: 0, y: 24, scale: 0.96 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 1.2, ease: "expo.out" },
          "-=1.4")

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

        /* Peel card 1 (plans) → card 2 (bim) moves to front + mockup tab switches */
        .addLabel("f2")
        .to('.ch-feat[data-f="plans"]', { y: -120, autoAlpha: 0, scale: 0.92, duration: 0.8, ease: "power3.in" }, "f2")
        .to('.ch-feat[data-f="bim"]',   { y: 0, scale: 1, duration: 0.8, ease: "expo.out" }, "f2")
        .to('.ch-feat[data-f="tour"]',  { y: 8, scale: 0.97, duration: 0.8, ease: "expo.out" }, "f2")
        .to('.ch-feat[data-f="stk"]',   { y: 16, scale: 0.94, duration: 0.8, ease: "expo.out" }, "f2")
        .to(".ch-fill-2", { scaleX: 1, duration: 1.8, ease: "none" }, "f2")
        /* Tab switch: plans → bim */
        .to('.ch-tab-content[data-tab="plans"]', { autoAlpha: 0, duration: 0.4, ease: "power2.inOut" }, "f2+=0.2")
        .to('.ch-tab-content[data-tab="bim"]',   { autoAlpha: 1, duration: 0.4, ease: "power2.inOut" }, "f2+=0.4")
        .to('.ch-tab-underline[data-tab="plans"]', { scaleX: 0, duration: 0.3, ease: "power2.in" }, "f2+=0.2")
        .to('.ch-tab-underline[data-tab="bim"]',   { scaleX: 1, duration: 0.3, ease: "power2.out" }, "f2+=0.4")
        .to('.ch-tab-label[data-tab="plans"]', { color: "rgba(227,242,240,0.5)", duration: 0.3 }, "f2+=0.2")
        .to('.ch-tab-label[data-tab="bim"]',   { color: "#fff", duration: 0.3 }, "f2+=0.4")
        .to({}, { duration: 1.0 })

        /* Peel card 2 (bim) → card 3 (tour) moves to front + tab switch */
        .addLabel("f3")
        .to('.ch-feat[data-f="bim"]',  { y: -120, autoAlpha: 0, scale: 0.92, duration: 0.8, ease: "power3.in" }, "f3")
        .to('.ch-feat[data-f="tour"]', { y: 0, scale: 1, duration: 0.8, ease: "expo.out" }, "f3")
        .to('.ch-feat[data-f="stk"]',  { y: 8, scale: 0.97, duration: 0.8, ease: "expo.out" }, "f3")
        .to(".ch-fill-3", { scaleX: 1, duration: 1.8, ease: "none" }, "f3")
        /* Tab switch: bim → tour */
        .to('.ch-tab-content[data-tab="bim"]',  { autoAlpha: 0, duration: 0.4, ease: "power2.inOut" }, "f3+=0.2")
        .to('.ch-tab-content[data-tab="tour"]', { autoAlpha: 1, duration: 0.4, ease: "power2.inOut" }, "f3+=0.4")
        .to('.ch-tab-underline[data-tab="bim"]',  { scaleX: 0, duration: 0.3, ease: "power2.in" }, "f3+=0.2")
        .to('.ch-tab-underline[data-tab="tour"]', { scaleX: 1, duration: 0.3, ease: "power2.out" }, "f3+=0.4")
        .to('.ch-tab-label[data-tab="bim"]',  { color: "rgba(227,242,240,0.5)", duration: 0.3 }, "f3+=0.2")
        .to('.ch-tab-label[data-tab="tour"]', { color: "#fff", duration: 0.3 }, "f3+=0.4")
        .to({}, { duration: 1.0 })

        /* Peel card 3 (tour) → card 4 (stk) is last + tab switch */
        .addLabel("f4")
        .to('.ch-feat[data-f="tour"]', { y: -120, autoAlpha: 0, scale: 0.92, duration: 0.8, ease: "power3.in" }, "f4")
        .to('.ch-feat[data-f="stk"]',  { y: 0, scale: 1, duration: 0.8, ease: "expo.out" }, "f4")
        .to(".ch-fill-4", { scaleX: 1, duration: 1.8, ease: "none" }, "f4")
        /* Tab switch: tour → stk */
        .to('.ch-tab-content[data-tab="tour"]', { autoAlpha: 0, duration: 0.4, ease: "power2.inOut" }, "f4+=0.2")
        .to('.ch-tab-content[data-tab="stk"]',  { autoAlpha: 1, duration: 0.4, ease: "power2.inOut" }, "f4+=0.4")
        .to('.ch-tab-underline[data-tab="tour"]', { scaleX: 0, duration: 0.3, ease: "power2.in" }, "f4+=0.2")
        .to('.ch-tab-underline[data-tab="stk"]',  { scaleX: 1, duration: 0.3, ease: "power2.out" }, "f4+=0.4")
        .to('.ch-tab-label[data-tab="tour"]', { color: "rgba(227,242,240,0.5)", duration: 0.3 }, "f4+=0.2")
        .to('.ch-tab-label[data-tab="stk"]',  { color: "#fff", duration: 0.3 }, "f4+=0.4")
        .to({}, { duration: 0.8 })

        /* Peel the last card (stk) so the mockup stands alone before CTA + tab switch stk → issues */
        .addLabel("fClear", "+=0.2")
        .to('.ch-feat[data-f="stk"]', { y: -120, autoAlpha: 0, scale: 0.92, duration: 0.8, ease: "power3.in" }, "fClear")
        .to(".ch-card-right",          { autoAlpha: 0, duration: 0.6, ease: "power2.in" }, "fClear+=0.3")
        .to(".ch-order",               { autoAlpha: 0, y: -20, duration: 0.8, ease: "power3.in" }, "fClear")
        /* Tab switch: stk → issues */
        .to('.ch-tab-content[data-tab="stk"]',    { autoAlpha: 0, duration: 0.4, ease: "power2.inOut" }, "fClear+=0.2")
        .to('.ch-tab-content[data-tab="issues"]', { autoAlpha: 1, duration: 0.4, ease: "power2.inOut" }, "fClear+=0.4")
        .to('.ch-tab-underline[data-tab="stk"]',    { scaleX: 0, duration: 0.3, ease: "power2.in" }, "fClear+=0.2")
        .to('.ch-tab-underline[data-tab="issues"]', { scaleX: 1, duration: 0.3, ease: "power2.out" }, "fClear+=0.4")
        .to('.ch-tab-label[data-tab="stk"]',    { color: "rgba(227,242,240,0.5)", duration: 0.3 }, "fClear+=0.2")
        .to('.ch-tab-label[data-tab="issues"]', { color: "#fff", duration: 0.3 }, "fClear+=0.4")
        .addLabel("fIssues")
        .to({}, { duration: 0.8 })

        /* 9 — CTA swap: outer card frame fades to page; inner mockup shrinks to its own closing size */
        .set(".ch-hero", { autoAlpha: 0 })
        .set(".ch-cta-wrap", { autoAlpha: 1 })
        .to({}, { duration: 0.4 })
        .addLabel("pull")
        .to(".ch-card-bg", { autoAlpha: 0, ease: "power2.inOut", duration: 1.6 }, "pull")
        .to(".ch-ws-wrap", {
          top: isMob ? "14%" : "18%",
          bottom: isMob ? "9%" : "18%",
          left: isMob ? "3%" : "22%",
          right: isMob ? "3%" : "22%",
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
          style={{ borderRadius: 40, width: "min(88vw, 1400px)", height: "min(80vh, 780px)" }}
        >
          {/* Outer card background/frame — fades to transparent at pull so the inner mockup takes over */}
          <div
            className="ch-card-bg absolute inset-0 pointer-events-none z-0"
            style={{ ...S.cardBg, borderRadius: "inherit" }}
          />

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
              minWidth: "max-content",
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
                whiteSpace: "nowrap",
                padding: "0.22em 0.08em",
              }}
            >
              ArkyHub
            </span>
            <span
              className="ch-order-sub block"
              style={{
                fontSize: "0.6em",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                marginTop: "0.25em",
                whiteSpace: "nowrap",
              }}
            >
              {tProblem("orderHeadlinePre").trim()} <span style={{ color: ACCENT_2 }}>{tProblem("orderHeadlineAccent")}</span>
            </span>
          </div>

          {/* ── Card content stage — mockup backdrop + floating feature deck ── */}
          <div className="relative z-[3] w-full h-full">
            {/* Inner mockup card — nested inside the outer card with breathing room during build, shrinks to final closing size at pull */}
            <div
              className="ch-ws-wrap absolute"
              style={{
                top: "6%",
                bottom: "6%",
                left: "5%",
                right: "5%",
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className="ch-ws relative w-full h-full will-change-transform"
                style={{
                  ...S.ipadBezel,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Inner iPad screen */}
                <div style={S.ipadScreen}>
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
                <div className="grid h-[calc(100%-49px)]" style={{ gridTemplateColumns: "64px 1fr" }}>
                  {/* Collapsed sidebar — icon rail (mirrors AppSidebar collapsed state) */}
                  <aside className="flex flex-col relative" style={S.sidebar}>
                    {/* Header — company/workspace mark */}
                    <div className="h-11 flex items-center justify-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold tracking-tight"
                        style={{
                          background: `linear-gradient(160deg, ${ACCENT_2} 0%, ${ACCENT} 100%)`,
                          color: "#fff",
                          letterSpacing: "-0.02em",
                          boxShadow: `0 2px 4px -1px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.25)`,
                        }}
                      >
                        BM
                      </div>
                    </div>

                    {/* Collapse toggle — sits on the border between sidebar and main */}
                    <div
                      className="absolute top-3 -right-2 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{
                        background: "#0b1b1a",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "rgba(227,242,240,0.65)",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
                        zIndex: 5,
                      }}
                    >
                      <ChevronLeft size={10} strokeWidth={2.2} />
                    </div>

                    {/* Digitize action — muted nav style */}
                    <div className="p-1.5 flex justify-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <button className="w-9 h-9 rounded-[9px] flex items-center justify-center border-none bg-transparent cursor-default" style={{ color: "rgba(227,242,240,0.55)" }}>
                        <Zap size={16} strokeWidth={1.8} />
                      </button>
                    </div>

                    {/* Nav menu */}
                    <div className="flex-1 flex flex-col items-center gap-1 pt-2">
                      <button className="w-9 h-9 rounded-[9px] flex items-center justify-center border-none bg-transparent cursor-default" style={{ color: "rgba(227,242,240,0.55)" }}>
                        <Building2 size={16} strokeWidth={1.8} />
                      </button>

                      <div className="relative">
                        <button
                          className="w-9 h-9 rounded-[9px] flex items-center justify-center border-none cursor-default"
                          style={{
                            background: `rgba(43,165,158,0.14)`,
                            color: ACCENT_2,
                            boxShadow: `inset 0 0 0 1px rgba(43,165,158,0.3)`,
                          }}
                        >
                          <FolderOpen size={16} strokeWidth={2} />
                        </button>
                        {/* Hover tooltip — suggesting collapsed state */}
                        <div
                          className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 rounded-md text-[10px] font-medium whitespace-nowrap pointer-events-none"
                          style={{
                            background: "rgba(10,22,21,0.95)",
                            color: "#e9f6f4",
                            border: "1px solid rgba(255,255,255,0.1)",
                            boxShadow: "0 8px 20px -4px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.4)",
                            zIndex: 20,
                          }}
                        >
                          {/* Pointer */}
                          <span
                            className="absolute top-1/2 -left-1 w-2 h-2 rotate-45 -translate-y-1/2"
                            style={{ background: "rgba(10,22,21,0.95)", borderLeft: "1px solid rgba(255,255,255,0.1)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}
                          />
                          Projects
                        </div>
                      </div>

                      <button className="w-9 h-9 rounded-[9px] flex items-center justify-center border-none bg-transparent cursor-default" style={{ color: "rgba(227,242,240,0.55)" }}>
                        <User size={16} strokeWidth={1.8} />
                      </button>
                    </div>

                    {/* Settings */}
                    <div className="p-1.5 flex justify-center" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      <button className="w-9 h-9 rounded-[9px] flex items-center justify-center border-none bg-transparent cursor-default" style={{ color: "rgba(227,242,240,0.55)" }}>
                        <Settings size={16} strokeWidth={1.8} />
                      </button>
                    </div>
                  </aside>

                  {/* Main */}
                  <div className="p-3 flex flex-col gap-2 min-h-0 overflow-hidden" style={{ color: "#e9f6f4" }}>
                    {/* Header */}
                    <div className="ch-reveal flex items-center justify-between shrink-0">
                      <div>
                        <h4 className="font-[family-name:var(--font-display)] font-semibold text-sm m-0 tracking-tight">Casa Ribera</h4>
                        <span className="font-[family-name:var(--font-mono)] text-[10px]" style={{ color: "rgba(227,242,240,0.45)" }}>
                          {tMockup("lastUpdated")}
                        </span>
                      </div>
                    </div>

                    {/* Tabs — 5 clickable tabs, each scrolls to its timeline label */}
                    <div className="ch-reveal flex items-center shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      {[
                        { k: "plans", label: "Planos", tl: "fStack" },
                        { k: "bim", label: "BIM", tl: "f2" },
                        { k: "tour", label: "Recorrido", tl: "f3" },
                        { k: "stk", label: "Partes", tl: "f4" },
                        { k: "issues", label: "Incidencias", tl: "fIssues" },
                      ].map((t) => (
                        <div key={t.k} className="relative inline-flex items-center">
                          <button
                            onClick={() => scrollToLabel(t.tl)}
                            className="inline-flex items-center px-3 py-1.5 text-[11px] font-medium bg-transparent border-none cursor-pointer whitespace-nowrap hover:brightness-125 transition-[filter] duration-200"
                          >
                            <span className="ch-tab-label" data-tab={t.k} style={{ color: "rgba(227,242,240,0.5)" }}>
                              {t.label}
                            </span>
                          </button>
                          <span
                            className="ch-tab-underline absolute bottom-0 left-3 right-3 pointer-events-none"
                            data-tab={t.k}
                            style={{
                              height: 2,
                              background: ACCENT_2,
                              transformOrigin: "left center",
                              transform: "scaleX(0)",
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Viewer — all tab contents stacked, absolute positioned */}
                    <div className="ch-reveal flex-1 relative min-h-0 rounded-[8px] overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>

                      {/* ═════ PLANS TAB ═════ */}
                      <div className="ch-tab-content absolute inset-0 flex flex-col" data-tab="plans">
                        {/* Toolbar */}
                        <div className="flex items-center gap-2 px-2.5 py-1.5 shrink-0" style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          <div className="min-w-0 max-w-[160px]">
                            <p className="text-[10px] font-semibold truncate m-0 leading-tight">CF_Av oporto 4_G&amp;H_V2</p>
                            <p className="font-[family-name:var(--font-mono)] text-[8.5px] m-0" style={{ color: "rgba(227,242,240,0.45)" }}>v1 · 347.8 KB</p>
                          </div>
                          <div className="w-px h-5" style={{ background: "rgba(255,255,255,0.06)" }} />
                          <div className="flex items-center gap-0.5">
                            <button className="w-5 h-5 rounded flex items-center justify-center bg-transparent border-none cursor-default" style={{ color: "rgba(227,242,240,0.55)" }}><ChevronLeft size={11} strokeWidth={2} /></button>
                            <span className="text-[10px] tabular-nums px-1" style={{ color: "rgba(227,242,240,0.7)" }}>1 / 3</span>
                            <button className="w-5 h-5 rounded flex items-center justify-center bg-transparent border-none cursor-default" style={{ color: "rgba(227,242,240,0.55)" }}><ChevronRight size={11} strokeWidth={2} /></button>
                          </div>
                          <div className="ml-auto flex items-center gap-0.5">
                            <button className="w-5 h-5 rounded flex items-center justify-center bg-transparent border-none cursor-default" style={{ color: "rgba(227,242,240,0.55)" }}><ZoomOut size={11} strokeWidth={2} /></button>
                            <span className="text-[10px] tabular-nums min-w-[28px] text-center" style={{ color: "rgba(227,242,240,0.55)" }}>72%</span>
                            <button className="w-5 h-5 rounded flex items-center justify-center bg-transparent border-none cursor-default" style={{ color: "rgba(227,242,240,0.55)" }}><ZoomIn size={11} strokeWidth={2} /></button>
                            <button className="w-5 h-5 rounded flex items-center justify-center bg-transparent border-none cursor-default" style={{ color: "rgba(227,242,240,0.55)" }}><RotateCw size={11} strokeWidth={2} /></button>
                            <button className="w-5 h-5 rounded flex items-center justify-center bg-transparent border-none cursor-default" style={{ color: "rgba(227,242,240,0.55)" }}><MoveHorizontal size={11} strokeWidth={2} /></button>
                            <button className="w-5 h-5 rounded flex items-center justify-center bg-transparent border-none cursor-default" style={{ color: "rgba(227,242,240,0.55)" }}><MoveVertical size={11} strokeWidth={2} /></button>
                            <div className="w-px h-4 mx-0.5" style={{ background: "rgba(255,255,255,0.06)" }} />
                            <button className="w-5 h-5 rounded flex items-center justify-center border-none cursor-default" style={{ background: `linear-gradient(180deg, ${ACCENT_2} 0%, ${ACCENT} 100%)`, color: "#fff" }}><FolderOpen size={11} strokeWidth={2.2} /></button>
                          </div>
                        </div>

                        {/* Canvas + Right panel */}
                        <div className="flex-1 flex min-h-0">
                          {/* Floor plan canvas */}
                          <div className="flex-1 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #0c1d1b 0%, #071312 100%)" }}>
                            <div className="absolute inset-0 opacity-25" style={{
                              backgroundImage: `linear-gradient(to right, rgba(43,165,158,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(43,165,158,0.15) 1px, transparent 1px)`,
                              backgroundSize: "16px 16px",
                            }} />
                            <svg viewBox="0 0 500 360" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
                              {/* AREAS table */}
                              <g transform="translate(18, 28)">
                                <rect x="0" y="0" width="82" height="88" fill="rgba(15,30,29,0.85)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6"/>
                                <text x="41" y="10" textAnchor="middle" fontSize="6.5" fontFamily="monospace" fill="rgba(233,246,244,0.85)" fontWeight="600">AREAS (Existente)</text>
                                <line x1="0" y1="14" x2="82" y2="14" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4"/>
                                <text x="5" y="22" fontSize="5" fontFamily="monospace" fill="rgba(233,246,244,0.55)">ID</text>
                                <text x="22" y="22" fontSize="5" fontFamily="monospace" fill="rgba(233,246,244,0.55)">NOMBRE</text>
                                <text x="60" y="22" fontSize="5" fontFamily="monospace" fill="rgba(233,246,244,0.55)">AREA</text>
                                <line x1="0" y1="25" x2="82" y2="25" stroke="rgba(255,255,255,0.15)" strokeWidth="0.3"/>
                                {[
                                  ["1", "HABITACION", "7.6 m²"],
                                  ["2", "HABITACION", "9.8 m²"],
                                  ["3", "HABITACION", "9.7 m²"],
                                  ["4", "COCINA", "10.0 m²"],
                                  ["5", "SALON", "13.7 m²"],
                                  ["6", "BAÑO", "3.3 m²"],
                                  ["7", "PATIO", "2.6 m²"],
                                  ["8", "PASILLO", "6.5 m²"],
                                ].map(([id, name, area], i) => (
                                  <g key={i}>
                                    <text x="5" y={32 + i * 7} fontSize="4.5" fontFamily="monospace" fill="rgba(233,246,244,0.5)">{id}</text>
                                    <text x="22" y={32 + i * 7} fontSize="4.5" fontFamily="monospace" fill="rgba(233,246,244,0.5)">{name}</text>
                                    <text x="60" y={32 + i * 7} fontSize="4.5" fontFamily="monospace" fill="rgba(233,246,244,0.5)">{area}</text>
                                  </g>
                                ))}
                              </g>

                              {/* Walls */}
                              <g stroke="rgba(233,246,244,0.82)" strokeWidth="2" fill="rgba(255,255,255,0.03)" strokeLinejoin="miter">
                                <path d="M 140 90 L 460 90 L 460 230 L 420 230 L 420 330 L 140 330 Z" />
                                <line x1="260" y1="90" x2="260" y2="180" />
                                <line x1="140" y1="180" x2="330" y2="180" />
                                <line x1="330" y1="90" x2="330" y2="180" />
                                <line x1="330" y1="180" x2="460" y2="180" />
                                <line x1="260" y1="180" x2="260" y2="330" />
                                <line x1="260" y1="230" x2="330" y2="230" />
                                <line x1="330" y1="230" x2="330" y2="330" />
                                <line x1="380" y1="180" x2="380" y2="230" />
                              </g>

                              {/* Room labels */}
                              <g fontFamily="sans-serif" textAnchor="middle">
                                <g fontSize="7.5" fontWeight="600" fill="rgba(233,246,244,0.88)">
                                  <text x="200" y="132">HABITACION</text>
                                  <text x="395" y="132">HABITACION</text>
                                  <text x="200" y="255">HABITACION</text>
                                  <text x="295" y="205">BAÑO</text>
                                  <text x="355" y="205">COCINA</text>
                                  <text x="440" y="205">PATIO</text>
                                  <text x="340" y="285">SALON</text>
                                </g>
                                <g fontSize="5" fill="rgba(233,246,244,0.48)" fontFamily="monospace">
                                  <text x="200" y="143">7.6 m² · H=2.44</text>
                                  <text x="395" y="143">9.8 m² · H=2.44</text>
                                  <text x="200" y="266">9.7 m² · H=2.44</text>
                                  <text x="295" y="215">3.3 m² · H=2.44</text>
                                  <text x="355" y="215">10.0 m² · H=2.44</text>
                                  <text x="440" y="215">2.6 m² · H=2.44</text>
                                  <text x="340" y="295">13.7 m² · H=2.44</text>
                                </g>
                              </g>

                              {/* Door arcs */}
                              <g stroke="rgba(233,246,244,0.45)" strokeWidth="0.6" fill="none" strokeDasharray="1.5 1.8">
                                <path d="M 240 90 A 18 18 0 0 1 260 110" />
                                <path d="M 160 180 A 18 18 0 0 0 180 198" />
                                <path d="M 305 180 A 15 15 0 0 1 320 195" />
                                <path d="M 360 180 A 15 15 0 0 0 375 195" />
                                <path d="M 240 180 A 15 15 0 0 0 255 195" />
                                <path d="M 240 330 A 16 16 0 0 1 256 314" />
                              </g>

                              {/* Red dimensions */}
                              <g stroke="#ef4444" strokeWidth="0.5" fill="#f87171" fontSize="6" fontFamily="sans-serif" fontWeight="500">
                                <line x1="140" y1="80" x2="460" y2="80" />
                                <line x1="140" y1="76" x2="140" y2="84" />
                                <line x1="260" y1="76" x2="260" y2="84" />
                                <line x1="330" y1="76" x2="330" y2="84" />
                                <line x1="460" y1="76" x2="460" y2="84" />
                                <text x="200" y="74" textAnchor="middle">3.38</text>
                                <text x="295" y="74" textAnchor="middle">0.44</text>
                                <text x="395" y="74" textAnchor="middle">4.26</text>
                                <line x1="470" y1="90" x2="470" y2="330" />
                                <line x1="466" y1="90" x2="474" y2="90" />
                                <line x1="466" y1="180" x2="474" y2="180" />
                                <line x1="466" y1="330" x2="474" y2="330" />
                                <text x="480" y="135" textAnchor="start">2.33</text>
                                <text x="480" y="255" textAnchor="start">2.10</text>
                              </g>

                              {/* Issue pin — BAÑO area */}
                              <g transform="translate(295, 200)">
                                <circle r="14" fill="#fbbf24" opacity="0.2" />
                                <circle r="10" fill="#f97316" opacity="0.35" />
                                <circle r="6" fill="#f97316" stroke="#fff" strokeWidth="1.5" />
                                <text x="0" y="2.5" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="800" fontFamily="sans-serif">!</text>
                              </g>

                              {/* Secondary blue crosshair */}
                              <g transform="translate(285, 218)" stroke="#3b82f6" strokeWidth="1" fill="none">
                                <circle r="5" />
                                <line x1="-7" y1="0" x2="7" y2="0" />
                                <line x1="0" y1="-7" x2="0" y2="7" />
                              </g>
                            </svg>
                          </div>

                          {/* Right Files panel */}
                          <div className="w-[160px] shrink-0 flex flex-col" style={{ borderLeft: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.2)" }}>
                            <div className="flex shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                              <button className="flex-1 py-1.5 text-[10px] font-semibold border-none cursor-default bg-transparent" style={{ color: ACCENT_2, borderBottom: `1.5px solid ${ACCENT_2}` }}>Files</button>
                              <button className="flex-1 py-1.5 text-[10px] font-medium border-none cursor-default bg-transparent" style={{ color: "rgba(227,242,240,0.5)" }}>Issues (1)</button>
                            </div>
                            <div className="flex-1 overflow-hidden p-1.5 flex flex-col gap-1.5">
                              <button className="w-full py-1.5 rounded text-[10px] font-medium flex items-center justify-center gap-1 border-none cursor-default" style={{ background: `rgba(43,165,158,0.1)`, color: ACCENT_2, border: `1px dashed rgba(43,165,158,0.3)` }}>
                                <Plus size={10} strokeWidth={2.2} /> Upload New Plan
                              </button>
                              <div className="p-1.5 rounded" style={{ background: `rgba(43,165,158,0.06)`, boxShadow: `inset 0 0 0 1px rgba(43,165,158,0.25)` }}>
                                <div className="flex items-start gap-1">
                                  <FileText size={10} style={{ color: ACCENT_2, marginTop: 1, flexShrink: 0 }} />
                                  <div className="min-w-0 flex-1">
                                    <p className="m-0 font-semibold truncate text-[10px]">CF_Av oporto 4_G&amp;H_V2</p>
                                    <p className="font-[family-name:var(--font-mono)] text-[8.5px] m-0 mt-0.5" style={{ color: ACCENT_2 }}>v1 · 347.8 KB</p>
                                    <p className="font-[family-name:var(--font-mono)] text-[8.5px] m-0" style={{ color: "rgba(227,242,240,0.4)" }}>17/4/2026</p>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-0.5">
                                <p className="font-[family-name:var(--font-mono)] text-[8.5px] tracking-[0.14em] uppercase m-0 mb-1" style={{ color: "rgba(227,242,240,0.45)" }}>VERSION HISTORY</p>
                                <div className="flex items-center gap-1 py-1 text-[10px]">
                                  <FileText size={9} style={{ color: "rgba(227,242,240,0.5)" }} />
                                  <span>v1</span>
                                  <span className="px-1 py-px rounded text-[8.5px] font-[family-name:var(--font-mono)]" style={{ background: `rgba(43,165,158,0.15)`, color: ACCENT_2, border: `1px solid rgba(43,165,158,0.3)` }}>Current</span>
                                </div>
                                <p className="font-[family-name:var(--font-mono)] text-[8.5px] m-0 pl-4" style={{ color: "rgba(227,242,240,0.4)" }}>347.8 KB</p>
                                <p className="font-[family-name:var(--font-mono)] text-[8.5px] m-0 pl-4" style={{ color: "rgba(227,242,240,0.4)" }}>17/4/2026, 19:42</p>
                              </div>
                              <p className="text-[9px] text-center m-0 mt-1" style={{ color: "rgba(227,242,240,0.35)" }}>No previous versions</p>
                              <div className="mt-auto text-center pt-1.5" style={{ borderTop: "1px dashed rgba(255,255,255,0.06)" }}>
                                <span className="ch-counter font-[family-name:var(--font-display)] font-bold text-[16px] tracking-tight text-white">0</span>
                                <span className="block text-[8px] tracking-[0.1em] uppercase" style={{ color: "rgba(227,242,240,0.5)" }}>Plans · Project Total</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ═════ BIM TAB ═════ */}
                      <div className="ch-tab-content absolute inset-0 flex flex-col" data-tab="bim">
                        <div className="flex-1 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #0a2322 0%, #051716 50%, #020e0d 100%)" }}>
                          <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
                            <g stroke="rgba(43,165,158,0.18)" strokeWidth="0.5">
                              {[...Array(9)].map((_, i) => (
                                <line key={`h${i}`} x1={40 + i*40} y1="230" x2={80 + i*30} y2="290" />
                              ))}
                              {[...Array(5)].map((_, i) => (
                                <line key={`v${i}`} x1="40" y1={230 + i*15} x2="360" y2={230 + i*15} />
                              ))}
                            </g>
                            <g stroke="rgba(43,165,158,0.85)" strokeWidth="1.2" fill="rgba(43,165,158,0.08)" strokeLinejoin="miter">
                              <path d="M 120 200 L 200 170 L 280 200 L 280 240 L 200 270 L 120 240 Z" />
                              <path d="M 120 130 L 200 100 L 280 130 L 280 170 L 200 200 L 120 170 Z" />
                              <line x1="120" y1="130" x2="120" y2="240" />
                              <line x1="200" y1="100" x2="200" y2="270" />
                              <line x1="280" y1="130" x2="280" y2="240" />
                            </g>
                            <g stroke="rgba(43,165,158,0.65)" strokeWidth="1" fill="rgba(43,165,158,0.05)" strokeDasharray="2 2">
                              <path d="M 150 110 L 200 90 L 250 110 L 250 135 L 200 155 L 150 135 Z" />
                              <line x1="150" y1="110" x2="150" y2="135" />
                              <line x1="200" y1="90" x2="200" y2="155" />
                              <line x1="250" y1="110" x2="250" y2="135" />
                            </g>
                            <g fill="rgba(43,165,158,0.3)" stroke="rgba(43,165,158,0.75)" strokeWidth="0.5">
                              <rect x="135" y="182" width="18" height="22" />
                              <rect x="170" y="182" width="18" height="22" />
                              <rect x="215" y="182" width="18" height="22" />
                              <rect x="248" y="182" width="18" height="22" />
                            </g>
                            <g transform="translate(30, 275)" fontSize="7" fontFamily="monospace">
                              <line x1="0" y1="0" x2="18" y2="0" stroke="#ef4444" strokeWidth="1"/>
                              <line x1="0" y1="0" x2="0" y2="-18" stroke="#22c55e" strokeWidth="1"/>
                              <line x1="0" y1="0" x2="-12" y2="-9" stroke="#3b82f6" strokeWidth="1"/>
                              <text x="20" y="3" fill="#ef4444">X</text>
                              <text x="-2" y="-20" fill="#22c55e">Z</text>
                              <text x="-18" y="-10" fill="#3b82f6">Y</text>
                            </g>
                          </svg>
                          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-md" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
                            <span className="font-[family-name:var(--font-mono)] text-[9px]" style={{ color: "rgba(227,242,240,0.75)" }}>Autodesk Fusion · connected</span>
                          </div>
                          <div className="absolute top-2 right-2 flex gap-1">
                            {[Link2, RefreshCw, Maximize].map((Icon, i) => (
                              <button key={i} className="w-7 h-7 rounded-md flex items-center justify-center border-none cursor-default" style={{
                                background: "rgba(0,0,0,0.3)",
                                backdropFilter: "blur(10px)",
                                WebkitBackdropFilter: "blur(10px)",
                                border: "1px solid rgba(255,255,255,0.18)",
                                color: "#fff",
                                boxShadow: "0 4px 10px -2px rgba(0,0,0,0.5)",
                              }}>
                                <Icon size={12} strokeWidth={1.8} />
                              </button>
                            ))}
                          </div>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center" style={{ border: "1px dashed rgba(255,255,255,0.25)" }}>
                            <div className="w-0.5 h-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.5)" }} />
                          </div>
                        </div>
                      </div>

                      {/* ═════ RECORRIDO (Virtual Tour) TAB ═════ */}
                      <div className="ch-tab-content absolute inset-0 flex flex-col" data-tab="tour">
                        <div className="flex-1 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #1a2826 0%, #0f1c1b 50%, #050e0d 100%)" }}>
                          <svg viewBox="0 0 500 300" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
                            <defs>
                              <radialGradient id="tourLight" cx="50%" cy="40%" r="60%">
                                <stop offset="0%" stopColor="rgba(233,246,244,0.18)" />
                                <stop offset="100%" stopColor="rgba(233,246,244,0)" />
                              </radialGradient>
                            </defs>
                            <g stroke="rgba(233,246,244,0.22)" strokeWidth="0.6">
                              <line x1="0" y1="300" x2="250" y2="160" />
                              <line x1="500" y1="300" x2="250" y2="160" />
                              <line x1="100" y1="300" x2="235" y2="170" />
                              <line x1="400" y1="300" x2="265" y2="170" />
                            </g>
                            <g fill="rgba(233,246,244,0.05)" stroke="rgba(233,246,244,0.3)" strokeWidth="0.8">
                              <polygon points="0,0 250,80 250,160 0,300" />
                              <polygon points="500,0 250,80 250,160 500,300" />
                            </g>
                            <g stroke="rgba(233,246,244,0.18)" strokeWidth="0.5">
                              <line x1="0" y1="0" x2="250" y2="80" />
                              <line x1="500" y1="0" x2="250" y2="80" />
                            </g>
                            <ellipse cx="250" cy="130" rx="180" ry="80" fill="url(#tourLight)" />
                            <g fill="rgba(43,165,158,0.18)" stroke="rgba(43,165,158,0.45)" strokeWidth="0.6">
                              <rect x="190" y="155" width="120" height="25" rx="2" />
                              <rect x="75" y="210" width="60" height="40" rx="2" />
                              <rect x="365" y="210" width="60" height="40" rx="2" />
                            </g>
                            <g transform="translate(250, 220)">
                              <circle r="11" fill="rgba(43,165,158,0.28)" />
                              <circle r="7" fill={ACCENT_2} stroke="#fff" strokeWidth="0.8" />
                              <path d="M -3 -3 L 3 0 L -3 3 Z" fill="#fff" />
                            </g>
                            <g transform="translate(90, 180)">
                              <circle r="7" fill="rgba(43,165,158,0.25)" />
                              <circle r="4" fill={ACCENT_2} stroke="#fff" strokeWidth="0.8" />
                            </g>
                            <g transform="translate(410, 175)">
                              <circle r="7" fill="rgba(43,165,158,0.25)" />
                              <circle r="4" fill={ACCENT_2} stroke="#fff" strokeWidth="0.8" />
                            </g>
                          </svg>
                          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-md" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.15)" }}>
                            <Eye size={10} strokeWidth={1.8} style={{ color: "#fff" }} />
                            <span className="text-[10px] font-medium" style={{ color: "#fff" }}>Salón · 360°</span>
                          </div>
                          <div className="absolute bottom-2 left-2 w-[60px] h-[60px] rounded" style={{ background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.18)", padding: 4 }}>
                            <svg viewBox="0 0 60 60" className="w-full h-full">
                              <rect x="6" y="10" width="48" height="40" stroke="rgba(255,255,255,0.4)" strokeWidth="0.7" fill="rgba(255,255,255,0.03)"/>
                              <line x1="30" y1="10" x2="30" y2="30" stroke="rgba(255,255,255,0.35)" strokeWidth="0.4"/>
                              <line x1="6" y1="30" x2="30" y2="30" stroke="rgba(255,255,255,0.35)" strokeWidth="0.4"/>
                              <circle cx="20" cy="40" r="2.5" fill={ACCENT_2}/>
                              <circle cx="20" cy="40" r="5" fill={ACCENT_2} opacity="0.3"/>
                            </svg>
                          </div>
                          <div className="absolute top-2 right-2 flex gap-1">
                            {[Link2, RefreshCw, Maximize].map((Icon, i) => (
                              <button key={i} className="w-7 h-7 rounded-md flex items-center justify-center border-none cursor-default" style={{
                                background: "rgba(0,0,0,0.3)",
                                backdropFilter: "blur(10px)",
                                WebkitBackdropFilter: "blur(10px)",
                                border: "1px solid rgba(255,255,255,0.18)",
                                color: "#fff",
                                boxShadow: "0 4px 10px -2px rgba(0,0,0,0.5)",
                              }}>
                                <Icon size={12} strokeWidth={1.8} />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* ═════ PARTES INTERESADAS (User admin) TAB ═════ */}
                      <div className="ch-tab-content absolute inset-0 flex flex-col" data-tab="stk">
                        <div className="flex-1 flex flex-col overflow-hidden">
                          <div className="flex items-center justify-between px-3 py-2 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                            <div>
                              <h5 className="text-xs font-semibold m-0">Project Team</h5>
                              <p className="font-[family-name:var(--font-mono)] text-[9px] m-0" style={{ color: "rgba(227,242,240,0.45)" }}>4 members · 1 pending invite</p>
                            </div>
                            <button className="px-2.5 py-1 rounded text-[10px] font-medium flex items-center gap-1 border-none cursor-default" style={{ background: `linear-gradient(180deg, ${ACCENT_2} 0%, ${ACCENT} 100%)`, color: "#fff", boxShadow: `0 2px 6px -1px rgba(43,165,158,0.4), 0 0 0 1px rgba(43,165,158,0.35)` }}>
                              <UserPlus size={10} strokeWidth={2} /> Invite
                            </button>
                          </div>
                          <div className="flex-1 overflow-hidden">
                            {[
                              { initials: "GB", name: "Guillermo Borras", email: "guillermo@arky.tech", role: "Admin", access: "Full access", teal: true, me: true },
                              { initials: "ML", name: "María López", email: "maria@lopezarch.es", role: "Architect", access: "Full access", teal: true },
                              { initials: "GC", name: "Grupo Construcción", email: "ops@gcsa.es", role: "Contractor", access: "Plans + Issues" },
                              { initials: "MR", name: "Miguel Ribera", email: "m.ribera@owner.com", role: "Client", access: "Tour + Dashboard" },
                              { initials: "II", name: "Ingeniería MEP", email: "mep@infra.es", role: "MEP", access: "Plans only", pending: true },
                            ].map((u, i) => (
                              <div key={i} className="flex items-center gap-2 px-3 py-2 text-[10px]" style={{ borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.04)" : undefined, background: u.me ? "rgba(43,165,158,0.06)" : undefined }}>
                                <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[9px] font-semibold" style={u.teal
                                  ? { background: ACCENT, color: "#fff", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)" }
                                  : { background: "rgba(255,255,255,0.06)", color: "#e9f6f4", border: "1px solid rgba(255,255,255,0.1)" }
                                }>
                                  {u.initials}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <p className="m-0 font-medium text-[10px] truncate">{u.name}</p>
                                    {u.me && <span className="px-1 py-px rounded text-[8px] font-[family-name:var(--font-mono)]" style={{ background: `rgba(43,165,158,0.15)`, color: ACCENT_2, border: `1px solid rgba(43,165,158,0.3)` }}>You</span>}
                                    {u.pending && <span className="px-1 py-px rounded text-[8px] font-[family-name:var(--font-mono)]" style={{ background: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.3)" }}>Pending</span>}
                                  </div>
                                  <p className="m-0 font-[family-name:var(--font-mono)] text-[8.5px] truncate" style={{ color: "rgba(227,242,240,0.45)" }}>{u.email}</p>
                                </div>
                                <div className="flex flex-col items-end shrink-0">
                                  <span className="text-[10px] font-medium whitespace-nowrap">{u.role}</span>
                                  <span className="font-[family-name:var(--font-mono)] text-[8px] whitespace-nowrap" style={{ color: "rgba(227,242,240,0.5)" }}>{u.access}</span>
                                </div>
                                <button className="w-6 h-6 rounded flex items-center justify-center border-none bg-transparent cursor-default" style={{ color: "rgba(227,242,240,0.4)" }}>
                                  <MoreVertical size={11} strokeWidth={1.8} />
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="shrink-0 px-3 py-2 flex items-center gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.2)" }}>
                            <Shield size={11} strokeWidth={1.8} style={{ color: ACCENT_2 }} />
                            <div className="min-w-0 flex-1">
                              <p className="m-0 text-[10px] font-medium">Share project settings</p>
                              <p className="m-0 font-[family-name:var(--font-mono)] text-[8.5px]" style={{ color: "rgba(227,242,240,0.45)" }}>Link access · permissions · export rules</p>
                            </div>
                            <button className="px-2 py-1 rounded text-[9px] font-medium border-none cursor-default" style={{ background: "rgba(255,255,255,0.06)", color: "#e9f6f4", border: "1px solid rgba(255,255,255,0.08)" }}>Configure</button>
                          </div>
                        </div>
                      </div>

                      {/* ═════ INCIDENCIAS (Issues) TAB ═════ */}
                      <div className="ch-tab-content absolute inset-0 flex flex-col" data-tab="issues">
                        <div className="flex-1 flex flex-col overflow-hidden">
                          <div className="flex items-center gap-1.5 px-2.5 py-1.5 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                            <div className="relative flex-1 max-w-[140px]">
                              <Search size={10} className="absolute left-1.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(227,242,240,0.45)" }} />
                              <div className="w-full text-[9px] rounded pl-5 pr-2 py-1" style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(227,242,240,0.45)" }}>Search issues…</div>
                            </div>
                            <div className="text-[9px] rounded px-2 py-1 flex items-center gap-1" style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(227,242,240,0.7)" }}>Status: All</div>
                            <div className="text-[9px] rounded px-2 py-1 flex items-center gap-1" style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(227,242,240,0.7)" }}>Type: All</div>
                            <div className="ml-auto flex gap-1">
                              <button className="w-6 h-6 rounded flex items-center justify-center border-none cursor-default bg-transparent" style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(227,242,240,0.55)" }}>
                                <MoreVertical size={10} strokeWidth={1.8} />
                              </button>
                              <button className="w-6 h-6 rounded flex items-center justify-center border-none cursor-default" style={{ background: `linear-gradient(180deg, ${ACCENT_2} 0%, ${ACCENT} 100%)`, color: "#fff" }}>
                                <Plus size={10} strokeWidth={2.2} />
                              </button>
                            </div>
                          </div>
                          <div className="grid items-center gap-2 px-3 py-1.5 shrink-0 font-[family-name:var(--font-mono)] text-[8.5px] tracking-[0.1em] uppercase" style={{ gridTemplateColumns: "10px 1fr 70px 70px 40px", color: "rgba(227,242,240,0.45)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                            <div></div>
                            <div>Title</div>
                            <div>Status</div>
                            <div>Assignee</div>
                            <div>Page</div>
                          </div>
                          <div className="flex-1 overflow-hidden">
                            {[
                              { color: "#f97316", title: "Waterproofing detail missing", type: "Clash", status: "Open", assignee: "GC", page: "1" },
                              { color: "#3b82f6", title: "Window schedule — dimensions off", type: "Design", status: "In Progress", assignee: "ML", page: "2" },
                              { color: "#a855f7", title: "Ceiling height discrepancy", type: "Coordination", status: "In Review", assignee: "II", page: "1" },
                              { color: "#f97316", title: "Door swing conflicts with column", type: "Clash", status: "Open", assignee: "GC", page: "3" },
                              { color: "#22c55e", title: "Emergency exit signage", type: "Safety", status: "Closed", assignee: "ML", page: "1" },
                            ].map((issue, i) => (
                              <div key={i} className="grid items-center gap-2 px-3 py-1.5 text-[10px]" style={{ gridTemplateColumns: "10px 1fr 70px 70px 40px", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.04)" : undefined }}>
                                <span className="w-1.5 h-1.5 rounded-full" style={{ background: issue.color, boxShadow: `0 0 0 2px ${issue.color}25` }} />
                                <div className="min-w-0">
                                  <p className="m-0 truncate">{issue.title}</p>
                                  <p className="m-0 font-[family-name:var(--font-mono)] text-[8px]" style={{ color: "rgba(227,242,240,0.45)" }}>{issue.type}</p>
                                </div>
                                <span className="text-[9px] font-medium whitespace-nowrap" style={{ color: issue.color }}>{issue.status}</span>
                                <div className="flex items-center gap-1">
                                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[7.5px] font-semibold" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>{issue.assignee}</span>
                                </div>
                                <span className="font-[family-name:var(--font-mono)] text-[9px]" style={{ color: ACCENT_2 }}>p.{issue.page}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>

            {/* Feature deck — left column alongside the iPad mockup */}
            <div
              className="ch-card-right absolute flex flex-col justify-center items-stretch gap-7 pointer-events-none"
              style={{
                left: "clamp(24px, 4vw, 80px)",
                top: "50%",
                transform: "translateY(-50%)",
                width: "min(36vw, 420px)",
                zIndex: 5,
              }}
            >
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

