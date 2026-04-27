import type { Dictionary } from "@/dictionaries";
import { StoreBadge } from "@/components/ui/store-badge";

type Props = {
  dict: Dictionary;
  iosUrl: string;
  androidUrl: string;
};

export function CTA({ dict, iosUrl, androidUrl }: Props) {
  return (
    <section id="download" className="relative bg-clay-50 border-y border-clay-200/60">
      <div className="mx-auto max-w-4xl px-6 py-28 text-center md:py-36">
        <h2 className="font-serif text-4xl leading-[1.1] tracking-tight md:text-6xl">
          {dict.cta.title}
        </h2>
        <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-muted">
          {dict.cta.subtitle}
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <StoreBadge store="ios" href={iosUrl} label={dict.cta.ios} />
          <StoreBadge store="android" href={androidUrl} label={dict.cta.android} />
        </div>
      </div>
    </section>
  );
}
