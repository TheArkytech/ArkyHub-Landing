"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div
      role="group"
      aria-label="Switch language"
      className={`inline-flex rounded-full border border-[var(--border)] p-0.5 ${
        isPending ? "opacity-60" : ""
      }`}
    >
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() =>
            startTransition(() => router.replace(pathname, { locale: loc }))
          }
          aria-pressed={locale === loc}
          disabled={isPending}
          className={`h-7 w-9 rounded-full font-mono text-[11px] font-medium uppercase transition-colors duration-[var(--duration-fast)] ${
            locale === loc
              ? "bg-[var(--text-primary)] text-[var(--background)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
          }`}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
