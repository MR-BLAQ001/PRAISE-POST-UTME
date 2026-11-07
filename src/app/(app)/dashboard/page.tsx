"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BarChart3,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Flame,
  Layers,
  Medal,
  Play,
  Sparkles,
  Target,
  Trophy,
  Zap
} from "lucide-react";
import { ScoreTrendChart, SubjectAccuracyChart } from "@/components/charts/performance-charts";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { ScoreRing } from "@/components/ui/score-ring";
import { StatCard } from "@/components/ui/stat-card";
import { useApp } from "@/components/providers/app-provider";
import { computeAchievementStats, computeAllAchievements } from "@/lib/achievements";
import { RANKED_MODES, loadExamSession } from "@/lib/exam";
import { buildLeaderboard } from "@/lib/leaderboard";
import { buildPerformanceProfile, calculateStreak, weeklyReport } from "@/lib/performance";
import { getUniversity } from "@/lib/universities";
import { questionOfTheDay } from "@/lib/questions";
import { dateKey, formatDate, MODE_LABELS, timeAgo } from "@/lib/utils";

export default function DashboardPage() {
  const {
    user,
    db,
    userResults,
    userPractice,
    plan,
    notifications,
    getDailyChallenge,
    settings
  } = useApp();
  const [activeSession, setActiveSession] = useState<ReturnType<typeof loadExamSession>>(null);

  useEffect(() => {
    setActiveSession(loadExamSession());
  }, []);

  const performance = useMemo(
    () => buildPerformanceProfile(userResults, userPractice, user?.id),
    [userResults, userPractice, user?.id]
  );
  const streak = useMemo(
    () => (user ? calculateStreak(userResults, userPractice, user.id) : { current: 0, longest: 0, studiedToday: false }),
    [userResults, userPractice, user]
  );
  const weekly = useMemo(
    () => (user ? weeklyReport(userResults, userPractice, user.id) : null),
    [userResults, userPractice, user]
  );
  const rankedResults = userResults.filter((result) => RANKED_MODES.includes(result.mode));
  const daily = getDailyChallenge(dateKey());
  const todayQuestion = questionOfTheDay(dateKey());
  const university = user?.universityId ? getUniversity(user.universityId) : null;

  const board = useMemo(() => {
    if (!user || !db) return { entries: [], total: 0, personal: null };
    return buildLeaderboard({
      results: db.results,
      users: db.users.map(({ passwordHash: _hash, passwordSalt: _salt, ...profile }) => profile),
      currentUserId: user.id,
      limit: 5
    });
  }, [db, user]);

  const achievements = useMemo(() => {
    if (!user || !db) return [];
    const dailyCount = Object.keys(db.dailyChallenges).filter(
      (key) => key.startsWith(`${user.id}:`) && db.dailyChallenges[key].completed
    ).length;
    const stats = computeAchievementStats({
      results: db.results,
      practice: db.practice,
      userId: user.id,
      streak: streak.current,
      dailyCount,
      bookmarks: db.bookmarks.filter((bookmark) => bookmark.userId === user.id).length,
      notes: db.notes.filter((note) => note.userId === user.id).length,
      globalRank: board.personal?.rank ?? null
    });
    return computeAllAchievements(stats);
  }, [db, user, streak, board.personal?.rank]);

  if (!user) return null;

  const average = userResults.length
    ? Math.round(userResults.reduce((sum, result) => sum + result.percentage, 0) / userResults.length)
    : 0;
  const questionsAnswered =
    userResults.reduce((sum, result) => sum + result.total, 0) + userPractice.length;
  const points = achievements
    .filter((achievement) => achievement.unlocked)
    .reduce((sum, achievement) => sum + achievement.definition.points, 0);
  const unread = notifications.filter((notification) => !notification.read).length;
  const trend = [...userResults]
    .slice(0, 8)
    .reverse()
    .map((result, index) => ({
      label: `#${index + 1}`,
      score: result.percentage
    }));
  const nextTasks = plan.tasks.filter((task) => !task.done).slice(0, 3);
  const lastResult = userResults[0];
  const topAchievements = achievements.filter((achievement) => !achievement.unlocked).slice(0, 2);

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={formatDate(new Date(), { weekday: "long", day: "numeric", month: "long" })}
        title={
          <>
            {greeting}, <span className="gradient-text">{user.displayName.split(" ")[0]}</span>
          </>
        }
        description={
          user.isGuest
            ? "Guest mode is active. Your work stays on this device and never appears on leaderboards."
            : university
              ? `Working towards ${university.name}. Keep stacking honest practice sessions.`
              : "Set a target university in your profile to personalise your preparation."
        }
        actions={
          <>
            <Link href="/practice" className="btn-secondary">
              <Sparkles className="h-4 w-4" />
              Practice
            </Link>
            <Link href="/exam" className="btn-primary">
              <ClipboardCheck className="h-4 w-4" />
              Full CBT
            </Link>
          </>
        }
      />

      {settings?.siteNotice ? (
        <p className="rounded-xl border border-brand-500/20 bg-brand-500/[0.06] px-3.5 py-2.5 text-xs leading-relaxed text-brand-200">
          {settings.siteNotice}
        </p>
      ) : null}

      {activeSession ? (
        <div className="card flex flex-col gap-3 border-amber-500/25 bg-amber-500/[0.05] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-500/15 text-amber-400">
              <Clock3 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">You have an attempt in progress</p>
              <p className="mt-0.5 text-xs text-muted">
                {activeSession.config.title} · {activeSession.questionIds.length} questions. Your
                answers were saved.
              </p>
            </div>
          </div>
          <Link href="/exam/run" className="btn-primary shrink-0 text-xs">
            Resume attempt
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Average score"
          value={`${average}%`}
          hint={`${userResults.length} result${userResults.length === 1 ? "" : "s"} saved`}
          icon={BarChart3}
          accent="brand"
        />
        <StatCard
          label="CBT exams"
          value={rankedResults.length}
          hint={`${userResults.length - rankedResults.length} practice sessions`}
          icon={ClipboardCheck}
          accent="emerald"
        />
        <StatCard
          label="Questions attempted"
          value={questionsAnswered}
          hint={`${performance.overall.accuracy}% overall accuracy`}
          icon={Layers}
          accent="violet"
        />
        <StatCard
          label="Study streak"
          value={`${streak.current} day${streak.current === 1 ? "" : "s"}`}
          hint={streak.studiedToday ? "Already studied today" : "Study today to keep it alive"}
          icon={Flame}
          accent="amber"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <div className="space-y-5">
          <div className="card overflow-hidden">
            <div className="grid gap-5 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
              <div>
                <Badge tone="brand">
                  <Zap className="h-3.5 w-3.5" />
                  Daily challenge
                </Badge>
                <h2 className="mt-3 text-xl font-bold tracking-tight text-ink">
                  {daily?.completed
                    ? `Today's challenge is complete — ${daily.score}%`
                    : "Ten questions. One streak. Every day."}
                </h2>
                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted">
                  {daily?.completed
                    ? "You can still review or repeat the questions, but today's streak credit is already secured."
                    : "The daily set is the same for everyone. Finish it to keep your streak and earn the Daily Challenger badge."}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/results/${daily?.resultId ?? lastResult?.id ?? ""}`}
                    className={daily?.completed ? "btn-secondary" : "hidden"}
                  >
                    View today&apos;s result
                  </Link>
                  <Link href="/practice?mode=daily-challenge" className="btn-primary">
                    <Play className="h-4 w-4" />
                    {daily?.completed ? "Repeat challenge" : "Start daily challenge"}
                  </Link>
                  <Link href="/planner" className="btn-ghost text-xs">
                    Study planner
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center sm:justify-end">
                <ScoreRing score={daily?.score ?? 0} size={132} stroke={10} label="Daily score" />
              </div>
            </div>
            <div className="border-t border-line/10 bg-white/[0.02] px-5 py-3 sm:px-6">
              <p className="flex flex-wrap items-center gap-2 text-[11px] text-muted">
                <CalendarCheck className="h-3.5 w-3.5 text-brand-400" />
                {daily?.completed ? "Completed" : "Not started"} ·{" "}
                {new Date().toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>

          <div className="card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-ink">Score trend</h2>
                <p className="mt-0.5 text-xs text-muted">
                  Every saved result from most recent eight sessions.
                </p>
              </div>
              <Link href="/results" className="text-xs font-medium text-brand-400 hover:text-brand-300">
                All results
              </Link>
            </div>
            {trend.length ? (
              <div className="mt-4">
                <ScoreTrendChart data={trend} />
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-line/20 p-8 text-center">
                <BarChart3 className="mx-auto h-8 w-8 text-muted/50" />
                <p className="mt-2 text-sm font-medium text-ink">Your first result starts the chart</p>
                <p className="mt-1 text-xs text-muted">
                  Complete any practice session or CBT to see your progress here.
                </p>
                <Link href="/practice" className="btn-primary mt-4 text-xs">
                  Start a quick practice
                </Link>
              </div>
            )}
          </div>

          <div className="card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-ink">Subject accuracy</h2>
                <p className="mt-0.5 text-xs text-muted">
                  Based on the answers you have actually submitted.
                </p>
              </div>
              <Link href="/subjects" className="text-xs font-medium text-brand-400 hover:text-brand-300">
                Subjects
              </Link>
            </div>
            {performance.subjects.length ? (
              <div className="mt-4">
                <SubjectAccuracyChart
                  data={performance.subjects.map((subject) => ({
                    subject: subject.subject,
                    accuracy: subject.accuracy,
                    attempted: subject.attempted
                  }))}
                />
              </div>
            ) : (
              <p className="mt-4 rounded-xl border border-dashed border-line/20 p-6 text-center text-xs text-muted">
                Answer a few questions and this chart will show your strongest and weakest subjects.
              </p>
            )}
          </div>

          <div className="card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-ink">Recent results</h2>
                <p className="mt-0.5 text-xs text-muted">Open any attempt for a full explanation review.</p>
              </div>
              <Link href="/results" className="text-xs font-medium text-brand-400 hover:text-brand-300">
                View all
              </Link>
            </div>
            {userResults.length ? (
              <div className="mt-4 divide-y divide-line/10">
                {userResults.slice(0, 4).map((result) => (
                  <Link
                    key={result.id}
                    href={`/results/${result.id}`}
                    className="flex items-center gap-3 py-3 transition hover:opacity-80"
                  >
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-bold ${
                        result.percentage >= 50
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-rose-500/10 text-rose-400"
                      }`}
                    >
                      {result.percentage}%
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{result.title}</p>
                      <p className="text-[11px] text-muted">
                        {MODE_LABELS[result.mode]} · {result.correct}/{result.total} correct ·{" "}
                        {timeAgo(result.completedAt)}
                      </p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted" />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-4 rounded-xl border border-dashed border-line/20 p-6 text-center text-xs text-muted">
                No results yet. Your first attempt will appear here immediately.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-gold" />
              <h2 className="text-sm font-semibold text-ink">Your rank</h2>
              <Link href="/leaderboard" className="ml-auto text-[11px] text-brand-400 hover:text-brand-300">
                Leaderboard
              </Link>
            </div>
            {user.isGuest ? (
              <p className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-400">
                Guests are not ranked. Create a free account to join the board.
              </p>
            ) : board.personal ? (
              <div className="mt-3 flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-gold to-amber-600 text-lg font-bold text-slate-950">
                  #{board.personal.rank}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {board.personal.rank <= 3 ? "Podium position" : "Keep climbing"}
                  </p>
                  <p className="text-[11px] text-muted">
                    {board.personal.averageScore}% average · {board.personal.points} points
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-xs leading-relaxed text-muted">
                Complete a full CBT to enter the leaderboard. Practice sessions do not count.
              </p>
            )}
            {board.entries.length ? (
              <div className="mt-4 space-y-2">
                {board.entries.slice(0, 3).map((entry) => (
                  <div key={entry.userId} className="flex items-center gap-2.5">
                    <span className="w-5 text-center text-[11px] font-bold text-muted">
                      {entry.rank}
                    </span>
                    <Avatar name={entry.displayName} src={entry.avatar} size="xs" />
                    <span className="min-w-0 flex-1 truncate text-xs text-ink">
                      {entry.displayName}
                    </span>
                    <span className="text-[11px] font-semibold text-brand-400">
                      {entry.averageScore}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-[11px] text-muted">No ranked attempts yet.</p>
            )}
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-rose-400" />
              <h2 className="text-sm font-semibold text-ink">Weak topics</h2>
            </div>
            {performance.weakestTopics.length ? (
              <div className="mt-3 space-y-2.5">
                {performance.weakestTopics.slice(0, 4).map((topic) => (
                  <div key={`${topic.subject}-${topic.topic}`}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="truncate font-medium text-ink">{topic.topic}</span>
                      <span className="ml-2 shrink-0 tabular-nums text-muted">
                        {topic.accuracy}%
                      </span>
                    </div>
                    <Progress value={topic.accuracy} className="mt-1.5 h-1.5" />
                  </div>
                ))}
                <Link href="/practice?mode=weakness-training" className="btn-secondary mt-2 w-full text-xs">
                  Train weak topics
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <p className="mt-3 text-xs leading-relaxed text-muted">
                Answer at least three questions in a topic to unlock weakness analysis. Until then,
                try a mixed practice session.
              </p>
            )}
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-brand-400" />
              <h2 className="text-sm font-semibold text-ink">Plan next</h2>
              <Link href="/planner" className="ml-auto text-[11px] text-brand-400 hover:text-brand-300">
                Planner
              </Link>
            </div>
            {nextTasks.length ? (
              <div className="mt-3 space-y-2">
                {nextTasks.map((task) => (
                  <div key={task.id} className="flex items-start gap-2.5 rounded-lg border border-line/10 p-2.5">
                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border border-line/25" />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-ink">{task.title}</p>
                      <p className="text-[10px] text-muted">
                        {task.subject} · due {formatDate(task.dueDate)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-xs leading-relaxed text-muted">
                No tasks scheduled. Add a target exam date and weekly plan to keep momentum.
              </p>
            )}
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2">
              <Medal className="h-4 w-4 text-violet-400" />
              <h2 className="text-sm font-semibold text-ink">Achievements</h2>
              <Link href="/achievements" className="ml-auto text-[11px] text-brand-400 hover:text-brand-300">
                All badges
              </Link>
            </div>
            <p className="mt-2 text-[11px] text-muted">
              {achievements.filter((achievement) => achievement.unlocked).length} of {achievements.length} unlocked ·{" "}
              {points} badge points
            </p>
            <div className="mt-3 space-y-3">
              {topAchievements.map((achievement) => (
                <div key={achievement.definition.id}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="truncate font-medium text-ink">{achievement.definition.title}</span>
                    <span className="ml-2 text-[10px] text-muted">
                      {achievement.progressPercent}%
                    </span>
                  </div>
                  <Progress value={achievement.progressPercent} className="mt-1.5 h-1.5" />
                </div>
              ))}
              {!topAchievements.length ? (
                <p className="flex items-center gap-2 text-xs text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Every achievement unlocked. Outstanding.
                </p>
              ) : null}
            </div>
          </div>

          <div className="card border-brand-500/20 p-5">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-cyan-400" />
              <h2 className="text-sm font-semibold text-ink">Question of the day</h2>
              <span className="ml-auto text-[10px] text-muted">{todayQuestion.topic}</span>
            </div>
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink">{todayQuestion.text}</p>
            <Link
              href={`/subjects/${todayQuestion.subject}`}
              className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-brand-400 hover:text-brand-300"
            >
              Explore {todayQuestion.topic}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {unread ? (
            <Link
              href="/notifications"
              className="card card-hover flex items-center gap-3 border-brand-500/25 p-4"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500/10 text-brand-400">
                <Award className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-semibold text-ink">{unread} unread notification{unread === 1 ? "" : "s"}</p>
                <p className="text-[10px] text-muted">Results, achievements and announcements</p>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-muted" />
            </Link>
          ) : null}
        </div>
      </div>

      {!userResults.length ? (
        <EmptyState
          icon={Sparkles}
          title="Your baseline attempt is waiting"
          description="Take a short quick practice to establish your first accuracy score. It takes about ten minutes and every answer is explained."
          action={{ label: "Start quick practice", href: "/practice?mode=quick-practice" }}
        />
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/exam", label: "Full CBT simulation", icon: ClipboardCheck, hint: "Timed paper" },
          { href: "/subjects", label: "All 16 subjects", icon: BookOpen, hint: "Browse topics" },
          { href: "/library", label: "Bookmarks & notes", icon: Layers, hint: "Your revision library" },
          { href: "/leaderboard", label: "Leaderboard", icon: Trophy, hint: "Honest rankings" }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="card card-hover flex items-center gap-3 p-4">
              <span className="grid h-9 w-9 place-items-center rounded-xl border border-line/10 bg-white/[0.03] text-brand-400">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-semibold text-ink">{item.label}</p>
                <p className="text-[10px] text-muted">{item.hint}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <p className="text-center text-[11px] text-muted">
        Weekly totals: {weekly?.exams ?? 0} exams · {weekly?.questions ?? 0} questions ·{" "}
        {weekly?.minutes ?? 0} minutes.{" "}
        {weekly?.change !== null && weekly?.change !== undefined
          ? `Average ${weekly.change >= 0 ? "up" : "down"} ${Math.abs(weekly.change)} points vs last week.`
          : "Complete more sessions to compare weeks."}
      </p>
    </div>
  );
}
