"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  Download,
  FileQuestion,
  Flag,
  Lightbulb,
  Loader2,
  NotebookPen,
  Printer,
  RotateCcw,
  Search,
  ShieldCheck,
  Target,
  X,
  XCircle
} from "lucide-react";
import { SubjectIcon } from "@/components/subjects/subject-icon";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { Progress } from "@/components/ui/progress";
import { ScoreRing } from "@/components/ui/score-ring";
import { useApp } from "@/components/providers/app-provider";
import { useToast } from "@/components/providers/toast-provider";
import { RANKED_MODES, createExamSession, saveExamSession } from "@/lib/exam";
import { getQuestionById } from "@/lib/questions";
import { subjectName } from "@/lib/subjects";
import {
  DIFFICULTY_LABEL,
  MODE_LABELS,
  downloadFile,
  formatDate,
  formatLongDuration,
  ratingFor,
  timeAgo
} from "@/lib/utils";
import type { ExamQuestionResult } from "@/lib/types";

const LETTERS = ["A", "B", "C", "D"];
type ReviewFilter = "all" | "correct" | "incorrect" | "unanswered";

export default function ResultDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const {
    user,
    userResults,
    questionBank,
    isBookmarked,
    bookmark,
    createOrUpdateNote,
    submitReport
  } = useApp();

  const result = userResults.find((item) => item.id === params.id) ?? null;

  const [filter, setFilter] = useState<ReviewFilter>("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [noteFor, setNoteFor] = useState<ExamQuestionResult | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [noteBusy, setNoteBusy] = useState(false);
  const [reportFor, setReportFor] = useState<ExamQuestionResult | null>(null);
  const [reportReason, setReportReason] = useState("Incorrect answer marked");
  const [reportDetail, setReportDetail] = useState("");

  const subjectBreakdown = useMemo(() => {
    if (!result) return [];
    const map = new Map<string, { subject: string; attempted: number; correct: number }>();
    for (const answer of result.answers) {
      const current = map.get(answer.subject) ?? {
        subject: answer.subject,
        attempted: 0,
        correct: 0
      };
      current.attempted += 1;
      if (answer.isCorrect) current.correct += 1;
      map.set(answer.subject, current);
    }
    return [...map.values()]
      .map((entry) => ({
        ...entry,
        accuracy: entry.attempted ? Math.round((entry.correct / entry.attempted) * 100) : 0
      }))
      .sort((a, b) => b.accuracy - a.accuracy);
  }, [result]);

  const topicBreakdown = useMemo(() => {
    if (!result) return [];
    const map = new Map<string, { label: string; subject: string; attempted: number; correct: number }>();
    for (const answer of result.answers) {
      const key = `${answer.subject}::${answer.topic}`;
      const current = map.get(key) ?? {
        label: answer.topic,
        subject: answer.subject,
        attempted: 0,
        correct: 0
      };
      current.attempted += 1;
      if (answer.isCorrect) current.correct += 1;
      map.set(key, current);
    }
    return [...map.values()]
      .map((entry) => ({
        ...entry,
        accuracy: entry.attempted ? Math.round((entry.correct / entry.attempted) * 100) : 0
      }))
      .sort((a, b) => a.accuracy - b.accuracy);
  }, [result]);

  const filteredAnswers = useMemo(() => {
    if (!result) return [];
    return result.answers.filter((answer) => {
      if (filter === "correct" && !answer.isCorrect) return false;
      if (filter === "incorrect" && (answer.isCorrect || answer.selectedIndex === null)) return false;
      if (filter === "unanswered" && answer.selectedIndex !== null) return false;
      if (query.trim()) {
        const needle = query.trim().toLowerCase();
        if (
          !answer.text.toLowerCase().includes(needle) &&
          !answer.topic.toLowerCase().includes(needle) &&
          !subjectName(answer.subject).toLowerCase().includes(needle)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [result, filter, query]);

  if (!user) return null;

  if (!result) {
    return (
      <div className="mx-auto max-w-xl">
        <EmptyState
          icon={FileQuestion}
          title="Result not found"
          description="This attempt may have been removed, or it belongs to another account on this device."
          action={{ label: "Back to results", href: "/results" }}
        />
      </div>
    );
  }

  const rating = ratingFor(result.percentage);
  const ratingColor =
    rating.tone === "excellent"
      ? "text-emerald-400"
      : rating.tone === "good"
        ? "text-brand-300"
        : rating.tone === "fair"
          ? "text-amber-400"
          : "text-rose-400";
  const ranked = RANKED_MODES.includes(result.mode);
  const correctCount = result.answers.filter((answer) => answer.isCorrect).length;

  const retake = () => {
    const questions = result.answers
      .map((answer) => questionBank.find((question) => question.id === answer.questionId))
      .filter((question): question is NonNullable<typeof question> => Boolean(question));
    if (!questions.length) {
      toast.error("Cannot retake", "The questions in this attempt are no longer available.");
      return;
    }
    const config = {
      mode: result.mode,
      subjects: Array.from(new Set(questions.map((question) => question.subject))),
      topics: Array.from(new Set(questions.map((question) => question.topic))),
      questionCount: questions.length,
      durationMinutes: Math.max(1, Math.round(result.durationSeconds / 60)),
      difficulty: "mixed" as const,
      title: `${result.title} · Retake`
    };
    saveExamSession(createExamSession(config, questions));
    router.push("/exam/run");
  };

  const exportCsv = () => {
    const rows = [
      ["Question", "Subject", "Topic", "Difficulty", "Your answer", "Correct answer", "Outcome", "Explanation"],
      ...result.answers.map((answer, index) => [
        index + 1,
        subjectName(answer.subject),
        answer.topic,
        DIFFICULTY_LABEL[answer.difficulty],
        answer.selectedIndex === null ? "Unanswered" : LETTERS[answer.selectedIndex],
        LETTERS[answer.correctIndex],
        answer.isCorrect ? "Correct" : "Incorrect",
        answer.explanation
      ])
    ];
    downloadFile(
      `praise-result-${result.id.slice(-6)}.csv`,
      rows
        .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        .join("\n"),
      "text/csv"
    );
  };

  const openNote = (answer: ExamQuestionResult) => {
    setNoteFor(answer);
    setNoteTitle(`${answer.topic} — ${subjectName(answer.subject)}`);
    setNoteBody("");
  };

  const saveNote = () => {
    if (!noteFor) return;
    if (!noteBody.trim()) {
      toast.error("Note is empty", "Write something worth revising later.");
      return;
    }
    setNoteBusy(true);
    const outcome = createOrUpdateNote({
      questionId: noteFor.questionId,
      title: noteTitle.trim() || noteFor.topic,
      body: noteBody.trim()
    });
    setNoteBusy(false);
    if (outcome.ok) {
      toast.success("Note saved", "Find it in your library under notes.");
      setNoteFor(null);
      setNoteBody("");
    } else {
      toast.error("Could not save note", outcome.error);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href="/results"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All results
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={exportCsv} className="btn-secondary text-xs">
            <Download className="h-3.5 w-3.5" />
            CSV
          </button>
          <button type="button" onClick={() => window.print()} className="btn-secondary text-xs">
            <Printer className="h-3.5 w-3.5" />
            Print / PDF
          </button>
          <button type="button" onClick={retake} className="btn-primary text-xs">
            <RotateCcw className="h-3.5 w-3.5" />
            Retake
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <div className="flex justify-center">
            <ScoreRing score={result.percentage} size={150} stroke={11} label="Your score" />
          </div>
          <div className="min-w-0 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center gap-1.5 lg:justify-start">
              <Badge tone={result.passed ? "success" : "danger"}>
                {result.passed ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                {result.passed ? "Passed" : "Below pass mark"}
              </Badge>
              <Badge tone="neutral">{MODE_LABELS[result.mode]}</Badge>
              {ranked ? <Badge tone="brand">Ranked</Badge> : <Badge tone="neutral">Analytics only</Badge>}
            </div>
            <h1 className="mt-2 text-xl font-bold tracking-tight text-ink sm:text-2xl">
              {result.title}
            </h1>
            <p className="mt-1 text-xs text-muted">
              Completed {formatDate(result.completedAt, { day: "numeric", month: "long", year: "numeric" })} ·{" "}
              {timeAgo(result.completedAt)}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted lg:justify-start">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                {correctCount} correct
              </span>
              <span className="inline-flex items-center gap-1.5">
                <XCircle className="h-3.5 w-3.5 text-rose-400" />
                {result.total - correctCount} wrong
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5 text-brand-400" />
                {formatLongDuration(result.timeSpentSeconds)} of {formatLongDuration(result.durationSeconds)}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 lg:justify-start">
              {result.subjects.map((subject) => (
                <span key={subject} className="chip">
                  <SubjectIcon subject={subject} size="sm" className="h-4 w-4 rounded [&>svg]:h-3 [&>svg]:w-3" />
                  {subjectName(subject)}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 lg:w-52 lg:grid-cols-1">
            <div className="rounded-xl border border-line/10 bg-white/[0.02] p-3 text-center lg:text-left">
              <p className="text-[10px] uppercase tracking-wide text-muted">Rating</p>
              <p className={`text-sm font-bold ${ratingColor}`}>{rating.label}</p>
            </div>
            <div className="rounded-xl border border-line/10 bg-white/[0.02] p-3 text-center lg:text-left">
              <p className="text-[10px] uppercase tracking-wide text-muted">Points</p>
              <p className="text-sm font-bold text-amber-400">{result.points}</p>
            </div>
            <div className="rounded-xl border border-line/10 bg-white/[0.02] p-3 text-center lg:text-left">
              <p className="text-[10px] uppercase tracking-wide text-muted">Validation</p>
              <p className="text-[11px] font-semibold text-ink">
                {result.validation === "server" ? "Server-verified" : "Local demo"}
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-line/10 bg-white/[0.02] px-5 py-3 text-[11px] text-muted sm:px-6">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            {result.validation === "server"
              ? "This attempt was scored against the validated question bank."
              : "This attempt included custom or edited questions, so it was scored locally in demo mode."}
          </span>
          {ranked ? (
            <span className="ml-3 inline-flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-brand-400" />
              Counts towards your leaderboard average.
            </span>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 print:hidden">
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-ink">Score summary</h2>
          <div className="mt-3 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Correct</span>
              <span className="font-semibold text-emerald-400">{correctCount}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Incorrect</span>
              <span className="font-semibold text-rose-400">
                {result.answers.filter((answer) => !answer.isCorrect && answer.selectedIndex !== null).length}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Unanswered</span>
              <span className="font-semibold text-amber-400">{result.unanswered}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Accuracy</span>
              <span className="font-semibold text-ink">{result.percentage}%</span>
            </div>
            <Progress value={result.percentage} className="h-2" />
          </div>
        </div>

        <div className="card p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-ink">Subject breakdown</h2>
          <div className="mt-3 space-y-3">
            {subjectBreakdown.map((entry) => (
              <div key={entry.subject}>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-ink">
                    <SubjectIcon subject={entry.subject} size="sm" className="h-4 w-4 rounded [&>svg]:h-3 [&>svg]:w-3" />
                    {subjectName(entry.subject)}
                  </span>
                  <span className="tabular-nums text-muted">
                    {entry.correct}/{entry.attempted} · {entry.accuracy}%
                  </span>
                </div>
                <Progress
                  value={entry.accuracy}
                  className="mt-1.5 h-1.5"
                  barClassName={
                    entry.accuracy >= 70
                      ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                      : entry.accuracy >= 50
                        ? "bg-gradient-to-r from-amber-500 to-orange-400"
                        : "bg-gradient-to-r from-rose-500 to-pink-400"
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {topicBreakdown.length ? (
        <div className="card p-5 print:hidden">
          <h2 className="text-sm font-semibold text-ink">Topic performance</h2>
          <p className="mt-0.5 text-[11px] text-muted">Lowest accuracy first — your revision priorities.</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {topicBreakdown.map((entry) => (
              <span
                key={`${entry.subject}-${entry.label}`}
                className={
                  entry.accuracy >= 70
                    ? "chip border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
                    : entry.accuracy >= 50
                      ? "chip border-amber-500/25 bg-amber-500/10 text-amber-400"
                      : "chip border-rose-500/25 bg-rose-500/10 text-rose-400"
                }
                title={`${subjectName(entry.subject)} · ${entry.correct}/${entry.attempted} correct`}
              >
                {entry.label} · {entry.accuracy}%
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="card p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-ink">Answer review</h2>
            <p className="mt-0.5 text-xs text-muted">
              Every question, your answer, the correct answer and a full explanation.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 print:hidden">
            {(
              [
                { value: "all", label: `All (${result.answers.length})` },
                { value: "correct", label: `Correct (${correctCount})` },
                {
                  value: "incorrect",
                  label: `Wrong (${result.answers.filter((a) => !a.isCorrect && a.selectedIndex !== null).length})`
                },
                { value: "unanswered", label: `Skipped (${result.unanswered})` }
              ] as { value: ReviewFilter; label: string }[]
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilter(option.value)}
                aria-pressed={filter === option.value}
                className={
                  filter === option.value
                    ? "rounded-full border border-brand-500/50 bg-brand-500/15 px-3 py-1 text-[11px] font-semibold text-brand-300"
                    : "rounded-full border border-line/15 px-3 py-1 text-[11px] font-medium text-muted hover:text-ink"
                }
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mt-3 print:hidden">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search this attempt by topic, subject or text"
            aria-label="Search reviewed questions"
            className="input h-9 pl-8 text-xs"
          />
        </div>

        {filteredAnswers.length ? (
          <div className="mt-4 space-y-3">
            {filteredAnswers.map((answer) => {
              const originalIndex = result.answers.findIndex(
                (item) => item.questionId === answer.questionId
              );
              const expanded = open[answer.questionId] ?? true;
              const inBank = getQuestionById(answer.questionId);
              const bookmarked = isBookmarked(answer.questionId);
              return (
                <div key={answer.questionId} className="rounded-xl border border-line/10">
                  <button
                    type="button"
                    onClick={() =>
                      setOpen((current) => ({
                        ...current,
                        [answer.questionId]: !expanded
                      }))
                    }
                    aria-expanded={expanded}
                    className="flex w-full items-start gap-3 p-4 text-left"
                  >
                    <span
                      className={
                        answer.isCorrect
                          ? "grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-emerald-400"
                          : answer.selectedIndex === null
                            ? "grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-amber-500/10 text-amber-400"
                            : "grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-rose-500/10 text-rose-400"
                      }
                    >
                      {answer.isCorrect ? (
                        <Check className="h-4 w-4" />
                      ) : answer.selectedIndex === null ? (
                        <X className="h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                          Q{originalIndex + 1}
                        </span>
                        <span className="chip">{subjectName(answer.subject)}</span>
                        <span className="chip">{answer.topic}</span>
                        <span className="chip">{DIFFICULTY_LABEL[answer.difficulty]}</span>
                      </div>
                      <p className="mt-1.5 text-sm font-medium leading-relaxed text-ink">
                        {answer.text}
                      </p>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-muted transition ${expanded ? "rotate-180" : ""}`}
                    />
                  </button>

                  {expanded ? (
                    <div className="border-t border-line/10 p-4">
                      <div className="space-y-2">
                        {answer.options.map((option, optionIndex) => {
                          const isCorrect = optionIndex === answer.correctIndex;
                          const isSelected = optionIndex === answer.selectedIndex;
                          return (
                            <div
                              key={`${answer.questionId}-${optionIndex}`}
                              className={
                                isCorrect
                                  ? "flex items-start gap-2.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2"
                                  : isSelected
                                    ? "flex items-start gap-2.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2"
                                    : "flex items-start gap-2.5 rounded-lg border border-line/10 px-3 py-2"
                              }
                            >
                              <span
                                className={
                                  isCorrect
                                    ? "grid h-5 w-5 shrink-0 place-items-center rounded bg-emerald-500 text-[10px] font-bold text-white"
                                    : isSelected
                                      ? "grid h-5 w-5 shrink-0 place-items-center rounded bg-rose-500 text-[10px] font-bold text-white"
                                      : "grid h-5 w-5 shrink-0 place-items-center rounded border border-line/20 text-[10px] font-bold text-muted"
                                }
                              >
                                {isCorrect ? (
                                  <Check className="h-3 w-3" />
                                ) : isSelected ? (
                                  <X className="h-3 w-3" />
                                ) : (
                                  LETTERS[optionIndex]
                                )}
                              </span>
                              <span className="text-xs leading-relaxed text-ink">{option}</span>
                              {isSelected ? (
                                <span className="ml-auto shrink-0 text-[10px] font-semibold uppercase tracking-wide text-rose-400">
                                  Your answer
                                </span>
                              ) : null}
                              {isCorrect ? (
                                <span className="ml-auto shrink-0 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
                                  Correct
                                </span>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-3 rounded-lg border border-brand-500/20 bg-brand-500/[0.06] p-3">
                        <p className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-300">
                          <Lightbulb className="h-3.5 w-3.5" />
                          Explanation
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-muted">{answer.explanation}</p>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2 print:hidden">
                        {inBank ? (
                          <button
                            type="button"
                            onClick={() => {
                              bookmark(answer.questionId);
                              toast.success(
                                bookmarked ? "Bookmark removed" : "Bookmarked for later"
                              );
                            }}
                            className="btn-ghost text-[11px]"
                          >
                            {bookmarked ? (
                              <BookmarkCheck className="h-3.5 w-3.5 text-amber-400" />
                            ) : (
                              <Bookmark className="h-3.5 w-3.5" />
                            )}
                            {bookmarked ? "Bookmarked" : "Bookmark"}
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => openNote(answer)}
                          className="btn-ghost text-[11px]"
                        >
                          <NotebookPen className="h-3.5 w-3.5" />
                          Add note
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setReportFor(answer);
                            setReportDetail("");
                          }}
                          className="btn-ghost text-[11px]"
                        >
                          <Flag className="h-3.5 w-3.5" />
                          Report question
                        </button>
                        <Link
                          href={`/subjects/${answer.subject}`}
                          className="btn-ghost ml-auto text-[11px]"
                        >
                          Study {subjectName(answer.subject)}
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 rounded-xl border border-dashed border-line/20 p-6 text-center text-xs text-muted">
            No questions match this filter.
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 print:hidden">
        <Link href="/practice" className="btn-secondary">
          <RotateCcw className="h-4 w-4" />
          Practise again
        </Link>
        <button type="button" onClick={retake} className="btn-primary">
          <ClipboardCheck className="h-4 w-4" />
          Retake this attempt
        </button>
      </div>

      <Modal
        open={Boolean(noteFor)}
        onClose={() => setNoteFor(null)}
        title="Add a revision note"
        description="Notes stay in your library and can be linked to this question."
        footer={
          <>
            <button type="button" onClick={() => setNoteFor(null)} className="btn-secondary">
              Cancel
            </button>
            <button type="button" onClick={saveNote} className="btn-primary" disabled={noteBusy}>
              {noteBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <NotebookPen className="h-4 w-4" />}
              Save note
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label htmlFor="note-title" className="label">
              Title
            </label>
            <input
              id="note-title"
              className="input"
              value={noteTitle}
              onChange={(event) => setNoteTitle(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="note-body" className="label">
              Note
            </label>
            <textarea
              id="note-body"
              className="input min-h-[120px] resize-y"
              value={noteBody}
              onChange={(event) => setNoteBody(event.target.value)}
              placeholder="What did you get wrong, and what will you remember next time?"
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(reportFor)}
        onClose={() => setReportFor(null)}
        title="Report a question"
        description="Reports are reviewed by the administrator."
        footer={
          <>
            <button type="button" onClick={() => setReportFor(null)} className="btn-secondary">
              Cancel
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                if (!reportFor) return;
                const outcome = submitReport({
                  questionId: reportFor.questionId,
                  subject: reportFor.subject,
                  reason: reportReason,
                  detail: reportDetail
                });
                if (outcome.ok) {
                  toast.success("Report sent", "Thank you — the administrator will review it.");
                  setReportFor(null);
                } else {
                  toast.error("Could not send report", outcome.error);
                }
              }}
            >
              Send report
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label htmlFor="review-report-reason" className="label">
              Reason
            </label>
            <select
              id="review-report-reason"
              className="input"
              value={reportReason}
              onChange={(event) => setReportReason(event.target.value)}
            >
              {[
                "Incorrect answer marked",
                "Typo or unclear wording",
                "Duplicate question",
                "Missing explanation",
                "Other issue"
              ].map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="review-report-detail" className="label">
              Details (optional)
            </label>
            <textarea
              id="review-report-detail"
              className="input min-h-[100px] resize-y"
              value={reportDetail}
              onChange={(event) => setReportDetail(event.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
