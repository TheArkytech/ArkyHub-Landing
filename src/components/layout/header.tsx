"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { CTAButton } from "@/components/ui/cta-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LocaleSwitcher } from "@/components/ui/locale-switcher";
import { DEMO_URL } from "@/lib/config";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const tNav = useTranslations("nav");
  const tCta = useTranslations("common.cta");

  const NAV_LINKS = [
    { label: tNav("product"), href: "#features" },
    { label: tNav("howItWorks"), href: "#how-it-works" },
    { label: tNav("whyNow"), href: "#why-now" },
    { label: tNav("pricing"), href: "#pricing" },
    { label: tNav("faq"), href: "#faq" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-[var(--duration-base)] ease-[var(--ease-out)]",
        scrolled
          ? "border-b border-[var(--border)] backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent",
      )}
      style={{
        backgroundColor: scrolled
          ? "color-mix(in oklab, var(--background) 72%, transparent)"
          : "transparent",
      }}
    >
      <Container size="xl">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2 font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--text-primary)]"
          >
            <LogoMark />
            <span>ArkyHub</span>
          </a>

          {/* Center nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--text-primary)]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <ThemeToggle />
            <CTAButton href={DEMO_URL} variant="primary" size="md">
              {tCta("scheduleDemo")}
            </CTAButton>
          </div>
        </div>
      </Container>
    </header>
  );
}

function LogoMark() {
  // Hairline geometric mark — two stacked rectangles offset, evoking layered plans.
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3.5" y="3.5" width="13" height="13" rx="2" stroke="var(--text-primary)" />
      <rect
        x="7.5"
        y="7.5"
        width="13"
        height="13"
        rx="2"
        stroke="var(--accent)"
      />
    </svg>
  );
}
