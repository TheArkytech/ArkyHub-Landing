"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { ArrowRight } from "lucide-react";

export function Stats() {
  const t = useTranslations("home.stats");

  const BEFORE = [
    { label: t("before.projects"), value: t("before.projectsValue"), note: t("before.projectsNote") },
    { label: t("before.sqm"), value: t("before.sqmValue") },
    { label: t("before.methodology"), value: t("before.methodValue"), small: true },
  ];

  const AFTER = [
    { label: t("after.projects"), value: t("after.projectsValue"), note: t("after.projectsNote") },
    { label: t("after.sqm"), value: t("after.sqmValue") },
    { label: t("after.methodology"), value: t("after.methodValue"), small: true },
  ];

  return (
    <section
      id="why-now"
      className="border-t border-[var(--border)] bg-[var(--surface)] py-24 sm:py-32"
    >
      <Container size="xl">
        <Reveal className="mx-auto max-w-3xl text-center">
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
          <p className="mx-auto mt-6 max-w-2xl text-balance text-[1.0625rem] leading-relaxed text-[var(--text-secondary)]">
            {t("subhead")}
          </p>
        </Reveal>

        {/* Industry anchor stat */}
        <Reveal className="mx-auto mt-14 max-w-3xl">
          <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-elevated)] p-8 sm:p-10">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-8">
              <p
                className="font-[family-name:var(--font-display)] font-semibold tracking-[-0.04em] text-[var(--text-primary)]"
                style={{
                  fontSize: "clamp(2.5rem, 4.5vw, 3.75rem)",
                  lineHeight: 1,
                }}
              >
                {t("industryStat.value")}
              </p>
              <div className="flex-1">
                <p className="text-[1.0625rem] leading-relaxed text-[var(--text-primary)]">
                  {t("industryStat.text")}
                </p>
                <p className="mt-3 font-mono text-[0.7rem] text-[var(--text-muted)]">
                  {t("industryStat.citation")}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Founder's-prior-firm before/after */}
        <Reveal>
          <p className="mx-auto mt-16 max-w-2xl text-center text-sm text-[var(--text-muted)]">
            {t("founderIntro")}
          </p>
        </Reveal>

        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 items-stretch gap-5 md:grid-cols-[1fr_auto_1fr]">
          {/* Before */}
          <Reveal className="h-full">
            <div className="flex h-full flex-col rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-elevated)] p-7">
              <div className="mb-5 flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--border-strong)]" />
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  {t("before.label")}
                </span>
              </div>
              <dl className="space-y-5">
                {BEFORE.map((row) => (
                  <div key={row.label}>
                    <dt className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                      {row.label}
                    </dt>
                    <dd
                      className={
                        row.small
                          ? "mt-1 font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--text-secondary)]"
                          : "mt-1 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-[-0.03em] text-[var(--text-secondary)] sm:text-4xl"
                      }
                    >
                      {row.value}
                      {row.note && (
                        <span className="ml-2 align-middle text-[0.55em] font-normal text-[var(--text-muted)]">
                          {row.note}
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          {/* Arrow — hidden on mobile, shown on md+ */}
          <div className="hidden items-center justify-center md:flex">
            <div
              aria-hidden
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-accent)] bg-[color-mix(in_oklab,var(--accent)_8%,transparent)]"
            >
              <ArrowRight
                className="h-5 w-5 text-[var(--text-accent)]"
                strokeWidth={1.75}
              />
            </div>
          </div>

          {/* After */}
          <Reveal delay={0.12} className="h-full">
            <div
              className="flex h-full flex-col rounded-[var(--radius-xl)] border border-[var(--border-accent)] bg-[var(--surface-elevated)] p-7"
              style={{
                boxShadow:
                  "0 0 0 1px color-mix(in oklab, var(--accent) 15%, transparent), 0 16px 48px -16px color-mix(in oklab, var(--accent) 25%, transparent)",
              }}
            >
              <div className="mb-5 flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--text-accent)]">
                  {t("after.label")}
                </span>
              </div>
              <dl className="space-y-5">
                {AFTER.map((row) => (
                  <div key={row.label}>
                    <dt className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                      {row.label}
                    </dt>
                    <dd
                      className={
                        row.small
                          ? "mt-1 font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--text-primary)]"
                          : "mt-1 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] sm:text-4xl"
                      }
                    >
                      {row.value}
                      {row.note && (
                        <span className="ml-2 align-middle text-[0.55em] font-normal text-[var(--text-muted)]">
                          {row.note}
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>

        {/* Closing block */}
        <Reveal>
          <p className="mx-auto mt-14 max-w-2xl text-center text-[1.0625rem] leading-relaxed text-[var(--text-primary)]">
            <span className="text-[var(--text-secondary)]">
              {t("closing.highlight")}
            </span>{" "}
            <span className="font-medium">
              {t("closing.bold")}
            </span>
          </p>
          <p className="mx-auto mt-4 max-w-xl text-center font-mono text-[0.7rem] text-[var(--text-muted)]">
            {t("attribution")}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
