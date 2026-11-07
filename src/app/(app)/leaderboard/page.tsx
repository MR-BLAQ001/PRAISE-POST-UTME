"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Award,
  Crown,
  Info,
  Medal,
  ShieldCheck,
  Target,
  Trophy,
  Users
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { useApp } from "@/components/providers/app-provider";
import {
  LEADERBOARD_RULES,
  PERIOD_LABELS,
  buildLeaderboard,
  type LeaderboardPeriod
} from "@/lib/leaderboard";
import { SUBJECTS, subjectName } from "@/lib/subjects";
import { cn } from "@/lib/utils";

const PERIODS: LeaderboardPeriod[] = ["weekly", "monthly", "all-time"];

const PODIUM_STYLES = [
  {
    ring: "ring-gold/60",
    badge: "from-gold to-amber-500 text-slate-950",
    icon: Crown,
    label: "First place"
  },
  {
    ring: "ring-slate-300/40",
    badge: "from-slate-200 to-slate-400 text-slate-950",
    icon: Medal,
    label: "Second place"
  },
  {
    ring: "ring-amber-700/50",
    badge: "from-amber-600 to-amber-800 text-white",
    icon: Medal,
    label: "Third place"
  }
];

export default function LeaderboardPage() {
  const { user, db } = useApp();
  const [period, setPeriod] = useState<LeaderboardPeriod>("all-time");
  const [subject, setSubject] = useState<string>("");

  const profiles = useMemo(
    () =>
      (db?.users ?? []).map(({ passwordHash: _hash, passwordSalt: _salt, ...profile }) => profile),
    [db]
  );

  const board = useMemo(() => {
    if (!db) return { entries: [], total: 0, personal: null };
    return buildLeaderboard({
      results: db.results,
      users: profiles,
      period,
      subject: subject || null,
      currentUserId: user?.id,
      limit: 50
    });
  }, [db, profiles, period, subject, user?.id]);

  if (!user) return null;

  const topThree = board.entries.slice(0, 3);
  const rest = board.entries.slice(3);
  const podiumOrder = topThree.length === 3 ? [topThree[1], topThree[0], topThree[2]] : topThree;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Honest rankings"
        title="Leaderboard"
        description="Average accuracy across completed CBT examinations. Practice drills are excluded, so the board reflects exam performance — not how many easy questions someone clicked."
        actions={
          <Link href="/exam" className="btn-primary">
            <Target className="h-4 w-4" />
            Take a ranked CBT
          </Link>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {PERIODS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setPeriod(option)}
              aria-pressed={period === option}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
                period === option
                  ? "border-brand-500/50 bg-brand-500/15 text-brand-300"
                  : "border-line/15 text-muted hover:text-ink"
              )}
            >
              {PERIOD_LABELS[option]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="leaderboard-subject" className="text-xs text-muted">
            Subject
          </label>
          <select
            id="leaderboard-subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="input h-9 text-xs"
          >
            <option value="">All subjects</option>
            {SUBJECTS.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {user.isGuest ? (
        <div className="card border-amber-500/25 bg-amber-500/[0.05] p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-amber-400">
            <Info className="h-4 w-4" />
            Guest sessions are not ranked
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            Create a free account to save your results and appear on the leaderboard. Guests can
            still see the board and use every practice mode.
          </p>
          <Link href="/register" className="btn-primary mt-3 text-xs">
            Create free account
          </Link>
        </div>
      ) : null}

      {!user.isGuest && !board.personal ? (
        <div className="card border-brand-500/25 bg-brand-500/[0.04] p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Target className="h-4 w-4 text-brand-400" />
            You are not ranked yet
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            Complete a full CBT simulation or custom examination to enter the board. Practice
            sessions count towards analytics but not ranking.
          </p>
          <Link href="/exam" className="btn-primary mt-3 text-xs">
            Start a full CBT
          </Link>
        </div>
      ) : null}

      {board.entries.length ? (
        <>
          {topThree.length ? (
            <div className="grid gap-3 sm:grid-cols-3 sm:items-end">
              {podiumOrder.map((entry) => {
                const place = entry.rank - 1;
                const style = PODIUM_STYLES[place] ?? PODIUM_STYLES[2];
                const Icon = style.icon;
                return (
                  <div
                    key={entry.userId}
                    className={cn(
                      "card relative overflow-hidden p-5 text-center ring-1",
                      style.ring,
                      entry.rank === 1 && "sm:order-none sm:pb-7 sm:pt-7"
                    )}
                  >
                    <span
                      className={cn(
                        "mx-auto grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br shadow-soft",
                        style.badge
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="mt-3 flex justify-center">
                      <Avatar
                        name={entry.displayName}
                        src={entry.avatar}
                        size={entry.rank === 1 ? "lg" : "md"}
                      />
                    </div>
                    <p className="mt-2 truncate text-sm font-semibold text-ink">{entry.displayName}</p>
                    <p className="truncate text-[11px] text-muted">@{entry.username}</p>
                    <p className="mt-2 text-2xl font-extrabold tracking-tight text-ink">
                      {entry.averageScore}%
                    </p>
                    <p className="text-[10px] uppercase tracking-wide text-muted">Average accuracy</p>
                    <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                      <span className="chip">{entry.exams} CBT{entry.exams === 1 ? "" : "s"}</span>
                      <span className="chip">{entry.points} pts</span>
                    </div>
                    {entry.isCurrentUser ? (
                      <Badge tone="brand" className="mt-2">
                        You
                      </Badge>
                    ) : null}
                    <span className="absolute right-3 top-3 text-[11px] font-bold text-muted">
                      #{entry.rank}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : null}

          <div className="card overflow-hidden">
            <div className="hidden grid-cols-[50px_1fr_90px_80px_80px_80px] gap-3 border-b border-line/10 bg-white/[0.02] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-muted sm:grid">
              <span>Rank</span>
              <span>Student</span>
              <span className="text-right">Average</span>
              <span className="text-right">CBTs</span>
              <span className="text-right">Points</span>
              <span className="text-right">Accuracy</span>
            </div>
            <div className="divide-y divide-line/10">
              {rest.map((entry) => (
                <div
                  key={entry.userId}
                  className={cn(
                    "grid grid-cols-[36px_1fr_auto] items-center gap-3 px-4 py-3 sm:grid-cols-[50px_1fr_90px_80px_80px_80px]",
                    entry.isCurrentUser && "bg-brand-500/[0.06]"
                  )}
                >
                  <span className="text-xs font-bold tabular-nums text-muted">#{entry.rank}</span>
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Avatar name={entry.displayName} src={entry.avatar} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">
                        {entry.displayName}
                        {entry.isCurrentUser ? (
                          <span className="ml-1.5 text-[10px] font-semibold text-brand-400">(you)</span>
                        ) : null}
                      </p>
                      <p className="truncate text-[11px] text-muted">@{entry.username}</p>
                      <p className="text-[10px] text-muted sm:hidden">
                        {entry.exams} CBTs · {entry.points} pts · {entry.accuracy}% accuracy
                      </p>
                    </div>
                  </div>
                  <p className="text-right text-sm font-bold tabular-nums text-ink sm:text-left sm:text-right">
                    {entry.averageScore}%
                  </p>
                  <p className="hidden text-right text-xs tabular-nums text-muted sm:block">
                    {entry.exams}
                  </p>
                  <p className="hidden text-right text-xs tabular-nums text-muted sm:block">
                    {entry.points}
                  </p>
                  <p className="hidden text-right text-xs tabular-nums text-muted sm:block">
                    {entry.accuracy}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <EmptyState
          icon={Trophy}
          title="No ranked attempts yet"
          description={
            subject
              ? `No one has completed a ranked CBT covering ${subjectName(subject)} in this period. Be the first.`
              : "The board is empty for this period. Complete a full CBT or custom examination to set the first honest score."
          }
          action={{ label: "Take a CBT", href: "/exam" }}
        />
      )}

      {board.personal ? (
        <div className="card border-brand-500/25 bg-gradient-to-br from-brand-600/10 to-cyan-500/5 p-5">
          <div className="flex flex-wrap items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-cyan-500 text-xl font-extrabold text-white shadow-glow">
              #{board.personal.rank}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink">Your position</p>
              <p className="mt-0.5 text-xs text-muted">
                {board.personal.averageScore}% average across {board.personal.exams} ranked CBT
                {board.personal.exams === 1 ? "" : "s"} · {board.personal.points} points ·{" "}
                {board.personal.accuracy}% question accuracy
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/results" className="btn-secondary text-xs">
                Review results
              </Link>
              <Link href="/exam" className="btn-primary text-xs">
                Improve your average
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="card p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            How ranking works
          </p>
          <ul className="mt-3 space-y-2">
            {LEADERBOARD_RULES.map((rule) => (
              <li key={rule} className="flex items-start gap-2 text-xs leading-relaxed text-muted">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                {rule}
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Users className="h-4 w-4 text-brand-400" />
            Board snapshot
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-line/10 bg-white/[0.02] p-3">
              <p className="text-[10px] uppercase tracking-wide text-muted">Ranked students</p>
              <p className="mt-0.5 text-lg font-bold text-ink">{board.total}</p>
            </div>
            <div className="rounded-xl border border-line/10 bg-white/[0.02] p-3">
              <p className="text-[10px] uppercase tracking-wide text-muted">Period</p>
              <p className="mt-0.5 text-sm font-bold text-ink">{PERIOD_LABELS[period]}</p>
            </div>
            <div className="rounded-xl border border-line/10 bg-white/[0.02] p-3">
              <p className="text-[10px] uppercase tracking-wide text-muted">Top average</p>
              <p className="mt-0.5 text-lg font-bold text-ink">
                {board.entries[0]?.averageScore ?? 0}%
              </p>
            </div>
            <div className="rounded-xl border border-line/10 bg-white/[0.02] p-3">
              <p className="text-[10px] uppercase tracking-wide text-muted">Subject</p>
              <p className="mt-0.5 truncate text-sm font-bold text-ink">
                {subject ? subjectName(subject) : "All subjects"}
              </p>
            </div>
          </div>
          <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-muted">
            <Award className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
            Leaderboards use real submitted results only. There are no seeded scores or filler
            students anywhere on this board.
          </p>
        </div>
      </div>
    </div>
  );
}
