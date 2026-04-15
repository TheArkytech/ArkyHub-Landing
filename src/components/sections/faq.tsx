import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { Plus } from "lucide-react";

const FAQS = [
  {
    q: "Do contractors need to install anything?",
    a: "No. ArkyHub runs entirely in the browser — including the BIM viewer. Your contractor opens a link, sees the latest plan. That's it.",
  },
  {
    q: "How is this different from Google Drive?",
    a: "Drive stores files. ArkyHub knows what they are. Plans get version control. Issues get tied to the exact drawing. BIM and virtual tours render natively. Each stakeholder gets a different view.",
  },
  {
    q: "How is it different from Procore or Autodesk Construction Cloud?",
    a: "Those are built for contractors and run by contractors. ArkyHub is built for the architect — you control the documentation, you decide what each stakeholder sees.",
  },
  {
    q: "What file formats do you support?",
    a: "Plans in DWG and PDF. BIM models in IFC and RVT. Virtual tours via standard panoramic formats. If your workflow depends on a specific export pipeline, schedule a demo and we'll confirm the fit.",
  },
  {
    q: "Is my client data isolated from my other projects?",
    a: "Yes. Each firm — and each project within a firm — is fully separated. Working with multiple clients never means data leaks between them.",
  },
  {
    q: "How much does it cost?",
    a: "We're rolling out access with early-adopter pricing. Schedule a demo and we'll walk you through what fits your firm size.",
  },
];

export function FAQ() {
  return (
    <section
      id="faq"
      className="border-t border-[var(--border)] bg-[var(--surface)] py-24 sm:py-32"
    >
      <Container size="md">
        <Reveal className="text-center">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--text-accent)]">
            Questions
          </p>
          <h2
            className="mt-5 font-[family-name:var(--font-display)] font-semibold tracking-[-0.03em] text-[var(--text-primary)]"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              lineHeight: 1.05,
            }}
          >
            What architects ask before signing up.
          </h2>
        </Reveal>

        <Reveal className="mx-auto mt-14 max-w-3xl divide-y divide-[var(--border)] rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-elevated)]">
          {FAQS.map((item, i) => (
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
          Have a question we didn&apos;t answer?{" "}
          <a
            href="#final-cta"
            className="font-medium text-[var(--text-accent)] underline-offset-4 hover:underline"
          >
            Schedule a demo
          </a>{" "}
          and ask us live.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
