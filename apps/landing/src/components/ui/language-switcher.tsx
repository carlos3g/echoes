import Link from "next/link";
import type { Locale } from "@/dictionaries";

type Props = {
  current: Locale;
};

export function LanguageSwitcher({ current }: Props) {
  const other: Locale = current === "pt" ? "en" : "pt";
  return (
    <Link
      href={`/${other}`}
      className="text-[11px] uppercase tracking-[0.2em] text-muted hover:text-foreground transition-colors"
    >
      <span className="text-foreground font-medium">{current.toUpperCase()}</span>
      <span className="mx-1.5 opacity-30">/</span>
      <span>{other.toUpperCase()}</span>
    </Link>
  );
}
