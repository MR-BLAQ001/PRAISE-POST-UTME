"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Award,
  Bell,
  BellRing,
  CalendarCheck,
  CheckCheck,
  ClipboardCheck,
  Flag,
  Info,
  Megaphone,
  Trophy
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { useApp } from "@/components/providers/app-provider";
import { cn, timeAgo } from "@/lib/utils";
import type { Notification } from "@/lib/types";

const TYPES: Record<
  Notification["type"],
  { icon: typeof Bell; accent: string; label: string }
> = {
  result: { icon: ClipboardCheck, accent: "bg-brand-500/10 text-brand-400", label: "Result" },
  achievement: { icon: Award, accent: "bg-amber-500/10 text-amber-400", label: "Achievement" },
  leaderboard: { icon: Trophy, accent: "bg-gold/10 text-gold", label: "Leaderboard" },
  daily: { icon: CalendarCheck, accent: "bg-violet-500/10 text-violet-400", label: "Daily" },
  report: { icon: Flag, accent: "bg-rose-500/10 text-rose-400", label: "Report" },
  system: { icon: Megaphone, accent: "bg-cyan-500/10 text-cyan-400", label: "System" }
};

export default function NotificationsPage() {
  const { user, notifications, unreadCount, markRead, markAllRead } = useApp();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const visible = useMemo(
    () => (filter === "unread" ? notifications.filter((item) => !item.read) : notifications),
    [notifications, filter]
  );

  if (!user) return null;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Updates"
        title="Notifications"
        description="Results, achievements, streak reminders and platform announcements. Only you can see this inbox."
        actions={
          <button
            type="button"
            onClick={markAllRead}
            disabled={!unreadCount}
            className="btn-secondary"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </button>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          aria-pressed={filter === "all"}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
            filter === "all"
              ? "border-brand-500/50 bg-brand-500/15 text-brand-300"
              : "border-line/15 text-muted hover:text-ink"
          )}
        >
          All ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("unread")}
          aria-pressed={filter === "unread"}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
            filter === "unread"
              ? "border-brand-500/50 bg-brand-500/15 text-brand-300"
              : "border-line/15 text-muted hover:text-ink"
          )}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {visible.length ? (
        <div className="card divide-y divide-line/10 overflow-hidden">
          {visible.map((notification) => {
            const meta = TYPES[notification.type] ?? TYPES.system;
            const Icon = meta.icon;
            return (
              <div
                key={notification.id}
                className={cn(
                  "flex items-start gap-3 p-4 sm:p-5",
                  !notification.read && "bg-brand-500/[0.04]"
                )}
              >
                <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl", meta.accent)}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-sm font-semibold text-ink">{notification.title}</p>
                    <Badge tone="neutral">{meta.label}</Badge>
                    {!notification.read ? <Badge tone="brand">New</Badge> : null}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{notification.message}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <span className="text-[10px] text-muted">{timeAgo(notification.createdAt)}</span>
                    {notification.href ? (
                      <Link
                        href={notification.href}
                        onClick={() => markRead(notification.id)}
                        className="text-[11px] font-medium text-brand-400 hover:text-brand-300"
                      >
                        Open
                      </Link>
                    ) : null}
                    {!notification.read ? (
                      <button
                        type="button"
                        onClick={() => markRead(notification.id)}
                        className="text-[11px] font-medium text-muted hover:text-ink"
                      >
                        Mark as read
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={filter === "unread" ? CheckCheck : BellRing}
          title={filter === "unread" ? "You are all caught up" : "No notifications yet"}
          description={
            filter === "unread"
              ? "Every notification has been read. New results and achievements will appear here."
              : "Complete a practice session or CBT and your result, achievements and streak updates will land here."
          }
          action={{ label: "Start practising", href: "/practice" }}
        />
      )}

      <div className="card p-4">
        <p className="flex items-center gap-2 text-xs font-semibold text-ink">
          <Info className="h-3.5 w-3.5 text-brand-400" />
          About your inbox
        </p>
        <p className="mt-1 text-[11px] leading-relaxed text-muted">
          Notifications are generated by your own activity on this device. There are no marketing
          emails, and your address is never shared. Administrators can send a site notice, which
          appears on your dashboard.
        </p>
      </div>
    </div>
  );
}
