import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function isLinkAction(value: unknown): value is { label: string; href: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "href" in value &&
    "label" in value &&
    typeof (value as { href: unknown }).href === "string" &&
    typeof (value as { label: unknown }).label === "string"
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; href: string } | React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "card flex flex-col items-center justify-center px-6 py-14 text-center",
        className
      )}
    >
      <span className="grid h-14 w-14 place-items-center rounded-2xl border border-brand-500/20 bg-brand-500/10 text-brand-400">
        <Icon className="h-7 w-7" />
      </span>
      <h3 className="mt-4 text-base font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted">{description}</p>
      {action ? (
        <div className="mt-5">
          {isLinkAction(action) ? (
            <Link href={action.href} className="btn-primary">
              {action.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            (action as React.ReactNode)
          )}
        </div>
      ) : null}
    </div>
  );
}
