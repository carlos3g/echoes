import Link from "next/link";
import type { Dictionary, Locale } from "@/dictionaries";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Wordmark } from "@/components/ui/wordmark";

type Props = {
  lang: Locale;
  dict: Dictionary;
};

export function Header({ lang, dict }: Props) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-clay-200/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href={`/${lang}`} className="text-foreground">
          <Wordmark />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <NavLink href="#manifesto">{dict.nav.manifesto}</NavLink>
          <NavLink href="#features">{dict.nav.features}</NavLink>
          <NavLink href="#folders">{dict.nav.folders}</NavLink>
        </nav>
        <div className="flex items-center gap-5">
          <LanguageSwitcher current={lang} />
          <Link
            href="#download"
            className="hidden md:inline-flex items-center justify-center h-9 rounded-full bg-stone-ink text-white px-4 text-sm font-medium hover:bg-stone-ink/90 transition-colors"
          >
            {dict.nav.download}
          </Link>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-sm text-muted hover:text-foreground transition-colors"
    >
      {children}
    </a>
  );
}
