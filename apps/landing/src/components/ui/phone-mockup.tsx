import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props =
  | {
      children: ReactNode;
      src?: undefined;
      alt?: undefined;
      priority?: undefined;
      className?: string;
    }
  | {
      children?: undefined;
      src: string;
      alt: string;
      priority?: boolean;
      className?: string;
    };

export function PhoneMockup(props: Props) {
  const { className } = props;
  return (
    <div
      className={cn(
        "relative aspect-[9/19.5] w-full max-w-[280px] rounded-[44px] bg-stone-ink p-3 shadow-[0_40px_80px_-20px_rgba(45,45,40,0.35)]",
        className,
      )}
    >
      {/* Dynamic island */}
      <div className="absolute inset-x-0 top-0 z-20 flex justify-center pt-3">
        <div className="h-6 w-24 rounded-b-2xl rounded-t-md bg-stone-ink" />
      </div>

      <div className="relative h-full w-full overflow-hidden rounded-[34px] bg-clay-100">
        {"src" in props && props.src ? (
          <>
            <Image
              src={props.src}
              alt={props.alt}
              fill
              sizes="(max-width: 768px) 80vw, 280px"
              priority={props.priority}
              className="object-cover object-top"
            />
            {/* Status bar gradient mask to soften top edge */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-clay-100/80 to-transparent"
            />
          </>
        ) : (
          props.children
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-[44px] ring-1 ring-white/5" />
    </div>
  );
}
