import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { GitCommit, Box, Compass, Users } from "lucide-react";
import type { ReactNode } from "react";

const FEATURES = [
  {
    icon: GitCommit,
    title: "Issues tied to the exact plan version",
    body: "When someone flags a problem, it points at the specific drawing version — not floating in a chat thread that gets lost by Friday.",
    visual: <PlanVersionVisual />,
  },
  {
    icon: Box,
    title: "BIM models, viewable in any browser",
    body: "No software install. No license fee. The contractor opens the model on a tablet on-site. The client opens it from their living room.",
    visual: <BIMVisual />,
  },
  {
    icon: Compass,
    title: "Virtual walkthroughs inside the project",
    body: "The tour lives next to the plans, not in a separate link buried in an email from three weeks ago.",
    visual: <TourVisual />,
  },
  {
    icon: Users,
    title: "Each stakeholder sees only what they need",
    body: "Contractors get plans. Clients get the dashboard. Your team manages the rest. One workspace, the right view for everyone.",
    visual: <RolesVisual />,
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="border-t border-[var(--border)] bg-[var(--surface)] py-24 sm:py-32"
    >
      <Container size="xl">
        {/* Header */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--text-accent)]">
            What&apos;s different
          </p>
          <h2
            className="mt-5 font-[family-name:var(--font-display)] font-semibold tracking-[-0.03em] text-[var(--text-primary)]"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.25rem)",
              lineHeight: 1.05,
            }}
          >
            Four things the patchwork can&apos;t do.
          </h2>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-[var(--text-secondary)]">
            Each one is a problem we watched architecture firms solve manually,
            week after week.
          </p>
        </Reveal>

        {/* 2x2 grid */}
        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-2">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 2) * 0.08} className="h-full">
              <article className="group relative h-full overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-elevated)] p-8 transition-colors duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-[var(--border-strong)]">
                {/* Visual area */}
                <div className="mb-7 h-40 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
                  {f.visual}
                </div>
                {/* Icon badge */}
                <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text-accent)]">
                  <f.icon className="h-4 w-4" strokeWidth={1.75} />
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--text-primary)]">
                  {f.title}
                </h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--text-secondary)]">
                  {f.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------------- Visuals — pure CSS, on-brand ---------------- */

function PlanVersionVisual() {
  // Stacked version cards with the latest one highlighted, mono version tags
  return (
    <div className="relative h-full p-5">
      <div className="flex h-full flex-col justify-end gap-1.5">
        {[
          { v: "v05", label: "Floor plan — L0", muted: true },
          { v: "v06", label: "Floor plan — L0", muted: true },
          { v: "v07", label: "Floor plan — L0", current: true },
        ].map((row, i) => (
          <div
            key={row.v}
            className={
              row.current
                ? "flex items-center gap-3 rounded-md border border-[var(--border-accent)] bg-[color-mix(in_oklab,var(--accent)_8%,transparent)] px-3 py-2"
                : "flex items-center gap-3 rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 opacity-60"
            }
            style={{ marginLeft: `${i * 12}px` }}
          >
            <span
              className={
                row.current
                  ? "font-mono text-[0.7rem] font-semibold text-[var(--text-accent)]"
                  : "font-mono text-[0.7rem] text-[var(--text-muted)]"
              }
            >
              {row.v}
            </span>
            <span className="text-[0.7rem] text-[var(--text-secondary)]">
              {row.label}
            </span>
            {row.current && (
              <span className="ml-auto text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-[var(--text-accent)]">
                Current
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function BIMVisual() {
  // Isometric wireframe cube — pure SVG
  return (
    <div className="relative flex h-full items-center justify-center">
      {/* Hairline grid floor */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 60%, black 30%, transparent 80%)",
        }}
      />
      <svg
        viewBox="0 0 200 140"
        className="relative h-28 w-auto text-[var(--text-accent)]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      >
        {/* Building isometric */}
        <path d="M40 90 L100 60 L160 90 L100 120 Z" />
        <path d="M40 90 L40 50 L100 20 L100 60" />
        <path d="M160 90 L160 50 L100 20" />
        <path d="M100 60 L100 120" strokeDasharray="2 3" />
        <path d="M40 50 L100 80 L160 50" strokeDasharray="2 3" />
        {/* Top vertex pulse dot */}
        <circle cx="100" cy="20" r="2.5" fill="currentColor" stroke="none" />
      </svg>
    </div>
  );
}

function TourVisual() {
  // 3D viewport corner with crosshair, suggesting a virtual walkthrough
  return (
    <div className="relative flex h-full items-center justify-center">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 60%)",
        }}
      />
      <div className="relative flex flex-col items-center gap-3">
        <div className="relative h-16 w-16 rounded-full border border-[var(--border-accent)]">
          <div className="absolute inset-2 rounded-full border border-[var(--border-strong)]" />
          <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)]" />
        </div>
        <div className="flex gap-1 font-mono text-[0.6rem] text-[var(--text-muted)]">
          <span>x: 12.4</span>
          <span>·</span>
          <span>y: 8.1</span>
          <span>·</span>
          <span>z: 2.6</span>
        </div>
      </div>
    </div>
  );
}

function RolesVisual() {
  // Three role chips with different scopes
  const ROLES: Array<{ label: string; access: ReactNode }> = [
    {
      label: "Architect",
      access: (
        <>
          <Dot on /> <Dot on /> <Dot on /> <Dot on />
        </>
      ),
    },
    {
      label: "Contractor",
      access: (
        <>
          <Dot on /> <Dot on /> <Dot /> <Dot />
        </>
      ),
    },
    {
      label: "Client",
      access: (
        <>
          <Dot on /> <Dot /> <Dot /> <Dot />
        </>
      ),
    },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-2 p-5">
      {ROLES.map((r) => (
        <div
          key={r.label}
          className="flex items-center justify-between rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2"
        >
          <span className="text-[0.75rem] font-medium text-[var(--text-primary)]">
            {r.label}
          </span>
          <div className="flex gap-1">{r.access}</div>
        </div>
      ))}
    </div>
  );
}

function Dot({ on }: { on?: boolean }) {
  return (
    <span
      className={
        on
          ? "inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
          : "inline-block h-1.5 w-1.5 rounded-full bg-[var(--border-strong)]"
      }
    />
  );
}
