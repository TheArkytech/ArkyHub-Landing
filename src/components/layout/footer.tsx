import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";

export function Footer() {
  const t = useTranslations("footer");

  const COLS = [
    {
      title: t("colProduct"),
      links: [
        { label: t("features"), href: "#features" },
        { label: t("howItWorks"), href: "#how-it-works" },
        { label: t("faq"), href: "#faq" },
      ],
    },
    {
      title: t("colCompany"),
      links: [
        { label: t("aboutArkytech"), href: "#" },
        { label: t("contact"), href: "#" },
      ],
    },
    {
      title: t("colResources"),
      links: [
        { label: t("documentation"), href: "#" },
        { label: t("privacy"), href: "#" },
        { label: t("terms"), href: "#" },
      ],
    },
  ];

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background)] py-16">
      <Container size="xl">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
          {/* Brand col */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--text-primary)]">
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden fill="none" strokeWidth="1.5">
                <rect x="3.5" y="3.5" width="13" height="13" rx="2" stroke="var(--text-primary)" />
                <rect x="7.5" y="7.5" width="13" height="13" rx="2" stroke="var(--accent)" />
              </svg>
              ArkyHub
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--text-secondary)]">
              {t("tagline")}
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-[var(--border)] pt-8 text-xs text-[var(--text-muted)] sm:flex-row sm:items-center">
          <p>{t("copyright")}</p>
          <p className="font-mono">{t("version")}</p>
        </div>
      </Container>
    </footer>
  );
}
