import { cn } from "@/lib/cn";

type Props = {
  quote: string;
  author: string;
  variant?: "light" | "clay" | "sage";
  className?: string;
};

const variants = {
  light: "bg-white text-foreground",
  clay: "bg-clay-600 text-white",
  sage: "bg-sage-400 text-white",
};

export function QuoteCard({ quote, author, variant = "light", className }: Props) {
  const isAccent = variant !== "light";
  return (
    <figure
      className={cn(
        "relative flex flex-col justify-between gap-6 rounded-[var(--radius-card)] p-6 transition-all hover:scale-[1.01] hover:shadow-xl",
        variants[variant],
        isAccent
          ? "shadow-[0_8px_32px_-12px_rgba(45,45,40,0.15)]"
          : "shadow-[0_2px_24px_-8px_rgba(45,45,40,0.08)] border border-clay-200",
        className,
      )}
    >
      <div
        aria-hidden
        className={cn(
          "quote-mark text-[80px] font-bold leading-none -mt-2",
          isAccent ? "text-white/30" : "text-clay-300",
        )}
      >
        &ldquo;
      </div>
      <blockquote className="font-serif italic text-[19px] leading-[1.45] -mt-4">
        {quote}
      </blockquote>
      <figcaption
        className={cn(
          "text-[11px] uppercase tracking-[0.18em]",
          isAccent ? "text-white/80" : "text-muted",
        )}
      >
        — {author}
      </figcaption>
    </figure>
  );
}
