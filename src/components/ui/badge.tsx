import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "brand" | "success" | "warning" | "danger" | "gold" | "cyan";

const TONES: Record<BadgeTone, string> = {
  neutral: "border-line/20 bg-white/[0.04] text-muted",
  brand: "border-brand-500/25 bg-brand-500/10 text-brand-500 dark:text-brand-300",
  success: "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warning: "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  danger: "border-rose-500/25 bg-rose-500/10 text-rose-600 dark:text-rose-400",
  gold: "border-gold/30 bg-gold/10 text-amber-600 dark:text-gold",
  cyan: "border-cyan-500/25 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300"
};

export function Badge({
  children,
  tone = "neutral",
  className
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
