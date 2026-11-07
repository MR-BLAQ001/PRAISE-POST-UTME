"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  Award,
  CheckCircle2,
  Download,
  Eye,
  GraduationCap,
  Mail,
  Search,
  ShieldCheck,
  ShieldOff,
  Trash2,
  UserCog,
  Users
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { useApp } from "@/components/providers/app-provider";
import { useToast } from "@/components/providers/toast-provider";
import { RANKED_MODES } from "@/lib/exam";
import { UNIVERSITIES } from "@/lib/universities";
import { subjectName } from "@/lib/subjects";
import { cn, downloadFile, formatDate, timeAgo } from "@/lib/utils";
import type { UserProfile } from "@/lib/types";

type RoleFilter = "all" | "student" | "admin";

interface StudentRow {
  profile: UserProfile;
  results: number;
  ranked: number;
  average: number;
  best: number;
  practice: number;
  bookmarks: number;
  notes: number;
  reports: number;
  lastResultAt: string | null;
}

export default function AdminStudentsPage() {
  const toast = useToast();
  const {
    db,
    allStudents,
    adminResults,
    updateUserAsAdmin,
    removeUserAsAdmin
  } = useApp();

  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [sort, setSort] = useState<"newest" | "active" | "score" | "attempts">("active");
  const [selected, setSelected] = useState<StudentRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StudentRow | null>(null);

  const rows = useMemo<StudentRow[]>(() => {
    if (!db) return [];
    return allStudents.map((profile) => {
      const results = adminResults.filter((result) => result.userId === profile.id);
      const rankedResults = results.filter((result) => RANKED_MODES.includes(result.mode));
      const average = results.length
        ? Math.round(results.reduce((sum, result) => sum + result.percentage, 0) / results.length)
        : 0;
      const best = results.reduce((max, result) => Math.max(max, result.percentage), 0);
      return {
        profile,
        results: results.length,
        ranked: rankedResults.length,
        average,
        best,
        practice: db.practice.filter((attempt) => attempt.userId === profile.id).length,
        bookmarks: db.bookmarks.filter((entry) => entry.userId === profile.id).length,
        notes: db.notes.filter((entry) => entry.userId === profile.id).length,
        reports: db.reports.filter((entry) => entry.userId === profile.id).length,
        lastResultAt: results.length
          ? results.reduce(
              (latest, result) =>
                new Date(result.completedAt).getTime() > new Date(latest).getTime()
                  ? result.completedAt
                  : latest,
              results[0].completedAt
            )
          : null
      };
    });
  }, [allStudents, adminResults, db]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const items = rows.filter((row) => {
      if (roleFilter !== "all" && row.profile.role !== roleFilter) return false;
      if (!needle) return true;
      return (
        row.profile.displayName.toLowerCase().includes(needle) ||
        row.profile.username.toLowerCase().includes(needle) ||
        row.profile.email.toLowerCase().includes(needle) ||
        row.profile.school.toLowerCase().includes(needle)
      );
    });
    return [...items].sort((a, b) => {
      if (sort === "newest") {
        return (
          new Date(b.profile.createdAt).getTime() - new Date(a.profile.createdAt).getTime()
        );
      }
      if (sort === "score") return b.average - a.average;
      if (sort === "attempts") return b.results - a.results;
      return (
        new Date(b.profile.lastActiveAt).getTime() -
        new Date(a.profile.lastActiveAt).getTime()
      );
    });
  }, [rows, query, roleFilter, sort]);

  const students = rows.filter((row) => row.profile.role === "student");
  const admins = rows.filter((row) => row.profile.role === "admin");
  const activeWeek = rows.filter(
    (row) => Date.now() - new Date(row.profile.lastActiveAt).getTime() < 7 * 86_400_000
  ).length;
  const rankedStudents = students.filter((row) => row.ranked > 0).length;
  const averageScore = students.length
    ? Math.round(
        students.reduce((sum, row) => sum + (row.results ? row.average : 0), 0) /
          Math.max(1, students.filter((row) => row.results).length)
      )
    : 0;

  const toggleRole = (row: StudentRow) => {
    const nextRole = row.profile.role === "admin" ? "student" : "admin";
    const outcome = updateUserAsAdmin(row.profile.id, { role: nextRole });
    if (outcome.ok) {
      toast.success(
        nextRole === "admin" ? "Administrator granted" : "Administrator removed",
        `${row.profile.displayName} is now ${nextRole === "admin" ? "an administrator" : "a student"}.`
      );
      setSelected(null);
    } else {
      toast.error("Could not update role", outcome.error);
    }
  };

  const toggleOptOut = (row: StudentRow) => {
    const next = !row.profile.leaderboardOptOut;
    const outcome = updateUserAsAdmin(row.profile.id, { leaderboardOptOut: next });
    if (outcome.ok) {
      toast.success(
        next ? "Hidden from leaderboard" : "Visible on leaderboard",
        `${row.profile.displayName}'s preference has been updated.`
      );
      setSelected(null);
    } else {
      toast.error("Could not update preference", outcome.error);
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const outcome = removeUserAsAdmin(deleteTarget.profile.id);
    if (outcome.ok) {
      toast.info("Account removed", "Their results, notes and bookmarks were deleted too.");
      setDeleteTarget(null);
      setSelected(null);
    } else {
      toast.error("Could not remove account", outcome.error);
    }
  };

  const exportStudents = () => {
    const data = [
      [
        "Display name",
        "Username",
        "Email",
        "Role",
        "School",
        "Attempts",
        "Ranked CBTs",
        "Average",
        "Best",
        "Practice answers",
        "Leaderboard hidden",
        "Joined",
        "Last active"
      ],
      ...filtered.map((row) => [
        row.profile.displayName,
        row.profile.username,
        row.profile.email,
        row.profile.role,
        row.profile.school,
        row.results,
        row.ranked,
        row.average,
        row.best,
        row.practice,
        row.profile.leaderboardOptOut ? "Yes" : "No",
        row.profile.createdAt,
        row.profile.lastActiveAt
      ])
    ];
    downloadFile(
      `praise-students-${new Date().toISOString().slice(0, 10)}.csv`,
      data
        .map((line) => line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        .join("\n"),
      "text/csv"
    );
  };

  const selectedUniversity = selected?.profile.universityId
    ? UNIVERSITIES.find((item) => item.id === selected.profile.universityId)
    : null;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Administration"
        title="Students & access"
        description="Real accounts on this device, with genuine activity. Use this screen to review progress, manage administrator access and respect leaderboard preferences."
        actions={
          <button
            type="button"
            onClick={exportStudents}
            className="btn-secondary"
            disabled={!filtered.length}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Registered students"
          value={students.length}
          hint={`${admins.length} administrator${admins.length === 1 ? "" : "s"}`}
          icon={Users}
          accent="brand"
        />
        <StatCard
          label="Active this week"
          value={activeWeek}
          hint="Based on last activity timestamps"
          icon={Activity}
          accent="emerald"
        />
        <StatCard
          label="Ranked students"
          value={rankedStudents}
          hint="At least one completed CBT"
          icon={Award}
          accent="amber"
        />
        <StatCard
          label="Average score"
          value={`${averageScore}%`}
          hint="Across students with attempts"
          icon={GraduationCap}
          accent="violet"
        />
      </div>

      <div className="card p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                { value: "all", label: "All accounts", count: rows.length },
                { value: "student", label: "Students", count: students.length },
                { value: "admin", label: "Administrators", count: admins.length }
              ] as { value: RoleFilter; label: string; count: number }[]
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setRoleFilter(option.value)}
                aria-pressed={roleFilter === option.value}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
                  roleFilter === option.value
                    ? "border-brand-500/50 bg-brand-500/15 text-brand-300"
                    : "border-line/15 text-muted hover:text-ink"
                )}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name, username or email"
                aria-label="Search students"
                className="input h-9 pl-8 text-xs"
              />
            </div>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as typeof sort)}
              aria-label="Sort students"
              className="input h-9 text-xs"
            >
              <option value="active">Recently active</option>
              <option value="newest">Newest accounts</option>
              <option value="score">Highest average</option>
              <option value="attempts">Most attempts</option>
            </select>
          </div>
        </div>
      </div>

      {filtered.length ? (
        <div className="card overflow-hidden">
          <div className="hidden grid-cols-[1fr_100px_90px_80px_110px_70px] gap-3 border-b border-line/10 bg-white/[0.02] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-muted lg:grid">
            <span>Student</span>
            <span className="text-right">Attempts</span>
            <span className="text-right">Average</span>
            <span className="text-right">Best</span>
            <span>Last active</span>
            <span />
          </div>
          <div className="divide-y divide-line/10">
            {filtered.map((row) => (
              <div
                key={row.profile.id}
                className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 lg:grid-cols-[1fr_100px_90px_80px_110px_70px]"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <Avatar name={row.profile.displayName} src={row.profile.avatar} size="sm" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="truncate text-sm font-medium text-ink">
                        {row.profile.displayName}
                      </p>
                      <Badge tone={row.profile.role === "admin" ? "gold" : "neutral"}>
                        {row.profile.role === "admin" ? "Admin" : "Student"}
                      </Badge>
                      {row.profile.leaderboardOptOut ? (
                        <Badge tone="warning">Hidden</Badge>
                      ) : null}
                    </div>
                    <p className="truncate text-[11px] text-muted">
                      @{row.profile.username}
                      {row.profile.school ? ` · ${row.profile.school}` : ""}
                    </p>
                    <p className="text-[10px] text-muted lg:hidden">
                      {row.results} attempt{row.results === 1 ? "" : "s"} · {row.average}% average ·{" "}
                      {row.best}% best
                    </p>
                  </div>
                </div>
                <p className="hidden text-right text-xs tabular-nums text-muted lg:block">
                  {row.results}
                </p>
                <p className="hidden text-right text-xs font-semibold tabular-nums text-ink lg:block">
                  {row.results ? `${row.average}%` : "—"}
                </p>
                <p className="hidden text-right text-xs tabular-nums text-muted lg:block">
                  {row.results ? `${row.best}%` : "—"}
                </p>
                <p className="hidden text-[11px] text-muted lg:block">
                  {timeAgo(row.profile.lastActiveAt)}
                </p>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelected(row)}
                    aria-label={`View ${row.profile.displayName}`}
                    className="grid h-8 w-8 place-items-center rounded-lg border border-line/15 text-muted transition hover:border-brand-500/40 hover:text-brand-400"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No accounts match your filters"
          description="Try a different search term or role filter. Guest sessions are not stored as accounts."
          action={
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setRoleFilter("all");
              }}
              className="btn-primary"
            >
              Clear filters
            </button>
          }
        />
      )}

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected ? selected.profile.displayName : "Student"}
        description={selected ? `@${selected.profile.username}` : undefined}
        size="lg"
        footer={
          selected ? (
            <>
              <button type="button" onClick={() => setSelected(null)} className="btn-secondary">
                Close
              </button>
              <button
                type="button"
                onClick={() => toggleOptOut(selected)}
                className="btn-secondary"
              >
                {selected.profile.leaderboardOptOut ? (
                  <ShieldCheck className="h-4 w-4" />
                ) : (
                  <ShieldOff className="h-4 w-4" />
                )}
                {selected.profile.leaderboardOptOut ? "Show on leaderboard" : "Hide from leaderboard"}
              </button>
              <button type="button" onClick={() => toggleRole(selected)} className="btn-secondary">
                <UserCog className="h-4 w-4" />
                {selected.profile.role === "admin" ? "Make student" : "Make administrator"}
              </button>
              {selected.profile.id !== "usr_admin" ? (
                <button
                  type="button"
                  onClick={() => setDeleteTarget(selected)}
                  className="btn-primary bg-gradient-to-r from-rose-500 to-rose-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete account
                </button>
              ) : null}
            </>
          ) : null
        }
      >
        {selected ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Avatar
                name={selected.profile.displayName}
                src={selected.profile.avatar}
                size="md"
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge tone={selected.profile.role === "admin" ? "gold" : "brand"}>
                    {selected.profile.role === "admin" ? "Administrator" : "Student"}
                  </Badge>
                  {selected.profile.leaderboardOptOut ? (
                    <Badge tone="warning">Leaderboard hidden</Badge>
                  ) : (
                    <Badge tone="success">Leaderboard visible</Badge>
                  )}
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted">
                  <Mail className="h-3 w-3" />
                  {selected.profile.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { label: "Attempts", value: selected.results },
                { label: "Ranked CBTs", value: selected.ranked },
                { label: "Average", value: selected.results ? `${selected.average}%` : "—" },
                { label: "Best", value: selected.results ? `${selected.best}%` : "—" }
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-line/10 bg-white/[0.02] p-3">
                  <p className="text-[10px] uppercase tracking-wide text-muted">{item.label}</p>
                  <p className="mt-0.5 text-sm font-bold text-ink">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-line/10 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Details</p>
              <div className="mt-2 space-y-1.5 text-[11px]">
                <div className="flex justify-between gap-3">
                  <span className="text-muted">School</span>
                  <span className="text-right font-medium text-ink">
                    {selected.profile.school || "Not provided"}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted">Target university</span>
                  <span className="text-right font-medium text-ink">
                    {selectedUniversity?.name ?? "Not set"}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted">Joined</span>
                  <span className="text-right font-medium text-ink">
                    {formatDate(selected.profile.createdAt, {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted">Last active</span>
                  <span className="text-right font-medium text-ink">
                    {timeAgo(selected.profile.lastActiveAt)}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted">Practice answers</span>
                  <span className="text-right font-medium text-ink">{selected.practice}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted">Bookmarks / notes</span>
                  <span className="text-right font-medium text-ink">
                    {selected.bookmarks} / {selected.notes}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted">Reports submitted</span>
                  <span className="text-right font-medium text-ink">{selected.reports}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted">Last result</span>
                  <span className="text-right font-medium text-ink">
                    {selected.lastResultAt ? timeAgo(selected.lastResultAt) : "No attempts yet"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                Preferred subjects
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {selected.profile.preferredSubjects.length ? (
                  selected.profile.preferredSubjects.map((slug) => (
                    <span key={slug} className="chip">
                      {subjectName(slug)}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-muted">None selected.</span>
                )}
              </div>
            </div>

            {selected.profile.bio ? (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Bio</p>
                <p className="mt-1 text-[11px] leading-relaxed text-muted">{selected.profile.bio}</p>
              </div>
            ) : null}

            <p className="flex items-start gap-1.5 text-[10px] leading-relaxed text-muted">
              <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />
              Only real activity is shown. Guests are excluded, and no score here is seeded.
            </p>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete this account?"
        description="This permanently removes the account and all of its results, notes, bookmarks and reports."
        footer={
          <>
            <button type="button" onClick={() => setDeleteTarget(null)} className="btn-secondary">
              Keep account
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="btn-primary bg-gradient-to-r from-rose-500 to-rose-700"
            >
              <Trash2 className="h-4 w-4" />
              Delete permanently
            </button>
          </>
        }
      >
        <div className="rounded-xl border border-rose-500/25 bg-rose-500/10 p-3 text-xs leading-relaxed text-rose-400">
          {deleteTarget
            ? `${deleteTarget.profile.displayName} (@${deleteTarget.profile.username}) has ${deleteTarget.results} saved attempt${
                deleteTarget.results === 1 ? "" : "s"
              }. This action cannot be undone.`
            : null}
        </div>
      </Modal>
    </div>
  );
}
