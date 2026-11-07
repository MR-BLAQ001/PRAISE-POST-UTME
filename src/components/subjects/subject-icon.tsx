import {
  Atom,
  BookOpen,
  Calculator,
  Church,
  Dna,
  FlaskConical,
  Globe2,
  Landmark,
  Languages,
  MoonStar,
  Scale,
  ScrollText,
  Sigma,
  Sprout,
  Store,
  TrendingUp,
  type LucideIcon
} from "lucide-react";
import { getSubject } from "@/lib/subjects";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  Languages,
  Sigma,
  Atom,
  FlaskConical,
  Dna,
  BookOpen,
  Landmark,
  Church,
  MoonStar,
  ScrollText,
  TrendingUp,
  Store,
  Calculator,
  Globe2,
  Sprout,
  Scale
};

export function SubjectIcon({
  subject,
  className,
  size = "md"
}: {
  subject: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const record = getSubject(subject);
  const Icon = ICONS[record?.icon ?? "BookOpen"] ?? BookOpen;
  const sizes = {
    sm: "h-8 w-8 rounded-lg [&>svg]:h-4 [&>svg]:w-4",
    md: "h-11 w-11 rounded-xl [&>svg]:h-5 [&>svg]:w-5",
    lg: "h-14 w-14 rounded-2xl [&>svg]:h-7 [&>svg]:w-7"
  };
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center bg-gradient-to-br text-white shadow-soft",
        record?.gradient ?? "from-brand-500 to-cyan-500",
        sizes[size],
        className
      )}
      aria-hidden="true"
    >
      <Icon />
    </span>
  );
}
