import { cn } from "@/lib/utils";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-[var(--radius-md)] " +
  "transition-[background-color,box-shadow,transform,border-color,color] duration-[var(--duration-base)] ease-[var(--ease-out)] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] " +
  "active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-[3.25rem] px-7 text-base",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--accent)] text-[var(--accent-foreground)] " +
    "hover:bg-[var(--accent-hover)] hover:shadow-[var(--shadow-glow)] " +
    "active:bg-[var(--accent-pressed)]",
  secondary:
    "bg-transparent text-[var(--text-primary)] border border-[var(--border-strong)] " +
    "hover:bg-[var(--surface-elevated)] hover:border-[var(--text-muted)]",
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

type LinkProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };

export function CTAButton(props: LinkProps | ButtonProps) {
  const { variant = "primary", size = "lg", className, ...rest } = props;
  const cls = cn(base, sizes[size], variants[variant], className);

  if ("href" in rest && rest.href) {
    return <a className={cls} {...(rest as LinkProps)} />;
  }
  return <button className={cls} {...(rest as ButtonProps)} />;
}
