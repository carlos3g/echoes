import type { Dictionary } from "@/dictionaries";

type Props = {
  dict: Dictionary;
};

export function Stats({ dict }: Props) {
  return (
    <section className="relative bg-stone-ink text-white">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <Stat value="12k+" label={dict.stats.quotes} />
          <Stat value="3.4k" label={dict.stats.folders} />
          <Stat value="1.8k" label={dict.stats.users} />
          <Stat value="2" label={dict.stats.languages} />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-serif text-5xl text-clay-300 md:text-6xl">{value}</div>
      <div className="mt-3 text-[11px] uppercase tracking-[0.2em] text-white/60">
        {label}
      </div>
    </div>
  );
}
