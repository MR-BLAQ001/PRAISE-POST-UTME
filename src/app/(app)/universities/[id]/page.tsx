"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  MapPin,
  ShieldAlert,
  Star,
  Target
} from "lucide-react";
import { SubjectIcon } from "@/components/subjects/subject-icon";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { useApp } from "@/components/providers/app-provider";
import { useToast } from "@/components/providers/toast-provider";
import { getUniversity } from "@/lib/universities";
import { SUBJECTS } from "@/lib/subjects";

export default function UniversityDetailPage() {
  const params = useParams<{ id: string }>();
  const toast = useToast();
  const { user, plan, updatePlan } = useApp();
  const university = getUniversity(params.id);

  if (!user) return null;

  if (!university) {
    return (
      <div className="mx-auto max-w-xl">
        <EmptyState
          icon={Building2}
          title="University not found"
          description="That institution is not in the reference set. Browse the available university guides."
          action={{ label: "View universities", href: "/universities" }}
        />
      </div>
    );
  }

  const isTarget = plan.targetUniversityId === university.id;
  const mappedSubjects = university.postUtmeSubjects
    .map((name) =>
      SUBJECTS.find(
        (subject) =>
          subject.name.toLowerCase() === name.toLowerCase() ||
          subject.shortName.toLowerCase() === name.toLowerCase()
      )
    )
    .filter((subject): subject is (typeof SUBJECTS)[number] => Boolean(subject));

  const setTarget = () => {
    updatePlan({ ...plan, targetUniversityId: isTarget ? null : university.id });
    toast.success(
      isTarget ? "Target removed" : "Target university saved",
      isTarget
        ? "Your dashboard will no longer feature this institution."
        : `${university.name} is now on your dashboard.`
    );
  };

  return (
    <div className="space-y-5">
      <Link
        href="/universities"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All universities
      </Link>

      <div className="card overflow-hidden">
        <div className="bg-gradient-to-br from-brand-600/20 via-card to-cyan-500/10 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-cyan-500 text-white shadow-glow">
                <GraduationCap className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge tone="brand">{university.abbreviation}</Badge>
                  <Badge tone={university.type === "Federal" ? "cyan" : "neutral"}>
                    {university.type}
                  </Badge>
                  <Badge tone="neutral">Est. {university.established}</Badge>
                  {isTarget ? <Badge tone="gold">Your target</Badge> : null}
                </div>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink">
                  {university.name}
                </h1>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                  <MapPin className="h-3.5 w-3.5" />
                  {university.city}, {university.state} State
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={setTarget}
                className={isTarget ? "btn-secondary" : "btn-primary"}
              >
                <Star className={isTarget ? "h-4 w-4 text-gold" : "h-4 w-4"} />
                {isTarget ? "Remove target" : "Set as target"}
              </button>
              <a
                href={university.website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Official website
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">{university.overview}</p>
        </div>
        <div className="grid grid-cols-2 gap-px border-t border-line/10 bg-line/10 sm:grid-cols-4">
          {[
            { label: "Faculties", value: university.faculties.length },
            { label: "Courses listed", value: university.courses.length },
            { label: "POST-UTME subjects", value: university.postUtmeSubjects.length },
            { label: "State", value: university.state }
          ].map((item) => (
            <div key={item.label} className="bg-card px-4 py-3">
              <p className="text-[10px] uppercase tracking-wide text-muted">{item.label}</p>
              <p className="mt-0.5 text-sm font-bold text-ink">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <div className="card p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Target className="h-4 w-4 text-brand-400" />
              Subject combinations
            </h2>
            <p className="mt-0.5 text-[11px] text-muted">
              Typical combinations for popular courses. Confirm your exact course requirements on the
              official website.
            </p>
            <div className="mt-3 space-y-2">
              {university.subjectCombinations.map((combination) => (
                <div
                  key={combination.course}
                  className="rounded-xl border border-line/10 bg-white/[0.02] p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <p className="text-xs font-semibold text-ink">{combination.course}</p>
                    <div className="flex flex-wrap gap-1">
                      {combination.subjects.map((name) => {
                        const subject = SUBJECTS.find(
                          (item) =>
                            item.name.toLowerCase() === name.toLowerCase() ||
                            item.shortName.toLowerCase() === name.toLowerCase()
                        );
                        return subject ? (
                          <Link
                            key={name}
                            href={`/subjects/${subject.slug}`}
                            className="chip hover:border-brand-500/40 hover:text-brand-300"
                          >
                            {subject.shortName}
                          </Link>
                        ) : (
                          <span key={name} className="chip">
                            {name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
              <BookOpen className="h-4 w-4 text-cyan-400" />
              Faculties & courses
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                  Faculties
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {university.faculties.map((faculty) => (
                    <span key={faculty} className="chip">
                      {faculty}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                  Courses
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {university.courses.map((course) => (
                    <span key={course} className="chip">
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              General requirements
            </h2>
            <ul className="mt-3 space-y-2">
              {university.requirements.map((requirement) => (
                <li
                  key={requirement}
                  className="flex items-start gap-2 text-xs leading-relaxed text-muted"
                >
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  {requirement}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-500/25 bg-amber-500/[0.06] p-3">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <p className="text-[11px] leading-relaxed text-amber-300">
                {university.verificationNote}
              </p>
            </div>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="card p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-400">
              POST-UTME subjects
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Commonly required subjects. Verify the exact list for your course.
            </p>
            <div className="mt-3 space-y-2">
              {mappedSubjects.map((subject) => (
                <Link
                  key={subject.slug}
                  href={`/subjects/${subject.slug}`}
                  className="flex items-center gap-2.5 rounded-xl border border-line/10 bg-white/[0.02] p-2.5 transition hover:border-brand-500/30"
                >
                  <SubjectIcon subject={subject.slug} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-ink">{subject.name}</p>
                    <p className="text-[10px] text-muted">
                      {subject.topics.length} topics to revise
                    </p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted" />
                </Link>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink">
              <CalendarCheck className="h-4 w-4 text-violet-400" />
              Plan towards this school
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Set a target exam date and weekly goal in your planner. Your dashboard will track
              progress against it.
            </p>
            <Link href="/planner" className="btn-secondary mt-3 w-full text-xs">
              Open study planner
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="card border-brand-500/20 p-5">
            <p className="flex items-center gap-2 text-xs font-semibold text-ink">
              <ShieldAlert className="h-3.5 w-3.5 text-brand-400" />
              Independent reference
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted">
              PRAISE POST UTME is not affiliated with {university.abbreviation}. Information here is
              general guidance only. Always confirm admission details on the official website.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
