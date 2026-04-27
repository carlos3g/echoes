import Link from "next/link";

type Props = {
  store: "ios" | "android";
  href: string;
  label: string;
};

export function StoreBadge({ store, href, label }: Props) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-3 rounded-2xl bg-stone-ink px-5 py-3 text-white transition-all hover:bg-stone-ink/90 hover:scale-[1.02]"
    >
      <span className="flex h-7 w-7 items-center justify-center">
        {store === "ios" ? <AppleIcon /> : <PlayIcon />}
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-widest opacity-70">
          {store === "ios" ? "Download on the" : "Get it on"}
        </span>
        <span className="font-serif text-lg italic">{label}</span>
      </span>
    </Link>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
      <path d="M16.365 1.43c0 1.14-.45 2.21-1.18 3.04-.78.91-2.05 1.62-3.13 1.54-.13-1.1.4-2.27 1.13-3.07.79-.86 2.16-1.5 3.18-1.51zM20.5 17.43c-.55 1.27-.81 1.84-1.51 2.97-1 1.62-2.41 3.65-4.16 3.66-1.55.02-1.95-1.01-4.06-1.01s-2.55 1-4.07.99c-1.75-.02-3.07-1.85-4.07-3.47C-.06 16.79-.34 11.34 1.66 8.62c1.41-1.93 3.64-3.05 5.74-3.05 2.13 0 3.48 1.16 5.24 1.16 1.71 0 2.74-1.16 5.21-1.16 1.86 0 3.83 1.02 5.23 2.78-4.59 2.51-3.84 9.07-2.58 9.08z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
      <path d="M3.609 1.814 13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893 2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198 2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.207 12l2.491-2.491zM5.864 2.658 16.802 8.99l-2.302 2.302L5.864 2.658z" />
    </svg>
  );
}
