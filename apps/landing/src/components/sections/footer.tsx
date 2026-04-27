import type { Dictionary, Locale } from "@/dictionaries";
import { Wordmark } from "@/components/ui/wordmark";

type Props = {
  lang: Locale;
  dict: Dictionary;
};

export function Footer({ lang, dict }: Props) {
  void lang;
  return (
    <footer className="relative">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Wordmark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              {dict.footer.tagline}
            </p>
          </div>
          <FooterColumn title={dict.footer.product}>
            <FooterLink href="#features">{dict.footer.links.features}</FooterLink>
            <FooterLink href="#folders">{dict.footer.links.folders}</FooterLink>
            <FooterLink href="#download">{dict.footer.links.download}</FooterLink>
          </FooterColumn>
          <FooterColumn title={dict.footer.company}>
            <FooterLink href="#">{dict.footer.links.about}</FooterLink>
            <FooterLink href="#">{dict.footer.links.blog}</FooterLink>
            <FooterLink href="#">{dict.footer.links.contact}</FooterLink>
          </FooterColumn>
          <FooterColumn title={dict.footer.legal}>
            <FooterLink href="#">{dict.footer.links.privacy}</FooterLink>
            <FooterLink href="#">{dict.footer.links.terms}</FooterLink>
          </FooterColumn>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-clay-200 pt-8 text-xs text-muted md:flex-row md:items-center">
          <span>{dict.footer.rights}</span>
          <span className="font-serif italic text-clay-700">
            {dict.footer.madeWith}
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="mb-4 text-[11px] uppercase tracking-[0.18em] text-clay-700">
        {title}
      </h4>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <a
        href={href}
        className="text-sm text-muted hover:text-foreground transition-colors"
      >
        {children}
      </a>
    </li>
  );
}
