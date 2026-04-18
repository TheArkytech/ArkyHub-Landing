import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";

export function Guide() {
  const t = useTranslations("home.guide");

  return (
    <section className="border-t border-[var(--border)] bg-[var(--background)] py-24 sm:py-32">
      <Container size="lg">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">
          {/* Left: eyebrow + headline */}
          <Reveal className="lg:col-span-5">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--text-accent)]">
              {t("eyebrow")}
            </p>
            <h2
              className="mt-5 font-[family-name:var(--font-display)] font-semibold tracking-[-0.03em] text-[var(--text-primary)]"
              style={{
                fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)",
                lineHeight: 1.1,
              }}
            >
              {t("headline")}
            </h2>
          </Reveal>

          {/* Right: copy */}
          <Reveal delay={0.12} className="lg:col-span-7">
            <div className="space-y-6 text-[1.0625rem] leading-relaxed text-[var(--text-secondary)]">
              <p>{t("body1")}</p>
              <p>
                {t("body2Pre")}
                <span className="font-medium text-[var(--text-primary)]">
                  {t("body2Brand")}
                </span>
                {t("body2Post")}
              </p>
            </div>

            {/* Credentials strip */}
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-[var(--border)] pt-6">
              {[
                t("credentials.architectLed"),
                t("credentials.aecNative"),
                t("credentials.builtInEurope"),
              ].map((label) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-xs text-[var(--text-muted)]"
                >
                  <span className="inline-block h-1 w-1 rounded-full bg-[var(--accent)]" />
                  <span className="font-medium uppercase tracking-[0.1em]">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
