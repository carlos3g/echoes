import { cn } from "@/lib/cn";

type Props = {
  title: string;
  author: string;
  count: string;
  hue: "clay" | "sage" | "ink" | "cream";
  className?: string;
};

const hueStyles = {
  clay: "bg-gradient-to-br from-clay-600 to-clay-700 text-white",
  sage: "bg-gradient-to-br from-sage-400 to-sage-500 text-white",
  ink: "bg-gradient-to-br from-stone-ink to-sage-700 text-white",
  cream: "bg-clay-50 text-foreground border border-clay-200",
};

export function FolderCard({ title, author, count, hue, className }: Props) {
  const isLight = hue === "cream";
  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-[var(--radius-card)] p-6 transition-all hover:scale-[1.02] hover:-rotate-[0.5deg]",
        hueStyles[hue],
        className,
      )}
    >
      <div className="flex justify-between items-start">
        <FolderIcon className={isLight ? "text-clay-600" : "text-white/60"} />
        <span
          className={cn(
            "text-[10px] uppercase tracking-widest font-medium",
            isLight ? "text-muted" : "text-white/70",
          )}
        >
          {count}
        </span>
      </div>
      <div className="space-y-2 mt-8">
        <h3 className="font-serif text-2xl leading-tight">{title}</h3>
        <p className={cn("text-xs", isLight ? "text-muted" : "text-white/70")}>
          {author}
        </p>
      </div>
    </div>
  );
}

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("h-5 w-5", className)}>
      <path
        d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
