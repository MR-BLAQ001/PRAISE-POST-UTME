"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Atom,
  Award,
  Bookmark,
  CalendarCheck,
  Crown,
  Flag,
  Flame,
  Layers,
  Lock,
  Medal,
  NotebookPen,
  Sigma,
  Sparkles,
  Target,
  Trophy,
  type LucideIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/components/providers/app-provider";
import {
  ACHIEVEMENTS,
  achievementPoints,
  computeAchievementStats,
  computeAllAchievements
} from "@/lib/achievements";
import { RANKED_MODES } from "@/lib/exam";
import { buildLeaderboard } from "@/lib/leaderboard";
import { calculateStreak } from "@/lib/performance";
import { cn } from "@/lib/utils";
import type { AchievementDefinition } from "@/lib/types";

const ICONS: Record<string, LucideIcon> = {
  Atom,
  Bookmark,
  CalendarCheck,
  Crown,
  Flag,
  Flame,
  Layers,
  NotebookPen,
  Sigma,
  Sparkles,
  Target,
  Trophy,
  Award,
  Medal
};

const CATEGORIES: { value: "all" | AchievementDefinition["category"]; label: string }[] = [
  { value: "all", label: "All" },
  { value: "milestone", label: "Milestones" },
  { value: "accuracy", label: "Accuracy" },
  { value: "streak", label: "Streaks" },
  { value: "subject", label: "Subject mastery" },
  { value: "community", label: "Community" }
];

const TIER_STYLES: Record<
  AchievementDefinition["tier"],
  { label: string; badge: "neutral" | "brand" | "gold" | "cyan"; ring: string; icon: string }
> = {
  bronze: {
    label: "Bronze",
    badge: "neutral",
    ring: "ring-amber-700/40",
    icon: "from-amber-700 to-amber-900"
  },
  silver: {
    label: "Silver",
    badge: "neutral",
    ring: "ring-slate-400/40",
    icon: "from-slate-300 to-slate-500"
  },
  gold: {
    label: "Gold",
    badge: "gold",
    ring: "ring-gold/50",
    icon: "from-gold to-amber-600"
  },
  platinum: {
    label: "Platinum",
    badge: "cyan",
    ring: "ring-cyan-400/50",
    icon: "from-cyan-400 to-blue-600"
  }
};

export default function AchievementsPage() {
  const { user, db, userResults, userPractice, plan } = useApp();
  const [category, setCategory] = useState<"all" | AchievementDefinition["category"]>("all");

  const stats = useMemo(() => {
    if (!user || !db) return null;
    const streak = calculateStreak(userResults, userPractice, user.id);
    const dailyCount = Object.keys(db.dailyChallenges).filter(
      (key) => key.startsWith(`${user.id}:`) && db.dailyChallenges[key].completed
    ).length;
    const board = buildLeaderboard({
      results: db.results,
      users: db.users.map(({ passwordHash: _hash, passwordSalt: _salt, ...profile }) => profile),
      currentUserId: user.id,
      limit: 1
    });
    return computeAchievementStats({
      results: db.results,
      practice: db.practice,
      userId: user.id,
      streak: streak.current,
      dailyCount,
      bookmarks: db.bookmarks.filter((item) => item.userId === user.id).length,
      notes: db.notes.filter((item) => item.userId === user.id).length,
      globalRank: board.personal?.rank ?? null
    });
  }, [db, user, userResults, userPractice]);

  if (!user) return null;

  const progressList = stats ? computeAllAchievements(stats) : [];
  const unlocked = progressList.filter((entry) => entry.unlocked);
  const points = achievementPoints(progressList);
  const nextUp = progressList
    .filter((entry) => !entry.unlocked)
    .sort((a, b) => b.progressPercent - a.progressPercent)
    .slice(0, 3);
  const visible =
    category === "all"
      ? progressList
      : progressList.filter((entry) => entry.definition.category === category);

  const cbtCount = userResults.filter((result) => RANKED_MODES.includes(result.mode)).length;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Progress milestones"
        title="Achievements"
        description="Badges are unlocked from real activity — examinations completed, questions answered, accuracy earned and streaks maintained. Nothing is awarded automatically for simply signing in."
        actions={
          <Link href="/practice" className="btn-primary">
            <Target className="h-4 w-4" />
            Work towards a badge
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Badges unlocked",
            value: `${unlocked.length} / ${progressList.length}`,
            icon: Medal,
            accent: "text-amber-400"
          },
          {
            label: "Badge points",
            value: points,
            icon: Award,
            accent: "text-brand-400"
          },
          {
            label: "Ranked CBTs",
            value: cbtCount,
            icon: Trophy,
            accent: "text-emerald-400"
          },
          {
            label: "Study streak",
            value: `${stats?.streak ?? 0} days`,
            icon: Flame,
            accent: "text-rose-400"
          }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="card flex items-center gap-3 p-4">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-line/10 bg-white/[0.03]">
                <Icon className={cn("h-5 w-5", item.accent)} />
              </span>
              <div>
                <p className="text-[11px] text-muted">{item.label}</p>
                <p className="text-lg font-bold text-ink">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-ink">Overall completion</h2>
            <p className="mt-0.5 text-[11px] text-muted">
              Each badge has clear criteria. Hover or open the card to see your progress.
            </p>
          </div>
          <Badge tone="brand">
            {progressList.length ? Math.round((unlocked.length / progressList.length) * 100) : 0}% complete
          </Badge>
        </div>
        <Progress
          value={progressList.length ? (unlocked.length / progressList.length) * 100 : 0}
          className="mt-3 h-2"
        />
      </div>

      {nextUp.length ? (
        <div className="card border-brand-500/20 p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Sparkles className="h-4 w-4 text-brand-400" />
            Closest to unlocking
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {nextUp.map((entry) => {
              const Icon = ICONS[entry.definition.icon] ?? Award;
              return (
                <div key={entry.definition.id} className="rounded-xl border border-line/10 p-3">
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500/10 text-brand-400">
                      <Icon className="h-4 w-4" />
                    </span>
                    <p className="min-w-0 flex-1 truncate text-xs font-semibold text-ink">
                      {entry.definition.title}
                    </p>
                    <span className="text-[10px] font-semibold text-brand-400">
                      {entry.progressPercent}%
                    </span>
                  </div>
                  <Progress value={entry.progressPercent} className="mt-2 h-1.5" />
                  <p className="mt-1.5 text-[10px] leading-relaxed text-muted">{entry.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((option) => {
          const count =
            option.value === "all"
              ? progressList.length
              : progressList.filter((entry) => entry.definition.category === option.value).length;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setCategory(option.value)}
              aria-pressed={category === option.value}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
                category === option.value
                  ? "border-brand-500/50 bg-brand-500/15 text-brand-300"
                  : "border-line/15 text-muted hover:text-ink"
              )}
            >
              {option.label} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((entry) => {
          const Icon = ICONS[entry.definition.icon] ?? Award;
          const tier = TIER_STYLES[entry.definition.tier];
          return (
            <div
              key={entry.definition.id}
              className={cn(
                "card relative overflow-hidden p-5",
                entry.unlocked ? cn("ring-1", tier.ring) : "opacity-90"
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-white shadow-soft",
                    entry.unlocked ? tier.icon : "from-slate-700 to-slate-900"
                  )}
                >
                  {entry.unlocked ? <Icon className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h3 className="text-sm font-semibold text-ink">{entry.definition.title}</h3>
                    <Badge tone={tier.badge}>{tier.label}</Badge>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted">
                    {entry.definition.description}
                  </p>
                </div>
                <span className="shrink-0 text-[11px] font-bold text-amber-400">
                  +{entry.definition.points}
                </span>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-[10px]">
                  <span className={entry.unlocked ? "font-semibold text-emerald-400" : "text-muted"}>
                    {entry.unlocked ? "Unlocked" : entry.detail}
                  </span>
                  <span className="tabular-nums text-muted">
                    {entry.progress}/{entry.target}
                  </span>
                </div>
                <Progress
                  value={entry.progressPercent}
                  className="mt-1.5 h-1.5"
                  barClassName={
                    entry.unlocked
                      ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                      : "bg-gradient-to-r from-brand-500 to-cyan-400"
                  }
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="card p-5">
        <h2 className="text-sm font-semibold text-ink">How badges stay honest</h2>
        <ul className="mt-2 space-y-2 text-[11px] leading-relaxed text-muted">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
            Examination badges count only completed full CBTs and custom exams — not practice
            sessions.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
            Accuracy badges require a minimum number of questions so one lucky answer cannot unlock
            them.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
            Subject mastery badges are based on your actual answers in that subject, with an 80%
            accuracy threshold.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
            There are {ACHIEVEMENTS.length} badges in total and every one has a visible target.
          </li>
        </ul>
        {plan.examDate ? (
          <p className="mt-3 flex items-center gap-1.5 text-[11px] text-brand-400">
            <CalendarCheck className="h-3.5 w-3.5" />
            Target exam date: {new Date(plan.examDate).toLocaleDateString("en-NG")}
          </p>
        ) : null}
      </div>
    </div>
  );
}
