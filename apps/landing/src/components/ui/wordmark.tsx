import { cn } from "@/lib/cn";

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline gap-1.5", className)}>
      <span className="font-serif text-2xl tracking-tight">Echoes</span>
      <span className="h-1.5 w-1.5 rounded-full bg-clay-600" aria-hidden />
    </span>
  );
}
