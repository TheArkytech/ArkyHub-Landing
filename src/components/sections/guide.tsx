import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";

export function Guide() {
  return (
    <section className="border-t border-[var(--border)] bg-[var(--background)] py-24 sm:py-32">
      <Container size="lg">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">
          {/* Left: eyebrow + headline */}
          <Reveal className="lg:col-span-5">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--text-accent)]">
              Built by architects, for architects
            </p>
            <h2
              className="mt-5 font-[family-name:var(--font-display)] font-semibold tracking-[-0.03em] text-[var(--text-primary)]"
              style={{
                fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)",
                lineHeight: 1.1,
              }}
            >
              We know the moment you stopped trusting your folder structure.
            </h2>
          </Reveal>

          {/* Right: copy */}
          <Reveal delay={0.12} className="lg:col-span-7">
            <div className="space-y-6 text-[1.0625rem] leading-relaxed text-[var(--text-secondary)]">
              <p>
                We know what it&apos;s like to search for the right version of a
                drawing while a client waits on the line. We know how it feels
                to discover the contractor built from a previous version.
              </p>
              <p>
                ArkyHub is the first product from{" "}
                <span className="font-medium text-[var(--text-primary)]">
                  Arkytech
                </span>
                {" "}— a company built to digitalize the AEC sector. It
                wasn&apos;t adapted from construction management software or
                repurposed from a generic file drive. It was built around how
                architecture firms actually work.
              </p>
            </div>

            {/* Credentials strip */}
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-[var(--border)] pt-6">
              {[
                "Architect-led design",
                "AEC-native data model",
                "Built in Europe",
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
