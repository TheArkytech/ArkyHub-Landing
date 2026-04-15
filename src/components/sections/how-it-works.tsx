import { Container } from "@/components/ui/container";
import { CTAButton } from "@/components/ui/cta-button";
import { Reveal } from "@/components/motion/reveal";
import { UserPlus, Upload, Share2 } from "lucide-react";

const STEPS = [
  {
    n: "01",
    icon: UserPlus,
    title: "Create your account",
    body: "Set up your firm in minutes. No IT involvement. No procurement cycle.",
  },
  {
    n: "02",
    icon: Upload,
    title: "Upload your first project",
    body: "Drop in your plans (DWG or PDF), BIM models, and virtual tours. Versioning starts the moment you upload.",
  },
  {
    n: "03",
    icon: Share2,
    title: "Invite your team and stakeholders",
    body: "Each person sees exactly what they need — your team, your contractors, your clients. Nothing more, nothing less.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-t border-[var(--border)] bg-[var(--background)] py-24 sm:py-32"
    >
      <Container size="xl">
        {/* Header */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--text-accent)]">
            The plan
          </p>
          <h2
            className="mt-5 font-[family-name:var(--font-display)] font-semibold tracking-[-0.03em] text-[var(--text-primary)]"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.25rem)",
              lineHeight: 1.05,
            }}
          >
            Three steps. You can be running by lunch.
          </h2>
        </Reveal>

        {/* Steps */}
        <div className="relative mx-auto mt-16 max-w-5xl">
          {/* Connector line (desktop only) */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-[var(--border-strong)] to-transparent md:block"
          />

          <ol className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.1}>
                <li className="relative list-none">
                  {/* Step number circle */}
                  <div className="relative mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--background)] md:mx-0">
                    <s.icon
                      className="h-5 w-5 text-[var(--text-accent)]"
                      strokeWidth={1.75}
                    />
                  </div>
                  <p className="text-center font-mono text-[0.7rem] font-semibold tracking-[0.12em] text-[var(--text-muted)] md:text-left">
                    STEP {s.n}
                  </p>
                  <h3 className="mt-2 text-center font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-[var(--text-primary)] md:text-left">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-center text-[0.95rem] leading-relaxed text-[var(--text-secondary)] md:text-left">
                    {s.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>

        {/* CTA under steps */}
        <Reveal className="mt-16 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <CTAButton href="#final-cta" variant="primary" size="md">
            Schedule a Demo
          </CTAButton>
          <a
            href="#features"
            className="text-sm font-medium text-[var(--text-accent)] underline-offset-4 transition-colors hover:underline"
          >
            See a sample project →
          </a>
        </Reveal>
      </Container>
    </section>
  );
}
