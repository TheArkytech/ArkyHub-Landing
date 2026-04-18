"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { CTAButton } from "@/components/ui/cta-button";
import { Reveal } from "@/components/motion/reveal";
import { DEMO_URL } from "@/lib/config";
import { X, Check } from "lucide-react";

type ComparisonRow = { without: string; with: string };

export function FinalCTA() {
  const t = useTranslations("home.finalCta");
  const tCta = useTranslations("common.cta");
  const comparison = t.raw("comparison") as ComparisonRow[];

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
                {t("withoutLabel")}
              </span>
            </div>
            <ul className="space-y-4">
              {comparison.map((row) => (
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
                {t("withLabel")}
              </span>
            </div>
            <ul className="space-y-4">
              {comparison.map((row) => (
                <li
                  key={row.with}
                  className="text-[0.95rem] leading-relaxed text-[var(--text-primary)]"
                >
                  {row.with}
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
            {t("closingPre")}
            <span className="text-[var(--text-accent)]">{t("closingAccent")}</span>
          </h3>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CTAButton href={DEMO_URL} variant="primary" size="lg">
              {tCta("scheduleDemo")}
            </CTAButton>
            <CTAButton href="#how-it-works" variant="secondary" size="lg">
              {tCta("seeHowItWorks")}
            </CTAButton>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
