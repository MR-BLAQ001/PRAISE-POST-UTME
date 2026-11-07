"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  FlagOff,
  Loader2,
  Send,
  ShieldAlert,
  X
} from "lucide-react";
import { AnswerOptions } from "@/components/exam/answer-options";
import { SubjectIcon } from "@/components/subjects/subject-icon";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { PageLoader } from "@/components/ui/spinner";
import { useApp } from "@/components/providers/app-provider";
import { useToast } from "@/components/providers/toast-provider";
import {
  clearExamSession,
  formatCountdown,
  isPracticeMode,
  isServerScorable,
  loadExamSession,
  questionsForSession,
  saveExamSession
} from "@/lib/exam";
import { remainingSeconds, scoreExam } from "@/lib/scoring";
import { DIFFICULTY_LABEL, MODE_LABELS, cn } from "@/lib/utils";
import type { ExamResult, ExamSession, Question } from "@/lib/types";

const REPORT_REASONS = [
  "Incorrect answer marked",
  "Typo or unclear wording",
  "Duplicate question",
  "Missing explanation",
  "Other issue"
];

export function ExamRunner() {
  const router = useRouter();
  const {
    user,
    questionBank,
    settings,
    saveResult,
    isBookmarked,
    bookmark,
    submitReport
  } = useApp();
  const toast = useToast();

  const [session, setSession] = useState<ExamSession | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [marked, setMarked] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [submitOpen, setSubmitOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState(REPORT_REASONS[0]);
  const [reportDetail, setReportDetail] = useState("");

  const startedRef = useRef(false);
  const submittingRef = useRef(false);
  const submittedRef = useRef(false);
  const autoTriggeredRef = useRef(false);
  const submitRef = useRef<(auto?: boolean) => void>(() => undefined);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const stored = loadExamSession();
    if (!stored) {
      setLoaded(true);
      return;
    }
    const resolved = questionsForSession(stored, questionBank);
    setSession(stored);
    setQuestions(resolved);
    setAnswers(stored.answers);
    setMarked(stored.marked);
    setIndex(Math.min(stored.currentIndex, Math.max(0, resolved.length - 1)));
    setRemaining(remainingSeconds(stored.endsAt));
    // Practice modes reveal feedback on answer; restore it for resumed attempts.
    if (isPracticeMode(stored.config.mode)) {
      setRevealed(
        Object.fromEntries(
          Object.entries(stored.answers)
            .filter(([, value]) => value !== null)
            .map(([questionId]) => [questionId, true])
        )
      );
    }
    setLoaded(true);
  }, [questionBank]);

  // Persist the attempt after every meaningful change so a refresh can resume it.
  useEffect(() => {
    if (!session) return;
    saveExamSession({ ...session, answers, marked, currentIndex: index });
  }, [session, answers, marked, index]);

  useEffect(() => {
    if (!session) return;
    const tick = () => setRemaining(remainingSeconds(session.endsAt));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [session]);

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (!session || submittedRef.current) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [session]);

  const question = questions[index];

  const handleSelect = (selectedIndex: number) => {
    if (!session || !question) return;
    const practice = isPracticeMode(session.config.mode);
    if (practice && revealed[question.id]) return;
    if (!practice && submitting) return;
    setAnswers((current) => ({ ...current, [question.id]: selectedIndex }));
    if (practice) {
      setRevealed((current) => ({ ...current, [question.id]: true }));
    }
  };

  const toggleMark = () => {
    if (!question) return;
    setMarked((current) =>
      current.includes(question.id)
        ? current.filter((id) => id !== question.id)
        : [...current, question.id]
    );
  };

  const submitAttempt = useCallback(
    async (auto = false) => {
      if (!session || !user || submittingRef.current || submittedRef.current) return;
      submittingRef.current = true;
      setSubmitting(true);
      setError(null);
      const completedAt = new Date().toISOString();
      const duration = session.config.durationMinutes * 60;
      const timeSpentSeconds = Math.max(
        0,
        Math.min(duration, duration - remainingSeconds(session.endsAt))
      );

      let result: ExamResult | null = null;
      let scoredLocally = false;

      if (isServerScorable(questions)) {
        try {
          const response = await fetch("/api/exam/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              attemptId: session.attemptId,
              questionIds: questions.map((item) => item.id),
              answers,
              config: session.config,
              startedAt: session.startedAt,
              completedAt,
              timeSpentSeconds,
              passMark: settings?.passMark ?? 50,
              user: {
                id: user.id,
                name: user.displayName,
                username: user.username,
                avatar: user.avatar ?? undefined
              }
            })
          });
          if (response.ok) {
            const payload = (await response.json()) as { result: ExamResult };
            result = payload.result;
          }
        } catch {
          // Fall through to local demo scoring when the network is unavailable.
        }
      }

      if (!result) {
        scoredLocally = true;
        result = scoreExam({
          questions,
          answers,
          config: session.config,
          attemptId: session.attemptId,
          userId: user.id,
          userName: user.displayName,
          username: user.username,
          avatar: user.avatar ?? undefined,
          startedAt: session.startedAt,
          completedAt,
          durationSeconds: duration,
          timeSpentSeconds,
          validation: "client-demo",
          passMark: settings?.passMark ?? 50
        });
      }

      if (!result || result.total === 0) {
        setError("This attempt could not be scored. Please start a new session.");
        setSubmitting(false);
        submittingRef.current = false;
        return;
      }

      submittedRef.current = true;
      saveResult(result);
      clearExamSession();
      if (auto) toast.info("Time is up", "Your answers were submitted automatically.");
      else if (scoredLocally)
        toast.info("Submitted", "Custom questions were scored locally in demo mode.");
      router.replace(`/results/${result.id}`);
    },
    [answers, questions, router, saveResult, session, settings?.passMark, toast, user]
  );

  submitRef.current = (auto = false) => {
    void submitAttempt(auto);
  };

  useEffect(() => {
    if (!loaded || !session || submitting || submittedRef.current) return;
    if (remaining > 0 || autoTriggeredRef.current) return;
    autoTriggeredRef.current = true;
    submitRef.current(true);
  }, [remaining, loaded, session, submitting]);

  if (!loaded) return <PageLoader label="Restoring your examination" />;

  if (!session || !questions.length) {
    return (
      <div className="mx-auto max-w-xl">
        <EmptyState
          icon={ShieldAlert}
          title="No active examination"
          description="Your session may have been submitted already. Start a new practice session or full CBT simulation whenever you are ready."
          action={{ label: "Start practicing", href: "/practice" }}
        />
      </div>
    );
  }

  const answeredCount = Object.values(answers).filter((value) => value !== null).length;
  const markedCount = marked.length;
  const practice = isPracticeMode(session.config.mode);
  const showFeedback = practice && question ? revealed[question.id] : false;
  const isMarked = question ? marked.includes(question.id) : false;
  const lowTime = remaining <= 60;
  const progress = (answeredCount / questions.length) * 100;

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={practice ? "/practice" : "/exam"}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {practice ? "Practice hub" : "Exam setup"}
          </Link>
          <h1 className="mt-1 truncate text-lg font-bold text-ink sm:text-xl">
            {session.config.title}
          </h1>
          <p className="text-xs text-muted">
            {MODE_LABELS[session.config.mode]} · {questions.length} questions ·{" "}
            {session.config.durationMinutes} minutes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex items-center gap-2 rounded-xl border px-3.5 py-2 font-mono text-lg font-bold tabular-nums",
              lowTime
                ? "border-rose-500/40 bg-rose-500/10 text-rose-400 animate-pulse"
                : "border-brand-500/30 bg-brand-500/10 text-brand-300"
            )}
            role="timer"
            aria-live="off"
            aria-label={`Time remaining ${formatCountdown(remaining)}`}
          >
            <Clock className="h-4 w-4" />
            {formatCountdown(remaining)}
          </div>
          <button
            type="button"
            onClick={() => {
              saveExamSession({ ...session, answers, marked, currentIndex: index });
              toast.info("Progress saved", "You can resume this attempt from where you stopped.");
              router.push(practice ? "/practice" : "/dashboard");
            }}
            className="btn-secondary px-3 py-2 text-xs"
          >
            Save & exit
          </button>
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs text-muted">
          <span>
            {answeredCount} of {questions.length} answered
          </span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-line/15">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-cyan-400 transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">
          <div className="card p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="grid h-8 min-w-8 place-items-center rounded-lg bg-brand-500/15 px-2 text-xs font-bold text-brand-300">
                Q{index + 1}
              </span>
              <SubjectIcon subject={question.subject} size="sm" />
              <span className="text-xs font-medium text-muted">
                {question.topic}
              </span>
              <Badge tone={question.difficulty === "hard" ? "danger" : question.difficulty === "medium" ? "warning" : "success"}>
                {DIFFICULTY_LABEL[question.difficulty]}
              </Badge>
              <div className="ml-auto flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    const wasBookmarked = isBookmarked(question.id);
                    bookmark(question.id);
                    toast.success(
                      wasBookmarked ? "Bookmark removed" : "Question bookmarked",
                      wasBookmarked
                        ? undefined
                        : "Find it later in your bookmarks library."
                    );
                  }}
                  aria-label={isBookmarked(question.id) ? "Remove bookmark" : "Bookmark question"}
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-lg border transition",
                    isBookmarked(question.id)
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                      : "border-line/15 text-muted hover:text-ink"
                  )}
                >
                  {isBookmarked(question.id) ? (
                    <BookmarkCheck className="h-4 w-4" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setReportOpen(true)}
                  aria-label="Report a problem with this question"
                  className="grid h-8 w-8 place-items-center rounded-lg border border-line/15 text-muted transition hover:text-rose-400"
                >
                  <Flag className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="mt-4 text-[15px] font-medium leading-relaxed text-ink sm:text-base">
              {question.text}
            </p>

            <div className="mt-5">
              <AnswerOptions
                question={question}
                selectedIndex={answers[question.id] ?? null}
                onSelect={handleSelect}
                disabled={showFeedback}
                reveal={showFeedback}
              />
            </div>

            {showFeedback ? (
              <div
                className={cn(
                  "mt-4 rounded-xl border p-4",
                  answers[question.id] === question.correctIndex
                    ? "border-emerald-500/25 bg-emerald-500/[0.07]"
                    : "border-rose-500/25 bg-rose-500/[0.07]"
                )}
              >
                <p
                  className={cn(
                    "flex items-center gap-2 text-sm font-semibold",
                    answers[question.id] === question.correctIndex
                      ? "text-emerald-400"
                      : "text-rose-400"
                  )}
                >
                  {answers[question.id] === question.correctIndex ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                  {answers[question.id] === question.correctIndex
                    ? "Correct"
                    : `Not quite — the answer is ${["A", "B", "C", "D"][question.correctIndex]}`}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{question.explanation}</p>
              </div>
            ) : null}

            {isMarked ? (
              <p className="mt-3 flex items-center gap-1.5 text-xs text-amber-400">
                <Flag className="h-3.5 w-3.5" /> Marked for review
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setIndex((current) => Math.max(0, current - 1))}
              disabled={index === 0}
              className="btn-secondary"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <div className="flex items-center gap-2">
              <button type="button" onClick={toggleMark} className="btn-ghost text-xs">
                {isMarked ? (
                  <>
                    <FlagOff className="h-4 w-4" /> Unmark
                  </>
                ) : (
                  <>
                    <Flag className="h-4 w-4" /> Mark for review
                  </>
                )}
              </button>
              {index === questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setSubmitOpen(true)}
                  className="btn-primary"
                >
                  Review & submit
                  <Send className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    setIndex((current) => Math.min(questions.length - 1, current + 1))
                  }
                  className="btn-primary"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Question palette
              </p>
              <span className="text-[11px] text-muted">{markedCount} marked</span>
            </div>
            <div className="mt-3 grid grid-cols-6 gap-1.5 sm:grid-cols-8 lg:grid-cols-5">
              {questions.map((item, itemIndex) => {
                const isCurrent = itemIndex === index;
                const isAnswered = answers[item.id] !== null && answers[item.id] !== undefined;
                const isFlagged = marked.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIndex(itemIndex)}
                    aria-label={`Question ${itemIndex + 1}${isAnswered ? ", answered" : ", unanswered"}${isFlagged ? ", marked" : ""}`}
                    aria-current={isCurrent ? "true" : undefined}
                    className={cn(
                      "relative grid h-8 place-items-center rounded-md border text-[11px] font-semibold transition",
                      isCurrent && "border-brand-400 bg-brand-500/20 text-brand-200",
                      !isCurrent && isAnswered && "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
                      !isCurrent && !isAnswered && "border-line/15 text-muted hover:border-line/30 hover:text-ink",
                      isFlagged && !isCurrent && "ring-1 ring-amber-500/60"
                    )}
                  >
                    {itemIndex + 1}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 space-y-2 text-[11px] text-muted">
              <p className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm border border-emerald-500/40 bg-emerald-500/20" />
                Answered ({answeredCount})
              </p>
              <p className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm border border-line/25" />
                Unanswered ({questions.length - answeredCount})
              </p>
              <p className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm border border-amber-500/60 bg-amber-500/10 ring-1 ring-amber-500/40" />
                Marked ({markedCount})
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSubmitOpen(true)}
              className="btn-primary mt-4 w-full"
            >
              <Send className="h-4 w-4" />
              Submit examination
            </button>
            {practice ? (
              <p className="mt-2 text-center text-[11px] leading-relaxed text-muted">
                Practice answers reveal the explanation instantly. The final score is saved for
                your analytics.
              </p>
            ) : (
              <p className="mt-2 text-center text-[11px] leading-relaxed text-muted">
                Answers are hidden until you submit. Your progress is saved automatically.
              </p>
            )}
          </div>

          {error ? (
            <div className="flex items-start gap-2 rounded-xl border border-rose-500/25 bg-rose-500/10 p-3 text-xs text-rose-400">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          ) : null}
        </aside>
      </div>

      <Modal
        open={submitOpen}
        onClose={() => setSubmitOpen(false)}
        title="Submit this examination?"
        description="Once submitted, answers are final. You will see a full review with explanations."
        footer={
          <>
            <button
              type="button"
              onClick={() => setSubmitOpen(false)}
              className="btn-secondary"
              disabled={submitting}
            >
              Keep working
            </button>
            <button
              type="button"
              onClick={() => void submitAttempt(false)}
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
                </>
              ) : (
                <>
                  Submit now <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
            <p className="text-xl font-bold text-emerald-400">{answeredCount}</p>
            <p className="text-[11px] text-muted">Answered</p>
          </div>
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3">
            <p className="text-xl font-bold text-rose-400">
              {questions.length - answeredCount}
            </p>
            <p className="text-[11px] text-muted">Unanswered</p>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
            <p className="text-xl font-bold text-amber-400">{markedCount}</p>
            <p className="text-[11px] text-muted">Marked</p>
          </div>
        </div>
        {questions.length - answeredCount > 0 ? (
          <p className="mt-4 flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs leading-relaxed text-amber-400">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            Unanswered questions are marked wrong. You can still go back and complete them.
          </p>
        ) : (
          <p className="mt-4 text-xs leading-relaxed text-muted">
            Every question has an answer. Submit when you are ready to see your result.
          </p>
        )}
      </Modal>

      <Modal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Report this question"
        description="Reports go to the administrator for review. Please describe the problem clearly."
        footer={
          <>
            <button type="button" onClick={() => setReportOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                if (!question) return;
                const outcome = submitReport({
                  questionId: question.id,
                  subject: question.subject,
                  reason: reportReason,
                  detail: reportDetail
                });
                if (outcome.ok) {
                  toast.success("Report sent", "Thank you — the administrator will review it.");
                  setReportOpen(false);
                  setReportDetail("");
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
            <label htmlFor="report-reason" className="label">
              Reason
            </label>
            <select
              id="report-reason"
              className="input"
              value={reportReason}
              onChange={(event) => setReportReason(event.target.value)}
            >
              {REPORT_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="report-detail" className="label">
              Details (optional)
            </label>
            <textarea
              id="report-detail"
              className="input min-h-[100px] resize-y"
              value={reportDetail}
              onChange={(event) => setReportDetail(event.target.value)}
              placeholder="Explain what is wrong with the question or answer."
            />
          </div>
          <p className="text-[11px] text-muted">Question ID: {question?.id}</p>
        </div>
      </Modal>
    </div>
  );
}
