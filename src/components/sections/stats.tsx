import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { ArrowRight } from "lucide-react";

/**
 * Founder-origin proof. The numbers on the right are real — they come
 * from the BIM management practice at our founder's prior firm, before
 * and after formalizing coordinated BIM workflows. The left anchor is
 * an industry stat for external context.
 *
 * This is not a customer testimonial. ArkyHub is pre-launch. These are
 * the numbers that convinced us to build it.
 */

const BEFORE = [
  { label: "Projects", value: "7", note: "over 2 years" },
  { label: "m² managed", value: "611" },
  { label: "Methodology", value: "AutoCAD 2D", small: true },
];

const AFTER = [
  { label: "Projects", value: "27", note: "over 2.25 years" },
  { label: "m² managed", value: "2,534" },
  { label: "Methodology", value: "Coordinated BIM", small: true },
];

export function Stats() {
  return (
    <section
      id="why-now"
      className="border-t border-[var(--border)] bg-[var(--surface)] py-24 sm:py-32"
    >
      <Container size="xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--text-accent)]">
            Why we&apos;re building this
          </p>
          <h2
            className="mt-5 font-[family-name:var(--font-display)] font-semibold tracking-[-0.03em] text-[var(--text-primary)]"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.25rem)",
              lineHeight: 1.05,
            }}
          >
            The numbers that convinced us.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-[1.0625rem] leading-relaxed text-[var(--text-secondary)]">
            The industry problem is well-documented. The harder question was
            whether organized BIM coordination actually moves the needle. We
            had reason to know it does.
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
                48%
              </p>
              <div className="flex-1">
                <p className="text-[1.0625rem] leading-relaxed text-[var(--text-primary)]">
                  of rework on U.S. construction sites is caused by poor
                  communication and bad project data.
                </p>
                <p className="mt-3 font-mono text-[0.7rem] text-[var(--text-muted)]">
                  — PlanGrid &amp; FMI, &ldquo;Construction Disconnected,&rdquo; 2018
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Founder's-prior-firm before/after */}
        <Reveal>
          <p className="mx-auto mt-16 max-w-2xl text-center text-sm text-[var(--text-muted)]">
            Then our founder joined a Madrid real estate development firm as BIM
            Manager. What happened over the next 27 months:
          </p>
        </Reveal>

        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 items-stretch gap-5 md:grid-cols-[1fr_auto_1fr]">
          {/* Before */}
          <Reveal className="h-full">
            <div className="flex h-full flex-col rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-elevated)] p-7">
              <div className="mb-5 flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--border-strong)]" />
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  Before · 2022–2023
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
                  After · 2024–2026
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
              In Q1 2026 alone, managed m² already exceeded the entire year
              of 2025.
            </span>{" "}
            <span className="font-medium">
              ArkyHub is the tool we wished existed during those 27 months.
            </span>
          </p>
          <p className="mx-auto mt-4 max-w-xl text-center font-mono text-[0.7rem] text-[var(--text-muted)]">
            — Internal data, founder&apos;s prior firm. Identifying details omitted
            by request.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
