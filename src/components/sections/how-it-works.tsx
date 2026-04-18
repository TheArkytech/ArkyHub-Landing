"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { CTAButton } from "@/components/ui/cta-button";
import { Reveal } from "@/components/motion/reveal";
import { UserPlus, Upload, Share2 } from "lucide-react";

const ICONS = [UserPlus, Upload, Share2];

export function HowItWorks() {
  const t = useTranslations("home.howItWorks");
  const tCta = useTranslations("common.cta");
  const steps = t.raw("steps") as Array<{ title: string; body: string }>;

  return (
    <section
      id="how-it-works"
      className="border-t border-[var(--border)] bg-[var(--background)] py-24 sm:py-32"
    >
      <Container size="xl">
        {/* Header */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--text-accent)]">
            {t("eyebrow")}
          </p>
          <h2
            className="mt-5 font-[family-name:var(--font-display)] font-semibold tracking-[-0.03em] text-[var(--text-primary)]"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.25rem)",
              lineHeight: 1.05,
            }}
          >
            {t("headline")}
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
            {steps.map((s, i) => {
              const Icon = ICONS[i];
              const n = String(i + 1).padStart(2, "0");
              return (
                <Reveal key={n} delay={i * 0.1}>
                  <li className="relative list-none">
                    {/* Step number circle */}
                    <div className="relative mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--background)] md:mx-0">
                      <Icon
                        className="h-5 w-5 text-[var(--text-accent)]"
                        strokeWidth={1.75}
                      />
                    </div>
                    <p className="text-center font-mono text-[0.7rem] font-semibold tracking-[0.12em] text-[var(--text-muted)] md:text-left">
                      {t("step")} {n}
                    </p>
                    <h3 className="mt-2 text-center font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-[var(--text-primary)] md:text-left">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-center text-[0.95rem] leading-relaxed text-[var(--text-secondary)] md:text-left">
                      {s.body}
                    </p>
                  </li>
                </Reveal>
              );
            })}
          </ol>
        </div>

        {/* CTA under steps */}
        <Reveal className="mt-16 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <CTAButton href="#final-cta" variant="primary" size="md">
            {tCta("scheduleDemo")}
          </CTAButton>
          <a
            href="#features"
            className="text-sm font-medium text-[var(--text-accent)] underline-offset-4 transition-colors hover:underline"
          >
            {tCta("sampleProject")}
          </a>
        </Reveal>
      </Container>
    </section>
  );
}
