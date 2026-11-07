import { cn, ratingFor } from "@/lib/utils";

export function ScoreRing({
  score,
  size = 160,
  stroke = 12,
  label = "Score",
  className
}: {
  score: number;
  size?: number;
  stroke?: number;
  label?: string;
  className?: string;
}) {
  const safeScore = Math.min(100, Math.max(0, Math.round(score)));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safeScore / 100) * circumference;
  const rating = ratingFor(safeScore);

  const gradientId = `score-gradient-${safeScore}`;
  const colors =
    rating.tone === "excellent"
      ? ["#34d399", "#22d3ee"]
      : rating.tone === "good"
        ? ["#59a6ff", "#22d3ee"]
        : rating.tone === "fair"
          ? ["#f5c451", "#f59e0b"]
          : ["#fb7185", "#f43f5e"];

  return (
    <div
      className={cn("relative inline-grid place-items-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label}: ${safeScore}% (${rating.label})`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="100%" stopColor={colors[1]} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-line/15"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 900ms cubic-bezier(.22,1,.36,1)" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center">
        <span className="text-3xl font-bold tracking-tight text-ink">{safeScore}%</span>
        <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
          {rating.label}
        </span>
      </div>
    </div>
  );
}
