import type { Dictionary } from "@/dictionaries";
import { FolderCard } from "@/components/ui/folder-card";

type Props = {
  dict: Dictionary;
};

const hues: Array<"clay" | "sage" | "ink" | "cream"> = [
  "clay",
  "cream",
  "sage",
  "ink",
  "cream",
  "clay",
];

export function Folders({ dict }: Props) {
  return (
    <section id="folders" className="relative bg-clay-50 border-y border-clay-200/60">
      <div className="mx-auto max-w-6xl px-6 py-28 md:py-36">
        <div className="mb-14 max-w-2xl">
          <div className="mb-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-clay-700">
            <span className="h-px w-8 bg-clay-600" />
            {dict.folders.label}
          </div>
          <h2 className="font-serif text-4xl leading-[1.1] tracking-tight md:text-5xl mb-6">
            {dict.folders.title}
          </h2>
          <p className="text-lg leading-relaxed text-muted">
            {dict.folders.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {dict.folders.samples.map((sample, i) => (
            <FolderCard
              key={i}
              title={sample.title}
              author={sample.author}
              count={sample.count}
              hue={hues[i % hues.length]}
              className={
                i === 1 ? "md:translate-y-8" : i === 4 ? "md:translate-y-8" : ""
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
