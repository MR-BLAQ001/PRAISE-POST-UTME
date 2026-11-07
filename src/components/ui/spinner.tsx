import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Spinner({ className, label = "Loading" }: { className?: string; label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-muted" role="status">
      <Loader2 className={cn("h-4 w-4 animate-spin", className)} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function PageLoader({ label = "Loading your workspace" }: { label?: string }) {
  return (
    <div className="grid min-h-[60vh] place-items-center px-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="relative grid h-14 w-14 place-items-center rounded-2xl border border-brand-500/20 bg-brand-500/10">
          <span className="absolute inset-0 animate-pulse-ring rounded-2xl border border-brand-400/40" />
          <Loader2 className="h-6 w-6 animate-spin text-brand-400" />
        </span>
        <p className="text-sm font-medium text-muted">{label}…</p>
      </div>
    </div>
  );
}
