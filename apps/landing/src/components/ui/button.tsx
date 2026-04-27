import Link from "next/link";
import { cn } from "@/lib/cn";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "default" | "lg" | "sm";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-clay-700 shadow-[0_2px_24px_-8px_rgba(181,132,90,0.6)]",
  secondary:
    "bg-[var(--color-accent)] text-[var(--color-accent-foreground)] hover:bg-sage-500",
  ghost: "text-foreground hover:bg-clay-200",
  outline:
    "border border-[var(--color-border)] text-foreground hover:bg-clay-200",
};

const sizeClasses: Record<Size, string> = {
  default: "h-11 px-6 text-[15px]",
  lg: "h-14 px-8 text-[16px]",
  sm: "h-9 px-4 text-[14px]",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay-600 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none";

type Common = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonAsLink = Common & {
  href: string;
} & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className">;

type ButtonAsButton = Common & {
  href?: undefined;
} & Omit<ComponentPropsWithoutRef<"button">, "className">;

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant = "primary", size = "default", className, children } = props;
  const cls = cn(base, variantClasses[variant], sizeClasses[size], className);

  if ("href" in props && props.href) {
    const { href, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
    void _v; void _s; void _c; void _ch;
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } = props as ButtonAsButton;
  void _v; void _s; void _c; void _ch;
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
