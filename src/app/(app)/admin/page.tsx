"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  Database,
  FileQuestion,
  Flag,
  Gauge,
  ListChecks,
  Settings,
  ShieldCheck,
  Upload,
  Users
} from "lucide-react";
import { SubjectIcon } from "@/components/subjects/subject-icon";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/ui/stat-card";
import { useApp } from "@/components/providers/app-provider";
import { bankStats, questionCountsBySubject } from "@/lib/questions";
import { SUBJECTS, subjectName } from "@/lib/subjects";
import { MODE_LABELS, formatDate, timeAgo } from "@/lib/utils";
import type { ActivityEvent } from "@/lib/types";

const ACTIVITY_STYLES: Record<ActivityEvent["type"], { tone: string; label: string }> = {
  exam: { tone: "bg-brand-500/10 text-brand-400", label: "Exam" },
  practice: { tone: "bg-emerald-500/10 text-emerald-400", label: "Practice" },
  account: { tone: "bg-violet-500/10 text-violet-400", label: "Account" },
  admin: { tone: "bg-amber-500/10 text-amber-400", label: "Admin" },
  question: { tone: "bg-rose-500/10 text-rose-400", label: "Question" }
};

export default function AdminOverviewPage() {
  const {
    user,
    db,
    questionBank,
    allStudents,
    adminResults,
    reports,
    settings
  } = useApp();

  const stats = useMemo(() => bankStats(), []);
  const counts = useMemo(() => questionCountsBySubject(), []);
  const students = allStudents.filter((profile) => profile.role === "student");
  const openReports = reports.filter((report) => report.status === "open");
  const customCount = db?.customQuestions.length ?? 0;
  const overrideCount = Object.keys(db?.overrides ?? {}).length;
  const deletedCount = db?.deletedQuestionIds.length ?? 0;
  const seedCount = stats.total;
  const activeStudents = students.filter(
    (profile) =>
      Date.now() - new Date(profile.lastActiveAt).getTime() < 7 * 86_400_000
  ).length;
  const averageScore = adminResults.length
    ? Math.round(
        adminResults.reduce((sum, result) => sum + result.percentage, 0) / adminResults.length
      )
    : 0;
  const recentResults = adminResults.slice(0, 5);
  const activities = [...(db?.activities ?? [])]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  if (!user || !db) return null;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Administrator"
        title="Platform overview"
        description="Question bank health, student activity and moderation in one place. All figures come from real submissions on this device."
        actions={
          <>
            <Link href="/admin/import" className="btn-secondary">
              <Upload className="h-4 w-4" />
              Import
            </Link>
            <Link href="/admin/questions" className="btn-primary">
              <ListChecks className="h-4 w-4" />
              Question bank
            </Link>
          </>
        }
      />

      {settings?.maintenance ? (
        <div className="card flex items-center gap-3 border-amber-500/25 bg-amber-500/[0.06] p-4">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400" />
          <div>
            <p className="text-sm font-semibold text-amber-400">Maintenance mode is active</p>
            <p className="text-[11px] text-muted">
              Students see a maintenance banner. Update this in platform settings.
            </p>
          </div>
          <Link href="/admin/settings" className="btn-secondary ml-auto shrink-0 text-xs">
            Settings
          </Link>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Students"
          value={students.length}
          hint={`${activeStudents} active in the last 7 days`}
          icon={Users}
          accent="brand"
        />
        <StatCard
          label="Questions in bank"
          value={questionBank.length}
          hint={`${seedCount} seed · ${customCount} custom`}
          icon={BookOpen}
          accent="emerald"
        />
        <StatCard
          label="Completed attempts"
          value={adminResults.length}
          hint={`${averageScore}% average score`}
          icon={ClipboardCheck}
          accent="violet"
        />
        <StatCard
          label="Open reports"
          value={openReports.length}
          hint={`${reports.length} reports in total`}
          icon={Flag}
          accent="rose"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
        <div className="space-y-5">
          <div className="card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <Gauge className="h-4 w-4 text-brand-400" />
                  Question bank health
                </h2>
                <p className="mt-0.5 text-[11px] text-muted">
                  Coverage per subject. Every seed subject carries fifty questions.
                </p>
              </div>
              <Badge tone="success">{questionBank.length} active</Badge>
            </div>
            <div className="mt-4 grid gap-x-5 gap-y-2.5 sm:grid-cols-2">
              {SUBJECTS.map((subject) => {
                const count = counts[subject.slug] ?? 0;
                return (
                  <div key={subject.slug}>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex min-w-0 items-center gap-1.5 text-muted">
                        <SubjectIcon
                          subject={subject.slug}
                          size="sm"
                          className="h-4 w-4 rounded [&>svg]:h-2.5 [&>svg]:w-2.5"
                        />
                        <span className="truncate">{subject.shortName}</span>
                      </span>
                      <span className="ml-2 shrink-0 font-semibold text-ink">{count}</span>
                    </div>
                    <Progress
                      value={(count / 50) * 100}
                      className="mt-1 h-1"
                      barClassName={count >= 50 ? "bg-emerald-500" : "bg-amber-500"}
                    />
                  </div>
                );
              })}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-line/10 bg-white/[0.02] p-2.5">
                <p className="text-[10px] uppercase tracking-wide text-muted">Custom</p>
                <p className="text-sm font-bold text-ink">{customCount}</p>
              </div>
              <div className="rounded-xl border border-line/10 bg-white/[0.02] p-2.5">
                <p className="text-[10px] uppercase tracking-wide text-muted">Edited seeds</p>
                <p className="text-sm font-bold text-ink">{overrideCount}</p>
              </div>
              <div className="rounded-xl border border-line/10 bg-white/[0.02] p-2.5">
                <p className="text-[10px] uppercase tracking-wide text-muted">Removed</p>
                <p className="text-sm font-bold text-ink">{deletedCount}</p>
              </div>
            </div>
          </div>

          <div className="card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
                <ClipboardCheck className="h-4 w-4 text-emerald-400" />
                Recent submissions
              </h2>
              <Link href="/admin/students" className="text-[11px] text-brand-400 hover:text-brand-300">
                Students
              </Link>
            </div>
            {recentResults.length ? (
              <div className="mt-3 divide-y divide-line/10">
                {recentResults.map((result) => (
                  <div key={result.id} className="flex items-center gap-3 py-2.5">
                    <span
                      className={
                        result.percentage >= 50
                          ? "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-xs font-bold text-emerald-400"
                          : "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-rose-500/10 text-xs font-bold text-rose-400"
                      }
                    >
                      {result.percentage}%
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-ink">{result.title}</p>
                      <p className="truncate text-[10px] text-muted">
                        {result.userName} · {MODE_LABELS[result.mode]} · {timeAgo(result.completedAt)}
                      </p>
                    </div>
                    <Badge tone={result.validation === "server" ? "success" : "warning"}>
                      {result.validation === "server" ? "Verified" : "Local"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 rounded-xl border border-dashed border-line/20 p-6 text-center text-xs text-muted">
                No attempts recorded yet. Results will appear here as students complete sessions.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Activity className="h-4 w-4 text-cyan-400" />
              Activity feed
            </h2>
            {activities.length ? (
              <div className="mt-3 space-y-2.5">
                {activities.map((activity) => {
                  const style = ACTIVITY_STYLES[activity.type] ?? ACTIVITY_STYLES.account;
                  return (
                    <div key={activity.id} className="flex items-start gap-2.5">
                      <span className={`mt-0.5 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase ${style.tone}`}>
                        {style.label}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] leading-relaxed text-ink">{activity.message}</p>
                        <p className="text-[10px] text-muted">{timeAgo(activity.createdAt)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-3 text-[11px] text-muted">No platform activity recorded yet.</p>
            )}
          </div>

          {openReports.length ? (
            <div className="card border-rose-500/20 p-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Flag className="h-4 w-4 text-rose-400" />
                Reports needing review
              </h2>
              <div className="mt-3 space-y-2">
                {openReports.slice(0, 3).map((report) => (
                  <div key={report.id} className="rounded-xl border border-line/10 p-2.5">
                    <p className="text-[11px] font-medium text-ink">{report.reason}</p>
                    <p className="mt-0.5 text-[10px] text-muted">
                      {subjectName(report.subject)} · {report.userName} · {formatDate(report.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
              <Link href="/admin/reports" className="btn-secondary mt-3 w-full text-xs">
                Review reports
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : null}

          <div className="card p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Database className="h-4 w-4 text-violet-400" />
              Quick actions
            </h2>
            <div className="mt-3 grid gap-2">
              {[
                { href: "/admin/questions", label: "Manage question bank", icon: ListChecks },
                { href: "/admin/import", label: "Import CSV or JSON", icon: Upload },
                { href: "/admin/students", label: "View students", icon: Users },
                { href: "/admin/reports", label: "Moderate reports", icon: FileQuestion },
                { href: "/admin/settings", label: "Platform settings", icon: Settings }
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex items-center gap-2.5 rounded-xl border border-line/10 p-2.5 text-xs font-medium text-ink transition hover:border-brand-500/30 hover:bg-white/[0.03]"
                  >
                    <Icon className="h-3.5 w-3.5 text-brand-400" />
                    {action.label}
                    <ArrowRight className="ml-auto h-3.5 w-3.5 text-muted" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="card p-4">
            <p className="flex items-center gap-2 text-[11px] font-semibold text-ink">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Data integrity
            </p>
            <p className="mt-1 text-[10px] leading-relaxed text-muted">
              Seed questions are scored by the server API. Edited or custom questions fall back to
              local demo scoring and are clearly labelled in results. No student email is exposed in
              this admin view.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
