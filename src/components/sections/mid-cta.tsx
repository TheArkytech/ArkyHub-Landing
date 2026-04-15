import { Container } from "@/components/ui/container";
import { CTAButton } from "@/components/ui/cta-button";
import { Reveal } from "@/components/motion/reveal";
import { DEMO_URL } from "@/lib/config";

export function MidCTA() {
  return (
    <section className="relative overflow-hidden border-t border-[var(--border)] bg-[var(--background)] py-24 sm:py-32">
      {/* Subtle teal radial */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 50%, color-mix(in oklab, var(--accent) 10%, transparent), transparent 70%)",
        }}
      />
      <Container size="md">
        <Reveal className="text-center">
          <h2
            className="mx-auto max-w-3xl font-[family-name:var(--font-display)] font-semibold tracking-[-0.03em] text-[var(--text-primary)]"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              lineHeight: 1.1,
            }}
          >
            You&apos;ve seen what it costs to wait.
            <br />
            <span className="text-[var(--text-accent)]">
              See what it looks like to stop.
            </span>
          </h2>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CTAButton href={DEMO_URL} variant="primary" size="lg">
              See it in 20 minutes
            </CTAButton>
            <CTAButton href="#pricing" variant="secondary" size="lg">
              View pricing
            </CTAButton>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
