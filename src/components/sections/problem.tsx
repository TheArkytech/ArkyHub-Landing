import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { GitBranch, MessageCircleQuestion, Hourglass } from "lucide-react";

const PILLARS = [
  {
    icon: GitBranch,
    title: "Version chaos",
    body: "A contractor builds from an old drawing. Rework that costs thousands and delays weeks.",
  },
  {
    icon: MessageCircleQuestion,
    title: "The status question",
    body: "A client asks \u201Chow's my project going?\u201D \u2014 and you can't answer in less than an hour.",
  },
  {
    icon: Hourglass,
    title: "The hidden tax",
    body: "Your team spends more time managing files than designing buildings.",
  },
];

export function Problem() {
  return (
    <section
      id="problem"
      className="relative border-t border-[var(--border)] bg-[var(--surface)] py-24 sm:py-32"
    >
      <Container size="xl">
        {/* Eyebrow */}
        <Reveal className="text-center">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--text-accent)]">
            The patchwork problem
          </p>
          <h2
            className="mx-auto mt-5 max-w-3xl font-[family-name:var(--font-display)] font-semibold tracking-[-0.03em] text-[var(--text-primary)]"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.25rem)",
              lineHeight: 1.05,
            }}
          >
            Your project lives in seven tools.
            <br />
            <span className="text-[var(--text-secondary)]">
              None of them talk to each other.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-[var(--text-secondary)]">
            Email threads. Cloud drives. WhatsApp groups. WeTransfer links. A
            folder called{" "}
            <code className="rounded bg-[var(--surface-elevated)] px-1.5 py-0.5 font-mono text-[0.85em] text-[var(--text-accent)]">
              Plan_v3_FINAL_revised2.pdf
            </code>
            . The work gets done — but at a cost nobody is measuring.
          </p>
        </Reveal>

        {/* Pillars grid */}
        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08} className="h-full">
              <article className="group relative h-full rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-elevated)] p-7 transition-colors duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-[var(--border-strong)]">
                <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text-accent)]">
                  <p.icon className="h-4 w-4" strokeWidth={1.75} />
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--text-primary)]">
                  {p.title}
                </h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--text-secondary)]">
                  {p.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Closing italic */}
        <Reveal className="mx-auto mt-20 max-w-2xl text-center">
          <div
            aria-hidden
            className="mx-auto mb-6 h-px w-12 bg-[var(--border-strong)]"
          />
          <blockquote
            className="font-[family-name:var(--font-display)] text-xl italic leading-snug text-[var(--text-primary)] sm:text-2xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            &ldquo;It shouldn&apos;t take more effort to find a document than to
            create it.&rdquo;
          </blockquote>
        </Reveal>
      </Container>
    </section>
  );
}
