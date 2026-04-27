import type { Dictionary } from "@/dictionaries";
import { Button } from "@/components/ui/button";
import { PhoneMockup } from "@/components/ui/phone-mockup";

type Props = {
  dict: Dictionary;
};

export function Hero({ dict }: Props) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-clay-300/40 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-sage-200/40 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-clay-700">
              <span className="h-px w-8 bg-clay-600" />
              {dict.hero.eyebrow}
            </div>
            <h1 className="font-serif text-5xl leading-[1.05] tracking-tight md:text-7xl lg:text-[5.5rem]">
              {dict.hero.title}
              <br />
              <span className="italic text-clay-700">
                {dict.hero.titleAccent}
              </span>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted">
              {dict.hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button href="#download" size="lg">
                {dict.hero.ctaPrimary}
              </Button>
              <Button href="#download" size="lg" variant="outline">
                {dict.hero.ctaSecondary}
              </Button>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-[280px]">
              <div
                aria-hidden
                className="absolute -top-6 -left-8 h-24 w-24 rounded-full bg-clay-600/10"
              />
              <div
                aria-hidden
                className="absolute -bottom-8 -right-6 h-20 w-20 rounded-full bg-sage-300/30"
              />
              <PhoneMockup
                src="/app-shots/01-explore.png"
                alt="Echoes explore screen"
                priority
                className="animate-float-slow"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
