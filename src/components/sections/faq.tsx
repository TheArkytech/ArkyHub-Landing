"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { Plus } from "lucide-react";

export function FAQ() {
  const t = useTranslations("home.faq");
  const items = t.raw("items") as Array<{ q: string; a: string }>;

  return (
    <section
      id="faq"
      className="border-t border-[var(--border)] bg-[var(--surface)] py-24 sm:py-32"
    >
      <Container size="md">
        <Reveal className="text-center">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--text-accent)]">
            {t("eyebrow")}
          </p>
          <h2
            className="mt-5 font-[family-name:var(--font-display)] font-semibold tracking-[-0.03em] text-[var(--text-primary)]"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              lineHeight: 1.05,
            }}
          >
            {t("headline")}
          </h2>
        </Reveal>

        <Reveal className="mx-auto mt-14 max-w-3xl divide-y divide-[var(--border)] rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-elevated)]">
          {items.map((item, i) => (
            <details
              key={item.q}
              className="group [&_summary::-webkit-details-marker]:hidden"
              {...(i === 0 ? { open: true } : {})}
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 px-6 py-5 transition-colors hover:bg-[var(--surface)] sm:px-8">
                <h3 className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--text-primary)] sm:text-lg">
                  {item.q}
                </h3>
                <Plus
                  className="mt-0.5 h-5 w-5 shrink-0 text-[var(--text-muted)] transition-colors duration-[var(--duration-fast)] group-open:text-[var(--text-accent)]"
                  strokeWidth={1.5}
                />
              </summary>
              <div className="px-6 pb-6 pr-12 text-[0.95rem] leading-relaxed text-[var(--text-secondary)] sm:px-8 sm:pr-16">
                {item.a}
              </div>
            </details>
          ))}
        </Reveal>

        <Reveal>
          <p className="mx-auto mt-10 max-w-md text-center text-sm text-[var(--text-muted)]">
            {t("ctaPre")}
            <a
              href="#final-cta"
              className="font-medium text-[var(--text-accent)] underline-offset-4 hover:underline"
            >
              {t("ctaLink")}
            </a>
            {t("ctaPost")}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
