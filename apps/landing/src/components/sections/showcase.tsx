import type { Dictionary } from "@/dictionaries";
import { PhoneMockup } from "@/components/ui/phone-mockup";

type Props = {
  dict: Dictionary;
};

export function Showcase({ dict }: Props) {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 py-28 md:py-36">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="space-y-6 order-2 lg:order-1">
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-sage-500">
              <span className="h-px w-8 bg-sage-400" />
              {dict.showcase.label}
            </div>
            <h2 className="font-serif text-4xl leading-[1.1] tracking-tight md:text-5xl">
              {dict.showcase.title}
            </h2>
            <p className="text-lg leading-relaxed text-muted max-w-lg">
              {dict.showcase.subtitle}
            </p>
            <div className="grid grid-cols-2 gap-4 pt-6 max-w-sm">
              <Detail label="Hermes" value="JS engine" />
              <Detail label="Skia" value="Canvas" />
              <Detail label="MMKV" value="Storage" />
              <Detail label="React Native" value="Native UI" />
            </div>
          </div>
          <div className="order-1 lg:order-2 flex justify-center gap-4">
            <div className="w-[260px]">
              <PhoneMockup
                src="/app-shots/03-folders-tab.png"
                alt="Echoes folders screen"
                className="rotate-[-4deg]"
              />
            </div>
            <div className="hidden md:block w-[260px]">
              <PhoneMockup
                src="/app-shots/05-profile.png"
                alt="Echoes profile screen"
                className="translate-y-12 rotate-[4deg]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-clay-200 pt-3">
      <div className="font-serif text-xl">{label}</div>
      <div className="text-xs uppercase tracking-widest text-muted mt-1">
        {value}
      </div>
    </div>
  );
}
