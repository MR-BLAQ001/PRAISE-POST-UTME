import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  href?: string | null;
  showWordmark?: boolean;
  className?: string;
}

const SIZES = {
  sm: { mark: "h-8 w-8", title: "text-sm", sub: "text-[8px]" },
  md: { mark: "h-10 w-10", title: "text-base", sub: "text-[9px]" },
  lg: { mark: "h-14 w-14", title: "text-xl", sub: "text-[10px]" }
};

export function Logo({ size = "md", href = "/", showWordmark = true, className }: LogoProps) {
  const dimensions = SIZES[size];
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "relative grid place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 shadow-[0_8px_24px_-8px_rgba(30,99,245,.9)]",
          dimensions.mark
        )}
        aria-hidden="true"
      >
        <svg viewBox="0 0 512 512" className="h-full w-full" fill="none">
          <rect width="512" height="512" rx="112" fill="url(#logo-bg)" />
          <defs>
            <linearGradient id="logo-bg" x1="0" y1="0" x2="512" y2="512">
              <stop stopColor="#59A6FF" />
              <stop offset=".55" stopColor="#1E63F5" />
              <stop offset="1" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
          <path d="M256 130 386 188 256 246 126 188 256 130Z" fill="white" />
          <path
            d="M182 218v58c0 32 33 56 74 56s74-24 74-56v-58l-74 32-74-32Z"
            fill="white"
            fillOpacity=".28"
          />
          <path
            d="M256 270v112M256 270h52c28 0 50 18 50 42s-22 42-50 42h-52"
            stroke="white"
            strokeWidth="30"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {showWordmark ? (
        <span className="flex flex-col leading-none">
          <span className={cn("font-bold tracking-tight text-ink", dimensions.title)}>
            PRAISE
          </span>
          <span
            className={cn(
              "mt-1 font-semibold uppercase tracking-[0.32em] text-brand-400",
              dimensions.sub
            )}
          >
            Post UTME
          </span>
        </span>
      ) : null}
    </span>
  );

  if (href === null) return content;
  return (
    <Link href={href} className="shrink-0" aria-label="PRAISE POST UTME home">
      {content}
    </Link>
  );
}
