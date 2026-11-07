"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, LayoutDashboard, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useApp } from "@/components/providers/app-provider";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/subjects", label: "Subjects" },
  { href: "/practice", label: "Practice" },
  { href: "/universities", label: "Universities" },
  { href: "/leaderboard", label: "Leaderboard" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const { ready, user } = useApp();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-header sticky top-0 z-50 border-b border-line/10 bg-bg/80 backdrop-blur-2xl">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-white/[0.06] text-ink"
                    : "text-muted hover:bg-white/[0.04] hover:text-ink"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden sm:grid" />
          {ready && user ? (
            <Link href="/dashboard" className="btn-primary hidden sm:inline-flex">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn-ghost hidden sm:inline-flex">
                Sign in
              </Link>
              <Link href="/register" className="btn-primary hidden sm:inline-flex">
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-9 w-9 place-items-center rounded-xl border border-line/15 text-muted transition hover:text-ink md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-menu" className="border-t border-line/10 bg-bg/95 px-4 py-4 backdrop-blur-2xl md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-white/[0.05] hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
            <div className="divider my-2" />
            <div className="flex items-center justify-between gap-2 px-2">
              <ThemeToggle />
              {ready && user ? (
                <Link href="/dashboard" className="btn-primary flex-1">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="btn-secondary flex-1">
                    Sign in
                  </Link>
                  <Link href="/register" className="btn-primary flex-1">
                    Get started
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
