import { Container } from "@/components/ui/container";
import { CTAButton } from "@/components/ui/cta-button";
import { Reveal } from "@/components/motion/reveal";
import { DEMO_URL } from "@/lib/config";
import { X, Check } from "lucide-react";

const COMPARISON = [
  {
    without: "You spend Tuesday morning searching for the latest plan.",
    withIt: "The latest plan is the only plan anyone can see.",
  },
  {
    without: "Your contractor calls — they built from a previous version.",
    withIt: "Your contractor only ever sees the approved version.",
  },
  {
    without:
      "Your client emails: \u201Cany update?\u201D You don\u2019t have a fast answer.",
    withIt:
      "Your client opens the dashboard. They have their answer before they email.",
  },
  {
    without:
      "Issues live in a WhatsApp group nobody scrolls back through.",
    withIt:
      "Every issue points to the exact drawing version it came from.",
  },
  {
    without: "Your team manages files.",
    withIt: "Your team designs buildings.",
  },
];

export function FinalCTA() {
  return (
    <section
      id="final-cta"
      className="relative overflow-hidden border-t border-[var(--border)] bg-[var(--background)] py-24 sm:py-32"
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[60%]"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 100%, color-mix(in oklab, var(--accent) 18%, transparent), transparent 70%)",
        }}
      />
      <Container size="xl">
        {/* Header */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--text-accent)]">
            Two versions of your next project
          </p>
          <h2
            className="mt-5 font-[family-name:var(--font-display)] font-semibold tracking-[-0.03em] text-[var(--text-primary)]"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.25rem)",
              lineHeight: 1.05,
            }}
          >
            The same project. Two different weeks.
          </h2>
        </Reveal>

        {/* Comparison */}
        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
          {/* Without */}
          <Reveal className="h-full">
            <div className="h-full rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-7">
            <div className="mb-6 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-elevated)] text-[var(--text-muted)]">
                <X className="h-3.5 w-3.5" strokeWidth={2} />
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                Without ArkyHub
              </span>
            </div>
            <ul className="space-y-4">
              {COMPARISON.map((row) => (
                <li
                  key={row.without}
                  className="text-[0.95rem] leading-relaxed text-[var(--text-secondary)]"
                >
                  {row.without}
                </li>
              ))}
            </ul>
            </div>
          </Reveal>

          {/* With */}
          <Reveal delay={0.12} className="h-full">
            <div
              className="h-full rounded-[var(--radius-xl)] border border-[var(--border-accent)] bg-[var(--surface-elevated)] p-7"
              style={{
                boxShadow:
                  "0 0 0 1px color-mix(in oklab, var(--accent) 18%, transparent), 0 24px 64px -20px color-mix(in oklab, var(--accent) 30%, transparent)",
              }}
            >
            <div className="mb-6 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-foreground)]">
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-accent)]">
                With ArkyHub
              </span>
            </div>
            <ul className="space-y-4">
              {COMPARISON.map((row) => (
                <li
                  key={row.withIt}
                  className="text-[0.95rem] leading-relaxed text-[var(--text-primary)]"
                >
                  {row.withIt}
                </li>
              ))}
            </ul>
            </div>
          </Reveal>
        </div>

        {/* Closing block */}
        <Reveal className="mx-auto mt-20 max-w-3xl text-center">
          <h3
            className="font-[family-name:var(--font-display)] font-semibold tracking-[-0.03em] text-[var(--text-primary)]"
            style={{
              fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)",
              lineHeight: 1.15,
            }}
          >
            One workspace. Every document. Every stakeholder.{" "}
            <span className="text-[var(--text-accent)]">Always current.</span>
          </h3>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CTAButton href={DEMO_URL} variant="primary" size="lg">
              Schedule a Demo
            </CTAButton>
            <CTAButton href="#how-it-works" variant="secondary" size="lg">
              See How It Works
            </CTAButton>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
