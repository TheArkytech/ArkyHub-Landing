import { Container } from "@/components/ui/container";
import { CTAButton } from "@/components/ui/cta-button";
import { Reveal } from "@/components/motion/reveal";
import { DEMO_URL } from "@/lib/config";
import { Check } from "lucide-react";

type Tier = {
  name: string;
  tagline: string;
  price: string;
  priceNote?: string;
  projects: string;
  features: string[];
  cta: { label: string; href: string };
  featured?: boolean;
};

const TIERS: Tier[] = [
  {
    name: "Solo",
    tagline: "For the architect testing the workflow.",
    price: "Free",
    priceNote: "forever",
    projects: "1 project",
    features: [
      "Unlimited stakeholders",
      "Plans, BIM models, virtual tours",
      "Version control on every file",
      "Issue tracking tied to drawings",
      "Browser-based — no installs",
      "Community support",
    ],
    cta: { label: "Get early access", href: DEMO_URL },
  },
  {
    name: "Studio",
    tagline: "For the practice running multiple projects in parallel.",
    price: "Early-adopter pricing",
    priceNote: "[PENDING — per seat / month]",
    projects: "Up to 5 projects",
    features: [
      "Everything in Solo",
      "Priority email support",
      "Custom workspace branding",
      "Expanded storage per project",
      "Onboarding session for your team",
    ],
    cta: { label: "Schedule a demo", href: DEMO_URL },
    featured: true,
  },
  {
    name: "Firm",
    tagline: "For firms with dozens of active projects at once.",
    price: "Custom",
    priceNote: "talk to us",
    projects: "Unlimited projects",
    features: [
      "Everything in Studio",
      "SSO and admin controls",
      "Role-based access policies",
      "Dedicated success manager",
      "SLA and security review",
      "API access",
    ],
    cta: { label: "Talk to us", href: DEMO_URL },
  },
];

export function Pricing() {
  return (
    <section
      id="pricing"
      className="border-t border-[var(--border)] bg-[var(--background)] py-24 sm:py-32"
    >
      <Container size="xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--text-accent)]">
            Pricing
          </p>
          <h2
            className="mt-5 font-[family-name:var(--font-display)] font-semibold tracking-[-0.03em] text-[var(--text-primary)]"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              lineHeight: 1.05,
            }}
          >
            Start free. Scale when you&apos;re ready.
          </h2>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-[var(--text-secondary)]">
            One project is free forever — genuinely, not a trial. When your
            practice outgrows one, the jump is simple.
          </p>
        </Reveal>

        {/* Tier grid */}
        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 items-stretch gap-5 md:grid-cols-3">
          {TIERS.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 0.08} className="h-full">
              <article
                className={
                  tier.featured
                    ? "relative flex h-full flex-col rounded-[var(--radius-xl)] border border-[var(--border-accent)] bg-[var(--surface-elevated)] p-8"
                    : "relative flex h-full flex-col rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-elevated)] p-8"
                }
                style={
                  tier.featured
                    ? {
                        boxShadow:
                          "0 0 0 1px color-mix(in oklab, var(--accent) 18%, transparent), 0 24px 64px -20px color-mix(in oklab, var(--accent) 28%, transparent)",
                      }
                    : undefined
                }
              >
                {tier.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-[var(--border-accent)] bg-[var(--surface-elevated)] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--text-accent)]">
                    Most popular
                  </span>
                )}

                {/* Tier name + tagline */}
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-[var(--text-primary)]">
                    {tier.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {tier.tagline}
                  </p>
                </div>

                {/* Price block */}
                <div className="mt-7 border-y border-[var(--border)] py-6">
                  <p
                    className="font-[family-name:var(--font-display)] font-semibold tracking-[-0.03em] text-[var(--text-primary)]"
                    style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)", lineHeight: 1 }}
                  >
                    {tier.price}
                  </p>
                  {tier.priceNote && (
                    <p className="mt-2 font-mono text-[0.7rem] text-[var(--text-muted)]">
                      {tier.priceNote}
                    </p>
                  )}
                  <p className="mt-4 text-sm font-medium text-[var(--text-accent)]">
                    {tier.projects}
                  </p>
                </div>

                {/* Features */}
                <ul className="mt-6 flex-1 space-y-3">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-[0.9rem] leading-relaxed text-[var(--text-secondary)]"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-[var(--text-accent)]"
                        strokeWidth={2}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="mt-8">
                  <CTAButton
                    href={tier.cta.href}
                    variant={tier.featured ? "primary" : "secondary"}
                    size="md"
                    className="w-full justify-center"
                  >
                    {tier.cta.label}
                  </CTAButton>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Small print */}
        <Reveal>
          <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-[var(--text-muted)]">
            All plans include unlimited stakeholders per project, no install, and
            browser-based BIM/tour viewers. Pricing may evolve before general
            availability — early adopters keep their rate.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
