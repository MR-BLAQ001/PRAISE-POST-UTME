import { avatarGradient, cn, initials } from "@/lib/utils";

const SIZE_MAP = {
  xs: "h-7 w-7 text-[10px]",
  sm: "h-9 w-9 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-16 w-16 text-lg",
  xl: "h-24 w-24 text-2xl"
};

export function Avatar({
  name,
  src,
  size = "md",
  className
}: {
  name: string;
  src?: string | null;
  size?: keyof typeof SIZE_MAP;
  className?: string;
}) {
  const isImage = Boolean(src && /^(https?:\/\/|data:image\/)/.test(src));
  if (isImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src!}
        alt={name}
        className={cn(
          "shrink-0 rounded-full border border-white/15 object-cover",
          SIZE_MAP[size],
          className
        )}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-gradient-to-br font-bold text-white ring-2 ring-white/10",
        avatarGradient(name || "student"),
        SIZE_MAP[size],
        className
      )}
    >
      {initials(name || "Student")}
    </span>
  );
}
