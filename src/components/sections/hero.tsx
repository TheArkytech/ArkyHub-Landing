"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CTAButton } from "@/components/ui/cta-button";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { Layers, FileText, Users, Eye, Box, MapPin } from "lucide-react";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-20">
      {/* Ambient teal radial */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 70%)",
        }}
      />
      {/* Hairline grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] dark:opacity-[0.25]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, black 40%, transparent 80%)",
        }}
      />

      <HeroTitle />
    </section>
  );
}

/**
 * Casa Ribera tilting card. Split out of `Hero` so the chaos-to-order
 * `<Problem />` animation can sit between the headline and the product
 * mockup — the narrative now runs title → chaos → order → product.
 */
export function ProjectCard() {
  return (
    <section className="relative overflow-hidden">
      <ContainerScroll titleComponent={null}>
        <BrowserMockup />
      </ContainerScroll>
    </section>
  );
}

function HeroTitle() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-3xl px-6"
    >
      {/* Eyebrow */}
      <motion.div
        variants={item}
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-1.5"
      >
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
          The first product from Arkytech
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        variants={item}
        className="font-[family-name:var(--font-display)] font-semibold tracking-[-0.04em] text-[var(--text-primary)]"
        style={{
          fontSize: "clamp(2.75rem, 6vw, 5rem)",
          lineHeight: 0.98,
        }}
      >
        Your architecture projects,
        <br />
        <span className="text-[var(--text-accent)]">in one place.</span>
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        variants={item}
        className="mx-auto mt-7 max-w-2xl text-balance text-lg leading-relaxed text-[var(--text-secondary)]"
      >
        The patchwork of email, Drive, and WhatsApp wasn&apos;t built for
        architects. ArkyHub is. Centralize every plan, BIM model, and virtual
        tour in one workspace — with version control and the right access for
        every stakeholder.
      </motion.p>

      {/* CTAs */}
      <motion.div
        variants={item}
        className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
      >
        <CTAButton href="#final-cta" variant="primary" size="lg">
          Schedule a Demo
        </CTAButton>
        <CTAButton href="#how-it-works" variant="secondary" size="lg">
          See How It Works
        </CTAButton>
      </motion.div>

    </motion.div>
  );
}

type TabKey = "Plans" | "BIM" | "Tour" | "Stakeholders";

const TABS: Array<{ key: TabKey; icon: typeof FileText }> = [
  { key: "Plans", icon: FileText },
  { key: "BIM", icon: Box },
  { key: "Tour", icon: Eye },
  { key: "Stakeholders", icon: Users },
];

function BrowserMockup() {
  const [activeTab, setActiveTab] = useState<TabKey>("Plans");

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--border-strong)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--border-strong)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--border-strong)]" />
        </div>
        <div className="flex h-6 flex-1 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--background)] px-3">
          <span className="font-mono text-[0.7rem] text-[var(--text-muted)]">
            arkyhub.app/projects/casa-ribera
          </span>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-12 gap-0">
        <div className="col-span-3 border-r border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
            Projects
          </p>
          <ul className="space-y-1">
            {[
              { name: "Casa Ribera", active: true },
              { name: "Edificio Marítimo", active: false },
              { name: "Estudio Soler", active: false },
              { name: "Vivienda Olivos", active: false },
            ].map((p) => (
              <li
                key={p.name}
                className={
                  p.active
                    ? "flex items-center gap-2 rounded-md bg-[var(--surface-elevated)] px-2.5 py-1.5 text-xs font-medium text-[var(--text-primary)]"
                    : "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-[var(--text-secondary)]"
                }
              >
                <span
                  className={
                    p.active
                      ? "h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
                      : "h-1.5 w-1.5 rounded-full bg-[var(--border-strong)]"
                  }
                />
                {p.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-9 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="font-[family-name:var(--font-display)] text-[0.95rem] font-semibold text-[var(--text-primary)]">
                Casa Ribera
              </p>
              <p className="font-mono text-[0.65rem] text-[var(--text-muted)]">
                Last updated · 2h ago by María L.
              </p>
            </div>
            <span className="rounded-full border border-[var(--border-accent)] bg-[color-mix(in_oklab,var(--accent)_8%,transparent)] px-2.5 py-1 text-[0.65rem] font-medium text-[var(--text-accent)]">
              In progress
            </span>
          </div>

          {/* Tabs — interactive */}
          <div
            role="tablist"
            aria-label="Project views"
            className="mb-4 flex gap-1 border-b border-[var(--border)]"
          >
            {TABS.map((t) => {
              const active = t.key === activeTab;
              return (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`panel-${t.key}`}
                  onClick={() => setActiveTab(t.key)}
                  className={
                    active
                      ? "relative flex items-center gap-1.5 border-b-2 border-[var(--accent)] px-3 py-2 text-xs font-medium text-[var(--text-primary)] transition-colors"
                      : "relative flex items-center gap-1.5 border-b-2 border-transparent px-3 py-2 text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--text-secondary)]"
                  }
                >
                  <t.icon className="h-3 w-3" />
                  {t.key}
                </button>
              );
            })}
          </div>

          {/* Panel — fixed min-height keeps the mockup from jumping on switch */}
          <div className="relative min-h-[148px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                id={`panel-${activeTab}`}
                role="tabpanel"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
              >
                {activeTab === "Plans" && <PlansPanel />}
                {activeTab === "BIM" && <BIMPanel />}
                {activeTab === "Tour" && <TourPanel />}
                {activeTab === "Stakeholders" && <StakeholdersPanel />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Tab panels ---------- */

function PlansPanel() {
  const PLANS = [
    { name: "Floor plan — Level 0", v: "v07" },
    { name: "Floor plan — Level 1", v: "v04" },
    { name: "Section A-A", v: "v02" },
  ];
  return (
    <div className="grid grid-cols-3 gap-3">
      {PLANS.map((p) => (
        <div
          key={p.name}
          className="overflow-hidden rounded-md border border-[var(--border)] bg-[var(--surface-elevated)]"
        >
          <div className="relative h-20 bg-[var(--surface)]">
            <div
              aria-hidden
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  "linear-gradient(var(--border-strong) 1px, transparent 1px), linear-gradient(90deg, var(--border-strong) 1px, transparent 1px)",
                backgroundSize: "12px 12px",
              }}
            />
            <Layers className="absolute right-2 top-2 h-3.5 w-3.5 text-[var(--text-muted)]" />
          </div>
          <div className="flex items-center justify-between px-2.5 py-2">
            <p className="truncate text-[0.7rem] font-medium text-[var(--text-primary)]">
              {p.name}
            </p>
            <span className="font-mono text-[0.65rem] text-[var(--text-accent)]">
              {p.v}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function BIMPanel() {
  return (
    <div className="flex flex-col gap-3">
      {/* Isometric viewport */}
      <div className="relative h-24 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--surface)]">
        <div
          aria-hidden
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(var(--border-strong) 1px, transparent 1px), linear-gradient(90deg, var(--border-strong) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
            maskImage:
              "radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 85%)",
          }}
        />
        <svg
          viewBox="0 0 220 100"
          className="absolute inset-0 mx-auto h-full w-full text-[var(--text-accent)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinejoin="round"
        >
          <path d="M60 75 L110 50 L160 75 L110 95 Z" />
          <path d="M60 75 L60 45 L110 20 L110 50" />
          <path d="M160 75 L160 45 L110 20" />
          <path d="M110 50 L110 95" strokeDasharray="2 3" />
          <path d="M60 45 L110 62 L160 45" strokeDasharray="2 3" />
          <circle cx="110" cy="20" r="2" fill="currentColor" stroke="none" />
        </svg>
        <span className="absolute bottom-2 left-2 font-mono text-[0.6rem] text-[var(--text-muted)]">
          IFC · 42.6 MB · browser-native viewer
        </span>
      </div>

      {/* Model file list */}
      <div className="space-y-1.5">
        {[
          { name: "Casa Ribera — Architectural", fmt: "RVT", size: "24.1 MB" },
          { name: "Casa Ribera — Structural", fmt: "IFC", size: "12.8 MB" },
          { name: "Casa Ribera — MEP", fmt: "IFC", size: "5.7 MB" },
        ].map((m) => (
          <div
            key={m.name}
            className="flex items-center justify-between rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] px-2.5 py-1.5"
          >
            <div className="flex items-center gap-2">
              <Box className="h-3 w-3 text-[var(--text-accent)]" strokeWidth={1.75} />
              <span className="text-[0.7rem] font-medium text-[var(--text-primary)]">
                {m.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-px font-mono text-[0.6rem] text-[var(--text-accent)]">
                {m.fmt}
              </span>
              <span className="font-mono text-[0.6rem] text-[var(--text-muted)]">
                {m.size}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TourPanel() {
  const WAYPOINTS = [
    { label: "Entrance", x: 18, y: 62 },
    { label: "Living", x: 42, y: 44 },
    { label: "Kitchen", x: 62, y: 38 },
    { label: "Terrace", x: 82, y: 60 },
  ];
  return (
    <div className="flex flex-col gap-3">
      {/* Panoramic / floorplan viewport with waypoints */}
      <div className="relative h-24 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--surface)]">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 30% 40%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 60%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(var(--border-strong) 1px, transparent 1px), linear-gradient(90deg, var(--border-strong) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        />
        {/* Waypoints */}
        {WAYPOINTS.map((w, i) => (
          <span
            key={w.label}
            className="absolute flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border-accent)] bg-[var(--surface-elevated)]"
            style={{ left: `${w.x}%`, top: `${w.y}%` }}
          >
            <span
              className={
                i === 1
                  ? "h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
                  : "h-1.5 w-1.5 rounded-full bg-[var(--border-strong)]"
              }
            />
          </span>
        ))}
        {/* Path hint */}
        <svg
          aria-hidden
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M 18 62 Q 30 50 42 44 T 62 38 T 82 60"
            fill="none"
            stroke="color-mix(in oklab, var(--accent) 40%, transparent)"
            strokeWidth="0.4"
            strokeDasharray="1.2 1.2"
          />
        </svg>
        <span className="absolute bottom-2 left-2 font-mono text-[0.6rem] text-[var(--text-muted)]">
          4 waypoints · 360° panoramic
        </span>
      </div>

      {/* Waypoint chips */}
      <div className="flex flex-wrap gap-1.5">
        {WAYPOINTS.map((w, i) => (
          <span
            key={w.label}
            className={
              i === 1
                ? "inline-flex items-center gap-1.5 rounded-full border border-[var(--border-accent)] bg-[color-mix(in_oklab,var(--accent)_8%,transparent)] px-2.5 py-1 text-[0.65rem] font-medium text-[var(--text-accent)]"
                : "inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-2.5 py-1 text-[0.65rem] text-[var(--text-secondary)]"
            }
          >
            <MapPin className="h-2.5 w-2.5" strokeWidth={2} />
            {w.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function StakeholdersPanel() {
  const PEOPLE = [
    {
      role: "Architect",
      name: "María López · project lead",
      scope: "Full access",
      dots: 4,
    },
    {
      role: "Contractor",
      name: "García & Cia",
      scope: "Plans + Issues",
      dots: 2,
    },
    {
      role: "Client",
      name: "M. Ribera",
      scope: "Dashboard + Tour",
      dots: 2,
    },
    {
      role: "MEP consultant",
      name: "Ibérica Ingeniería",
      scope: "Plans only",
      dots: 1,
    },
  ];
  return (
    <div className="space-y-1.5">
      {PEOPLE.map((p) => (
        <div
          key={p.role}
          className="flex items-center justify-between rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] px-2.5 py-1.5"
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] font-mono text-[0.6rem] text-[var(--text-accent)]">
              {p.role[0]}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[0.7rem] font-medium text-[var(--text-primary)]">
                {p.role}
              </p>
              <p className="truncate font-mono text-[0.6rem] text-[var(--text-muted)]">
                {p.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-[0.65rem] text-[var(--text-secondary)] sm:inline">
              {p.scope}
            </span>
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={
                    i < p.dots
                      ? "h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
                      : "h-1.5 w-1.5 rounded-full bg-[var(--border-strong)]"
                  }
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
