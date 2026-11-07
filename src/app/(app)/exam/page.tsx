"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Info,
  Layers,
  Loader2,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target
} from "lucide-react";
import { SubjectIcon } from "@/components/subjects/subject-icon";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { useApp } from "@/components/providers/app-provider";
import { useToast } from "@/components/providers/toast-provider";
import { createExamSession, loadExamSession, saveExamSession, clearExamSession } from "@/lib/exam";
import { SUBJECTS, subjectName } from "@/lib/subjects";
import { cn } from "@/lib/utils";
import type { Difficulty, ExamConfig, Question } from "@/lib/types";

const QUESTION_PRESETS = [20, 30, 40, 50, 60];
const DURATION_PRESETS = [20, 30, 40, 50, 60];

export default function ExamSetupPage() {
  const router = useRouter();
  const toast = useToast();
  const { user, questionBank, settings } = useApp();

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    "english-language",
    "mathematics",
    "biology",
    "chemistry"
  ]);
  const [perSubject, setPerSubject] = useState(10);
  const [duration, setDuration] = useState(40);
  const [difficulty, setDifficulty] = useState<"mixed" | Difficulty>("mixed");
  const [active, setActive] = useState<ReturnType<typeof loadExamSession>>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    setActive(loadExamSession());
  }, []);

  const availableFor = (slug: string) =>
    questionBank.filter(
      (question) =>
        question.subject === slug &&
        (difficulty === "mixed" || question.difficulty === difficulty)
    ).length;

  const totalRequested = selectedSubjects.length * perSubject;
  const totalAvailable = useMemo(
    () =>
      selectedSubjects.reduce(
        (sum, slug) => sum + Math.min(perSubject, availableFor(slug)),
        0
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedSubjects, perSubject, questionBank, difficulty]
  );

  const toggleSubject = (slug: string) => {
    setSelectedSubjects((current) => {
      if (current.includes(slug)) {
        if (current.length === 1) {
          toast.error("Keep one subject", "A CBT needs at least one subject.");
          return current;
        }
        return current.filter((item) => item !== slug);
      }
      if (current.length >= 4) {
        toast.error("Maximum four subjects", "Full CBT simulations cover four subjects.");
        return current;
      }
      return [...current, slug];
    });
  };

  const startExam = () => {
    if (!user) return;
    if (!selectedSubjects.length) {
      toast.error("Choose your subjects", "Select at least one subject to continue.");
      return;
    }
    if (totalAvailable === 0) {
      toast.error("No questions available", "Try mixed difficulty or different subjects.");
      return;
    }
    setStarting(true);

    const chosen: Question[] = [];
    for (const slug of selectedSubjects) {
      const pool = questionBank.filter(
        (question) =>
          question.subject === slug &&
          (difficulty === "mixed" || question.difficulty === difficulty)
      );
      const shuffled = [...pool];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      chosen.push(...shuffled.slice(0, Math.min(perSubject, shuffled.length)));
    }

    const config: ExamConfig = {
      mode: "full-cbt",
      subjects: selectedSubjects,
      topics: Array.from(new Set(chosen.map((question) => question.topic))),
      questionCount: chosen.length,
      durationMinutes: duration,
      difficulty,
      title: "Full CBT Simulation"
    };

    saveExamSession(createExamSession(config, chosen));
    toast.success("Examination armed", `${chosen.length} questions · ${duration} minutes.`);
    router.push("/exam/run");
  };

  const resume = () => {
    if (!active) return;
    router.push("/exam/run");
  };

  const discard = () => {
    clearExamSession();
    setActive(null);
    toast.info("Attempt discarded", "You can start a fresh simulation now.");
  };

  if (!user) return null;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Full CBT simulation"
        title="Set up your exam"
        description="A timed paper across up to four subjects with the full CBT experience — palette, mark-for-review, autosave and automatic submission."
        actions={
          <Link href="/practice" className="btn-secondary">
            <Sparkles className="h-4 w-4" />
            Practice modes
          </Link>
        }
      />

      {active ? (
        <div className="card flex flex-col gap-3 border-amber-500/25 bg-amber-500/[0.05] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-500/15 text-amber-400">
              <Clock3 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">You have an attempt in progress</p>
              <p className="mt-0.5 text-xs text-muted">
                {active.config.title} · {active.questionIds.length} questions · started{" "}
                {new Date(active.startedAt).toLocaleString("en-NG")}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <button type="button" onClick={discard} className="btn-secondary text-xs">
              <RotateCcw className="h-3.5 w-3.5" />
              Discard
            </button>
            <button type="button" onClick={resume} className="btn-primary text-xs">
              Resume attempt
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <div className="card p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-semibold text-ink">Choose up to four subjects</h2>
                <p className="mt-0.5 text-xs text-muted">
                  English Language is compulsory for most courses. Pick the subjects you will write.
                </p>
              </div>
              <Badge tone={selectedSubjects.length === 4 ? "success" : "neutral"}>
                {selectedSubjects.length} of 4 selected
              </Badge>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {SUBJECTS.map((subject) => {
                const selected = selectedSubjects.includes(subject.slug);
                const count = availableFor(subject.slug);
                return (
                  <button
                    key={subject.slug}
                    type="button"
                    onClick={() => toggleSubject(subject.slug)}
                    aria-pressed={selected}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-3 text-left transition",
                      selected
                        ? "border-brand-500/50 bg-brand-500/10"
                        : "border-line/15 bg-white/[0.02] hover:border-line/30"
                    )}
                  >
                    <SubjectIcon subject={subject.slug} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-ink">{subject.name}</p>
                      <p className="text-[10px] text-muted">
                        {count} available · {subject.topics.length} topics
                      </p>
                    </div>
                    <span
                      className={cn(
                        "grid h-4 w-4 shrink-0 place-items-center rounded-full border",
                        selected
                          ? "border-brand-400 bg-brand-500 text-white"
                          : "border-line/30"
                      )}
                    >
                      {selected ? <CheckCircle2 className="h-3 w-3" /> : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card p-5 sm:p-6">
            <h2 className="text-base font-semibold text-ink">Exam structure</h2>
            <p className="mt-0.5 text-xs text-muted">
              Match your target institution&apos;s pattern, or build exam stamina with a longer paper.
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="label">Questions per subject</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUESTION_PRESETS.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setPerSubject(value)}
                      aria-pressed={perSubject === value}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-xs font-semibold transition",
                        perSubject === value
                          ? "border-brand-500/50 bg-brand-500/15 text-brand-300"
                          : "border-line/15 text-muted hover:text-ink"
                      )}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <p className="mt-1.5 text-[11px] text-muted">
                  {totalAvailable} of {totalRequested} requested questions available.
                </p>
              </div>

              <div>
                <p className="label">Duration (minutes)</p>
                <div className="flex flex-wrap gap-1.5">
                  {DURATION_PRESETS.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setDuration(value)}
                      aria-pressed={duration === value}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-xs font-semibold transition",
                        duration === value
                          ? "border-brand-500/50 bg-brand-500/15 text-brand-300"
                          : "border-line/15 text-muted hover:text-ink"
                      )}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <p className="mt-1.5 text-[11px] text-muted">
                  About {totalAvailable ? Math.max(1, Math.round((duration * 60) / totalAvailable)) : 0}{" "}
                  seconds per question.
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="label">Difficulty</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { value: "mixed" as const, label: "Mixed (recommended)" },
                  { value: "easy" as const, label: "Easy" },
                  { value: "medium" as const, label: "Intermediate" },
                  { value: "hard" as const, label: "Advanced" }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDifficulty(option.value)}
                    aria-pressed={difficulty === option.value}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs font-semibold transition",
                      difficulty === option.value
                        ? "border-brand-500/50 bg-brand-500/15 text-brand-300"
                        : "border-line/15 text-muted hover:text-ink"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {totalAvailable === 0 ? (
            <EmptyState
              icon={AlertTriangle}
              title="No matching questions"
              description="Try mixed difficulty or choose different subjects. Every subject has fifty questions spread across difficulties."
              action={{ label: "Change subjects", href: "/subjects" }}
            />
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="card p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-400">
              Examination summary
            </p>
            <h2 className="mt-1 text-lg font-bold text-ink">Full CBT Simulation</h2>

            <div className="mt-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Subjects</span>
                <span className="font-semibold text-ink">{selectedSubjects.length}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Questions</span>
                <span className="font-semibold text-ink">{totalAvailable}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Duration</span>
                <span className="font-semibold text-ink">{duration} minutes</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Pass mark</span>
                <span className="font-semibold text-ink">{settings?.passMark ?? 50}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Leaderboard</span>
                <span className="font-semibold text-emerald-400">Counts</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {selectedSubjects.map((slug) => (
                <span key={slug} className="chip">
                  <SubjectIcon subject={slug} size="sm" className="h-4 w-4 rounded [&>svg]:h-3 [&>svg]:w-3" />
                  {subjectName(slug)}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={startExam}
              disabled={starting || totalAvailable === 0}
              className="btn-primary mt-4 w-full"
            >
              {starting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Preparing examination…
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" /> Begin examination
                </>
              )}
            </button>

            <p className="mt-2 flex items-center justify-center gap-1.5 text-[10px] text-muted">
              <ShieldCheck className="h-3 w-3" />
              Seed questions are validated by the scoring API.
            </p>
          </div>

          <div className="card mt-4 p-4">
            <p className="flex items-center gap-2 text-xs font-semibold text-ink">
              <Info className="h-3.5 w-3.5 text-brand-400" />
              Before you begin
            </p>
            <ul className="mt-2 space-y-2 text-[11px] leading-relaxed text-muted">
              {[
                "The timer starts immediately and keeps running if you leave the page.",
                "Your answers save automatically after every selection.",
                "Unanswered questions are marked wrong when time expires.",
                "Results include explanations for every question."
              ].map((item) => (
                <li key={item} className="flex items-start gap-1.5">
                  <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="card mt-4 border-brand-500/20 p-4">
            <p className="flex items-center gap-2 text-xs font-semibold text-ink">
              <Target className="h-3.5 w-3.5 text-cyan-400" />
              Want a custom paper?
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted">
              Use the practice hub to drill individual subjects or topics, or ask an administrator
              to add custom questions to the bank.
            </p>
            <Link href="/practice" className="btn-secondary mt-3 w-full text-xs">
              <Layers className="h-3.5 w-3.5" />
              Open practice hub
            </Link>
          </div>
        </aside>
      </div>

      <p className="text-center text-[11px] text-muted">
        <ClipboardCheck className="mr-1 inline h-3 w-3" />
        This is a practice simulation. It is not affiliated with JAMB or any university.
      </p>
    </div>
  );
}
