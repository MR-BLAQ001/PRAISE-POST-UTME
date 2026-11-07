"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Search,
  Sparkles
} from "lucide-react";
import { SubjectIcon } from "@/components/subjects/subject-icon";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/components/providers/app-provider";
import { questionCountsBySubject } from "@/lib/questions";
import { buildPerformanceProfile } from "@/lib/performance";
import { SUBJECTS } from "@/lib/subjects";
import { cn } from "@/lib/utils";

const GROUPS = ["Science", "Arts & Humanities", "Commercial", "General"] as const;

export default function SubjectsPage() {
  const { user, questionBank, userResults, userPractice } = useApp();
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<"all" | (typeof GROUPS)[number]>("all");

  const counts = useMemo(() => questionCountsBySubject(), []);
  const performance = useMemo(
    () => buildPerformanceProfile(userResults, userPractice, user?.id),
    [userResults, userPractice, user?.id]
  );
  const accuracyBySubject = useMemo(
    () => new Map(performance.subjects.map((entry) => [entry.subject, entry])),
    [performance.subjects]
  );

  const visible = SUBJECTS.filter((subject) => {
    if (group !== "all" && subject.group !== group) return false;
    if (query.trim()) {
      const needle = query.trim().toLowerCase();
      if (
        !subject.name.toLowerCase().includes(needle) &&
        !subject.shortName.toLowerCase().includes(needle) &&
        !subject.topics.some((topic) => topic.toLowerCase().includes(needle))
      ) {
        return false;
      }
    }
    return true;
  });

  if (!user) return null;

  const totalQuestions = questionBank.filter((question) => !question.isCustom).length;
  const attemptedSubjects = performance.subjects.length;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={`${SUBJECTS.length} subjects · ${totalQuestions} questions`}
        title="Browse the syllabus"
        description="Fifty original explained questions per subject, mapped to the topics Nigerian POST-UTME candidates are expected to know."
        actions={
          <Link href="/practice" className="btn-primary">
            <Sparkles className="h-4 w-4" />
            Practice hub
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="card flex items-center gap-3 p-4">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/10 text-brand-400">
            <BookOpen className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] text-muted">Total questions</p>
            <p className="text-lg font-bold text-ink">{totalQuestions}</p>
          </div>
        </div>
        <div className="card flex items-center gap-3 p-4">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <BarChart3 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] text-muted">Subjects attempted</p>
            <p className="text-lg font-bold text-ink">
              {attemptedSubjects} / {SUBJECTS.length}
            </p>
          </div>
        </div>
        <div className="card flex items-center gap-3 p-4">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/10 text-violet-400">
            <BarChart3 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] text-muted">Overall accuracy</p>
            <p className="text-lg font-bold text-ink">{performance.overall.accuracy}%</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {(["all", ...GROUPS] as const).map((option) => {
            const count =
              option === "all"
                ? SUBJECTS.length
                : SUBJECTS.filter((subject) => subject.group === option).length;
            if (!count) return null;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setGroup(option)}
                aria-pressed={group === option}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
                  group === option
                    ? "border-brand-500/50 bg-brand-500/15 text-brand-300"
                    : "border-line/15 text-muted hover:text-ink"
                )}
              >
                {option === "all" ? "All subjects" : option} ({count})
              </button>
            );
          })}
        </div>
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search subjects or topics"
            aria-label="Search subjects or topics"
            className="input h-9 pl-8 text-xs"
          />
        </div>
      </div>

      {visible.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((subject) => {
            const stats = accuracyBySubject.get(subject.slug);
            return (
              <Link
                key={subject.slug}
                href={`/subjects/${subject.slug}`}
                className="card card-hover group flex flex-col p-5"
              >
                <div className="flex items-start gap-3">
                  <SubjectIcon subject={subject.slug} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-sm font-semibold text-ink">{subject.name}</h2>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-brand-400" />
                    </div>
                    <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-brand-400/80">
                      {subject.group}
                    </p>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-muted">
                      {subject.description}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="chip">{counts[subject.slug] ?? 0} questions</span>
                  <span className="chip">{subject.topics.length} topics</span>
                  {stats ? (
                    <Badge tone={stats.accuracy >= 70 ? "success" : stats.accuracy >= 50 ? "warning" : "danger"}>
                      {stats.accuracy}% accuracy
                    </Badge>
                  ) : (
                    <Badge tone="neutral">Not attempted</Badge>
                  )}
                </div>

                {stats ? (
                  <Progress
                    value={stats.accuracy}
                    className="mt-3 h-1.5"
                    barClassName={
                      stats.accuracy >= 70
                        ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                        : stats.accuracy >= 50
                          ? "bg-gradient-to-r from-amber-500 to-orange-400"
                          : "bg-gradient-to-r from-rose-500 to-pink-400"
                    }
                  />
                ) : null}

                <div className="mt-3 flex flex-wrap gap-1">
                  {subject.topics.slice(0, 3).map((topic) => (
                    <span key={topic} className="text-[10px] text-muted">
                      {topic}
                      {subject.topics.indexOf(topic) < 2 ? " ·" : ""}
                    </span>
                  ))}
                  {subject.topics.length > 3 ? (
                    <span className="text-[10px] text-muted">
                      +{subject.topics.length - 3} more
                    </span>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="card p-10 text-center">
          <BookOpen className="mx-auto h-8 w-8 text-muted/50" />
          <p className="mt-2 text-sm font-medium text-ink">No subjects match your search</p>
          <p className="mt-1 text-xs text-muted">
            Try a different topic or clear the search to see all subjects.
          </p>
          <button type="button" onClick={() => setQuery("")} className="btn-secondary mt-4 text-xs">
            Clear search
          </button>
        </div>
      )}

      <div className="card border-brand-500/20 p-5">
        <p className="text-sm font-semibold text-ink">Not sure where to start?</p>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          Take a mixed quick practice first. Your accuracy profile will then highlight the subjects
          and topics that need the most attention, and weakness training will build a session from
          those exact gaps.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/practice?mode=quick-practice" className="btn-primary text-xs">
            Quick practice
          </Link>
          <Link href="/practice?mode=weakness-training" className="btn-secondary text-xs">
            Weakness training
          </Link>
        </div>
      </div>
    </div>
  );
}
