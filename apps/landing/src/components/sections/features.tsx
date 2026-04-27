import type { Dictionary } from "@/dictionaries";

type Props = {
  dict: Dictionary;
};

const icons = [
  // Discover
  <svg key="discover" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
    <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>,
  // Collect
  <svg key="collect" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <path d="M5 3v18l7-4 7 4V3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>,
  // Collaborate
  <svg key="collab" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="17" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5M14 19c0-2 1.5-3.5 3.5-3.5S21 17 21 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>,
  // Share
  <svg key="share" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="18" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="18" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="m8 11 8-4M8 13l8 4" stroke="currentColor" strokeWidth="1.5" />
  </svg>,
  // Follow
  <svg key="follow" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="m18 5 1.5 1.5L22 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  // Discover again
  <svg key="trend" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <path d="M3 17c4-1 6-5 9-5s5 4 9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M17 7h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="m21 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>,
];

export function Features({ dict }: Props) {
  return (
    <section id="features" className="relative">
      <div className="mx-auto max-w-6xl px-6 py-28 md:py-36">
        <div className="max-w-2xl mb-16">
          <div className="mb-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-clay-700">
            <span className="h-px w-8 bg-clay-600" />
            {dict.features.label}
          </div>
          <h2 className="font-serif text-4xl leading-[1.1] tracking-tight md:text-5xl">
            {dict.features.title}
          </h2>
        </div>

        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {dict.features.items.map((item, i) => (
            <div key={i} className="group">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-clay-100 text-clay-700 transition-colors group-hover:bg-clay-600 group-hover:text-white">
                {icons[i]}
              </div>
              <h3 className="font-serif text-2xl mb-2">{item.title}</h3>
              <p className="text-[15px] leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
