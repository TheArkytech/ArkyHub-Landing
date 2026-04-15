"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("arkyhub-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("arkyhub-theme", "light");
    }
  }

  // Avoid hydration mismatch: render an inert placeholder until mounted.
  const showDarkIcon = mounted && isDark;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={showDarkIcon ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={showDarkIcon}
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] " +
          "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] " +
          "transition-colors duration-[var(--duration-base)] ease-[var(--ease-out)] " +
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
        className,
      )}
    >
      {/* Both icons stacked in the same position; one is always hidden via scale/rotate.
          This avoids layout shift and removes the absolute/static toggle. */}
      <Sun
        aria-hidden
        className={cn(
          "absolute h-4 w-4 transition-all duration-[var(--duration-base)] ease-[var(--ease-out)]",
          showDarkIcon ? "scale-0 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100",
        )}
      />
      <Moon
        aria-hidden
        className={cn(
          "absolute h-4 w-4 transition-all duration-[var(--duration-base)] ease-[var(--ease-out)]",
          showDarkIcon ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-90 opacity-0",
        )}
      />
    </button>
  );
}
