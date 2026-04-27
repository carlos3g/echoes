import type { Dictionary } from "@/dictionaries";

type Props = {
  dict: Dictionary;
};

export function Manifesto({ dict }: Props) {
  return (
    <section
      id="manifesto"
      className="relative border-y border-clay-200/60 bg-clay-50"
    >
      <div className="mx-auto max-w-4xl px-6 py-28 text-center md:py-36">
        <div className="mb-8 flex justify-center text-[11px] uppercase tracking-[0.22em] text-clay-700">
          <span className="flex items-center gap-3">
            <span className="h-px w-8 bg-clay-600" />
            {dict.manifesto.label}
            <span className="h-px w-8 bg-clay-600" />
          </span>
        </div>
        <h2 className="font-serif text-4xl leading-[1.15] tracking-tight md:text-6xl">
          {dict.manifesto.title}
        </h2>
        <p className="mx-auto mt-10 max-w-2xl text-lg leading-relaxed text-muted">
          {dict.manifesto.body}
        </p>
      </div>
    </section>
  );
}
