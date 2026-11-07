import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Mail, ShieldCheck } from "lucide-react";

const GROUPS = [
  {
    title: "Study",
    links: [
      { href: "/subjects", label: "All subjects" },
      { href: "/practice", label: "Practice modes" },
      { href: "/exam", label: "Full CBT simulation" },
      { href: "/achievements", label: "Achievements" }
    ]
  },
  {
    title: "Explore",
    links: [
      { href: "/universities", label: "Universities" },
      { href: "/leaderboard", label: "Leaderboard" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/library", label: "Bookmarks & notes" }
    ]
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Sign in" },
      { href: "/register", label: "Create account" },
      { href: "/profile", label: "Profile settings" },
      { href: "/notifications", label: "Notifications" }
    ]
  }
];

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line/10 bg-surface/40">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              A focused practice platform for Nigerian POST-UTME candidates. Realistic
              CBT simulations, explained answers and honest progress tracking.
            </p>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              No fake leaderboards. No invented cut-off marks.
            </p>
          </div>
          {GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider my-8" />

        <div className="flex flex-col gap-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} PRAISE POST UTME. Built for Nigerian students.</p>
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              support@praise.ng
            </span>
            <Link href="/about" className="transition hover:text-ink">
              About & disclaimer
            </Link>
            <Link href="/privacy" className="transition hover:text-ink">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
