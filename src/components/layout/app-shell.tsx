"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Bell,
  BookOpen,
  CalendarCheck,
  ClipboardCheck,
  GraduationCap,
  History,
  LayoutDashboard,
  Library,
  ListChecks,
  LogOut,
  Medal,
  Menu,
  Settings,
  ShieldCheck,
  Sparkles,
  Trophy,
  Upload,
  UserRound,
  Users,
  X,
  type LucideIcon
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Avatar } from "@/components/ui/avatar";
import { PageLoader } from "@/components/ui/spinner";
import { useApp } from "@/components/providers/app-provider";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: number;
}

const GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "Study",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/practice", label: "Practice", icon: Sparkles },
      { href: "/exam", label: "Full CBT", icon: ClipboardCheck },
      { href: "/subjects", label: "Subjects", icon: BookOpen }
    ]
  },
  {
    title: "Progress",
    items: [
      { href: "/results", label: "Results", icon: History },
      { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
      { href: "/achievements", label: "Achievements", icon: Medal },
      { href: "/planner", label: "Study planner", icon: CalendarCheck }
    ]
  },
  {
    title: "Library",
    items: [
      { href: "/library", label: "Bookmarks & notes", icon: Library },
      { href: "/universities", label: "Universities", icon: GraduationCap }
    ]
  }
];

const ADMIN_ITEMS: NavItem[] = [
  { href: "/admin", label: "Admin overview", icon: ShieldCheck, exact: true },
  { href: "/admin/questions", label: "Question bank", icon: ListChecks },
  { href: "/admin/import", label: "Import questions", icon: Upload },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/reports", label: "Question reports", icon: Bell },
  { href: "/admin/settings", label: "Platform settings", icon: Settings }
];

const MOBILE_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard, exact: true },
  { href: "/practice", label: "Practice", icon: Sparkles },
  { href: "/exam", label: "CBT", icon: ClipboardCheck },
  { href: "/leaderboard", label: "Ranks", icon: Trophy },
  { href: "/profile", label: "Profile", icon: UserRound }
];

function isActive(pathname: string, item: NavItem) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function SidebarLink({
  item,
  active,
  onNavigate
}: {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
        active
          ? "bg-brand-500/12 text-ink shadow-[inset_2px_0_0_0_rgb(51_132_255)]"
          : "text-muted hover:bg-white/[0.04] hover:text-ink"
      )}
    >
      <Icon
        className={cn(
          "h-[18px] w-[18px] shrink-0 transition",
          active ? "text-brand-400" : "text-muted group-hover:text-brand-300"
        )}
      />
      <span className="truncate">{item.label}</span>
      {item.badge ? (
        <span className="ml-auto rounded-full bg-brand-500/20 px-2 py-0.5 text-[10px] font-bold text-brand-300">
          {item.badge}
        </span>
      ) : null}
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, user, isAdmin, isGuest, logout, unreadCount, settings } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDrawerOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [ready, user, pathname, router]);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  if (!ready || !user) return <PageLoader />;

  const currentLabel =
    [...GROUPS.flatMap((group) => group.items), ...ADMIN_ITEMS, ...MOBILE_ITEMS]
      .filter((item) => isActive(pathname, item))
      .sort((a, b) => b.href.length - a.href.length)[0]?.label ?? "PRAISE";

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between px-5">
        <Logo />
        <button
          type="button"
          onClick={() => setDrawerOpen(false)}
          className="rounded-lg p-1.5 text-muted transition hover:bg-white/10 hover:text-ink lg:hidden"
          aria-label="Close navigation"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-6 no-scrollbar" aria-label="Workspace navigation">
        {GROUPS.map((group) => (
          <div key={group.title}>
            <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted/70">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <SidebarLink
                  key={item.href}
                  item={item}
                  active={isActive(pathname, item)}
                  onNavigate={() => setDrawerOpen(false)}
                />
              ))}
            </div>
          </div>
        ))}

        {isAdmin ? (
          <div>
            <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted/70">
              Administration
            </p>
            <div className="space-y-0.5">
              {ADMIN_ITEMS.map((item) => (
                <SidebarLink
                  key={item.href}
                  item={item}
                  active={isActive(pathname, item)}
                  onNavigate={() => setDrawerOpen(false)}
                />
              ))}
            </div>
          </div>
        ) : null}
      </nav>

      <div className="border-t border-line/10 p-3">
        <Link
          href="/notifications"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-white/[0.04] hover:text-ink"
        >
          <Bell className="h-[18px] w-[18px]" />
          Notifications
          {unreadCount ? (
            <span className="ml-auto rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          ) : null}
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg">
      <aside className="app-sidebar fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-line/10 bg-surface/60 backdrop-blur-xl lg:block">
        {sidebar}
      </aside>

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation overlay"
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="relative h-full w-72 max-w-[85vw] border-r border-line/10 bg-surface shadow-card animate-fade-in">
            {sidebar}
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-line/10 bg-bg/80 backdrop-blur-2xl">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open navigation"
                className="grid h-9 w-9 place-items-center rounded-xl border border-line/15 text-muted transition hover:text-ink lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="lg:hidden">
                <Logo showWordmark={false} size="sm" />
              </div>
              <span className="hidden text-sm font-semibold text-ink sm:block">
                {currentLabel}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/practice"
                className="btn-secondary hidden px-3 py-2 text-xs sm:inline-flex"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Quick practice
              </Link>
              <Link
                href="/notifications"
                aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
                className="relative grid h-9 w-9 place-items-center rounded-xl border border-line/15 text-muted transition hover:text-ink"
              >
                <Bell className="h-4 w-4" />
                {unreadCount ? (
                  <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                ) : null}
              </Link>
              <ThemeToggle />

              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  className="flex items-center gap-2 rounded-xl border border-line/15 py-1 pl-1 pr-2.5 transition hover:border-brand-500/30"
                >
                  <Avatar name={user.displayName} src={user.avatar} size="xs" />
                  <span className="hidden max-w-[120px] truncate text-xs font-semibold text-ink sm:block">
                    {user.displayName}
                  </span>
                </button>
                {menuOpen ? (
                  <div
                    role="menu"
                    className="absolute right-0 top-12 w-60 overflow-hidden rounded-xl border border-line/15 bg-card p-1.5 shadow-card animate-fade-up"
                  >
                    <div className="px-3 py-2.5">
                      <p className="truncate text-sm font-semibold text-ink">{user.displayName}</p>
                      <p className="truncate text-xs text-muted">@{user.username}</p>
                      <span className="mt-1.5 inline-flex rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-300">
                        {isAdmin ? "Administrator" : isGuest ? "Guest" : "Student"}
                      </span>
                    </div>
                    <div className="my-1 h-px bg-line/10" />
                    <Link
                      href="/profile"
                      role="menuitem"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-white/[0.05] hover:text-ink"
                    >
                      <UserRound className="h-4 w-4" /> Profile & settings
                    </Link>
                    <Link
                      href="/results"
                      role="menuitem"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-white/[0.05] hover:text-ink"
                    >
                      <History className="h-4 w-4" /> My results
                    </Link>
                    {isAdmin ? (
                      <Link
                        href="/admin"
                        role="menuitem"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-white/[0.05] hover:text-ink"
                      >
                        <ShieldCheck className="h-4 w-4" /> Admin dashboard
                      </Link>
                    ) : null}
                    <div className="my-1 h-px bg-line/10" />
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        logout();
                        router.push("/");
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-400 transition hover:bg-rose-500/10"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        {isGuest ? (
          <div className="border-b border-amber-500/20 bg-amber-500/5 px-4 py-2 text-center text-xs text-amber-500 sm:px-6">
            You are practising as a guest. Results stay on this device and do not appear on
            leaderboards.{" "}
            <Link href="/register" className="font-semibold underline underline-offset-2">
              Create a free account
            </Link>
          </div>
        ) : null}

        {settings?.maintenance ? (
          <div className="border-b border-rose-500/20 bg-rose-500/5 px-4 py-2 text-center text-xs text-rose-400 sm:px-6">
            Maintenance mode is currently enabled by the administrator. Some features may be
            unavailable.
          </div>
        ) : null}

        <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-12">
          {children}
        </main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line/10 bg-bg/95 backdrop-blur-2xl lg:hidden"
        aria-label="Mobile navigation"
      >
        <div className="grid grid-cols-5">
          {MOBILE_ITEMS.map((item) => {
            const active = isActive(pathname, item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition",
                  active ? "text-brand-400" : "text-muted hover:text-ink"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
