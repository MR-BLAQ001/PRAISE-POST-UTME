"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Info,
  Loader2,
  Play,
  RotateCcw,
  Shuffle,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
  type LucideIcon
} from "lucide-react";
import { SubjectIcon } from "@/components/subjects/subject-icon";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/components/providers/app-provider";
import { useToast } from "@/components/providers/toast-provider";
import {
  PRACTICE_MODES,
  createExamSession,
  filterByDifficulty,
  isPracticeMode,
  saveExamSession
} from "@/lib/exam";
import { buildPerformanceProfile } from "@/lib/performance";
import { getDailyQuestionIds } from "@/lib/questions";
import { SUBJECTS, getSubject, subjectName } from "@/lib/subjects";
import { cn, dateKey, formatDate } from "@/lib/utils";
import type { Difficulty, ExamConfig, ExamMode, Question } from "@/lib/types";

const MODE_ICONS: Record<string, LucideIcon> = {
  Zap,
  BookOpen,
  Target,
  CalendarCheck,
  TrendingUp,
  Shuffle,
  RotateCcw,
  ClipboardCheck
};

const COUNTS = [10, 15, 20, 30];
const DURATIONS = [10, 15, 20, 30, 45];

export default function PracticePage() {
  const router = useRouter();
  const toast = useToast();
  const {
    user,
    questionBank,
    userResults,
    userPractice,
    getDailyChallenge
  } = useApp();

  const [selectedMode, setSelectedMode] = useState<ExamMode | null>(null);
  const [subject, setSubject] = useState("english-language");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<"mixed" | Difficulty>("mixed");
  const [count, setCount] = useState(10);
  const [duration, setDuration] = useState(10);
  const [starting, setStarting] = useState(false);

  const daily = getDailyChallenge(dateKey());
  const performance = useMemo(
    () => buildPerformanceProfile(userResults, userPractice, user?.id),
    [userResults, userPractice, user?.id]
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode") as ExamMode | null;
    if (mode && (isPracticeMode(mode) || mode === "full-cbt")) {
      chooseMode(mode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chooseMode = (mode: ExamMode) => {
    setSelectedMode(mode);
    const meta = PRACTICE_MODES.find((item) => item.mode === mode);
    if (meta) {
      setCount(meta.questions);
      setDuration(meta.duration);
    }
    if (mode === "daily-challenge") {
      setCount(10);
      setDuration(12);
    }
    if (mode === "weakness-training") {
      setCount(15);
      setDuration(18);
    }
    if (mode === "revision") {
      setCount(15);
      setDuration(18);
    }
    if (mode === "quick-practice") {
      setCount(10);
      setDuration(10);
    }
    if (mode === "subject-practice" || mode === "topic-practice") {
      const initialSubject = user?.preferredSubjects[0] ?? "english-language";
      setSubject(initialSubject);
      setTopic(getSubject(initialSubject)?.topics[0] ?? "");
    }
  };

  useEffect(() => {
    if (selectedMode === "topic-practice") {
      setTopic(getSubject(subject)?.topics[0] ?? "");
    }
  }, [subject, selectedMode]);

  const revisionQuestions = useMemo(() => {
    if (!user) return [];
    const incorrect = new Set<string>();
    for (const result of userResults) {
      for (const answer of result.answers) {
        if (!answer.isCorrect) incorrect.add(answer.questionId);
      }
    }
    for (const attempt of userPractice) {
      if (!attempt.correct) incorrect.add(attempt.questionId);
    }
    return questionBank.filter((question) => incorrect.has(question.id));
  }, [questionBank, user, userResults, userPractice]);

  const weakPairs = useMemo(
    () =>
      new Set(
        performance.weakestTopics.map((topicEntry) => `${topicEntry.subject}::${topicEntry.topic}`)
      ),
    [performance.weakestTopics]
  );

  const candidates = useMemo((): Question[] => {
    if (!selectedMode) return [];
    if (selectedMode === "daily-challenge") {
      const ids = new Set(getDailyQuestionIds(dateKey(), 10));
      return questionBank.filter((question) => ids.has(question.id));
    }
    if (selectedMode === "revision") {
      return revisionQuestions;
    }
    if (selectedMode === "weakness-training") {
      const weak = questionBank.filter((question) =>
        weakPairs.has(`${question.subject}::${question.topic}`)
      );
      return weak.length ? weak : questionBank;
    }
    if (selectedMode === "subject-practice") {
      return questionBank.filter((question) => question.subject === subject);
    }
    if (selectedMode === "topic-practice") {
      return questionBank.filter(
        (question) => question.subject === subject && question.topic === topic
      );
    }
    if (selectedMode === "quick-practice") {
      return questionBank;
    }
    if (selectedMode === "random-challenge") {
      const preferred = user?.preferredSubjects ?? [];
      return preferred.length
        ? questionBank.filter((question) => preferred.includes(question.subject))
        : questionBank;
    }
    return questionBank;
  }, [
    questionBank,
    revisionQuestions,
    selectedMode,
    subject,
    topic,
    user?.preferredSubjects,
    weakPairs
  ]);

  const available = useMemo(
    () => filterByDifficulty(candidates, difficulty),
    [candidates, difficulty]
  );

  if (!user) return null;

  const selectedMeta = selectedMode ? PRACTICE_MODES.find((item) => item.mode === selectedMode) : null;
  const actualCount = Math.min(count, available.length);
  const topics = getSubject(subject)?.topics ?? [];
  const canStart =
    Boolean(selectedMode) &&
    available.length > 0 &&
    (selectedMode !== "topic-practice" || Boolean(topic)) &&
    (selectedMode !== "revision" || revisionQuestions.length > 0);

  const startSession = () => {
    if (!selectedMode || !canStart) {
      toast.error("Cannot start yet", "Choose a mode with available questions first.");
      return;
    }
    setStarting(true);
    const shuffled = [...available];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const chosen = shuffled.slice(0, count);
    if (!chosen.length) {
      toast.error("No questions available", "Try another subject, topic or difficulty.");
      setStarting(false);
      return;
    }

    const title =
      selectedMode === "subject-practice"
        ? `${subjectName(subject)} Practice`
        : selectedMode === "topic-practice"
          ? `${topic} Drill`
          : selectedMode === "daily-challenge"
            ? `Daily Challenge · ${formatDate(new Date())}`
            : selectedMeta?.title ?? "Practice Session";

    const config: ExamConfig = {
      mode: selectedMode,
      subjects: Array.from(new Set(chosen.map((question) => question.subject))),
      topics: Array.from(new Set(chosen.map((question) => question.topic))),
      questionCount: chosen.length,
      durationMinutes: duration,
      difficulty,
      title
    };
    saveExamSession(createExamSession(config, chosen));
    router.push("/exam/run");
  };

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Practice hub"
        title="Choose a session that fits today"
        description="Short drills for busy days, focused topic work when something is slipping, or weakness training built from your own accuracy data."
        actions={
          <Link href="/exam" className="btn-primary">
            <ClipboardCheck className="h-4 w-4" />
            Full CBT simulation
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="card flex items-center gap-3 p-4">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-muted">Overall accuracy</p>
            <p className="text-lg font-bold text-ink">{performance.overall.accuracy}%</p>
          </div>
        </div>
        <div className="card flex items-center gap-3 p-4">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/10 text-amber-400">
            <RotateCcw className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-muted">Questions to revise</p>
            <p className="text-lg font-bold text-ink">{revisionQuestions.length}</p>
          </div>
        </div>
        <div className="card flex items-center gap-3 p-4">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <CalendarCheck className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-muted">Daily challenge</p>
            <p className="text-lg font-bold text-ink">
              {daily?.completed ? `${daily.score}% done` : "Not started"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {PRACTICE_MODES.map((mode) => {
              const Icon = MODE_ICONS[mode.icon] ?? Sparkles;
              const selected = selectedMode === mode.mode;
              const disabled = mode.mode === "revision" && revisionQuestions.length === 0;
              return (
                <button
                  key={mode.mode}
                  type="button"
                  onClick={() => chooseMode(mode.mode)}
                  aria-pressed={selected}
                  className={cn(
                    "card card-hover relative flex flex-col p-4 text-left transition",
                    selected && "border-brand-500/50 ring-1 ring-brand-500/30",
                    disabled && "opacity-70"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-white",
                        mode.accent
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink">{mode.title}</p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
                        {mode.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="chip">{mode.questions} questions</span>
                    <span className="chip">{mode.duration} min</span>
                    {mode.mode === "daily-challenge" && daily?.completed ? (
                      <Badge tone="success">Completed today</Badge>
                    ) : null}
                    {disabled ? <Badge tone="neutral">No mistakes yet</Badge> : null}
                    {selected ? (
                      <span className="ml-auto text-[11px] font-semibold text-brand-400">
                        Selected
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="card p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Target className="h-4 w-4 text-rose-400" />
              What your data suggests
            </h2>
            {performance.weakestTopics.length ? (
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {performance.weakestTopics.slice(0, 3).map((topicEntry) => (
                  <div
                    key={`${topicEntry.subject}-${topicEntry.topic}`}
                    className="rounded-xl border border-line/10 bg-white/[0.02] p-3"
                  >
                    <div className="flex items-center gap-2">
                      <SubjectIcon subject={topicEntry.subject} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-ink">
                          {topicEntry.topic}
                        </p>
                        <p className="truncate text-[10px] text-muted">
                          {subjectName(topicEntry.subject)}
                        </p>
                      </div>
                    </div>
                    <Progress value={topicEntry.accuracy} className="mt-2 h-1.5" />
                    <p className="mt-1 text-[10px] text-muted">
                      {topicEntry.accuracy}% over {topicEntry.attempted} questions
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-xs leading-relaxed text-muted">
                Complete a few more questions — at least three in a topic — and your weak areas
                will appear here with a one-click training session.
              </p>
            )}
          </div>

          <div className="card p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Info className="h-4 w-4 text-brand-400" />
              How practice scoring works
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Practice modes reveal the correct answer and explanation immediately after you
              choose. Your final score is still saved to analytics, but practice sessions never
              affect the leaderboard. Only full CBTs and custom exams count there.
            </p>
          </div>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="card p-5">
            {selectedMode ? (
              <>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-400">
                  Session setup
                </p>
                <h2 className="mt-1 text-lg font-bold text-ink">
                  {selectedMeta?.title ?? "Practice session"}
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {selectedMeta?.description}
                </p>

                <div className="mt-4 space-y-3">
                  {selectedMode === "subject-practice" || selectedMode === "topic-practice" ? (
                    <div>
                      <label htmlFor="practice-subject" className="label">
                        Subject
                      </label>
                      <select
                        id="practice-subject"
                        className="input"
                        value={subject}
                        onChange={(event) => setSubject(event.target.value)}
                      >
                        {SUBJECTS.map((item) => (
                          <option key={item.slug} value={item.slug}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : null}

                  {selectedMode === "topic-practice" ? (
                    <div>
                      <label htmlFor="practice-topic" className="label">
                        Topic
                      </label>
                      <select
                        id="practice-topic"
                        className="input"
                        value={topic}
                        onChange={(event) => setTopic(event.target.value)}
                      >
                        {topics.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : null}

                  {selectedMode !== "daily-challenge" && selectedMode !== "revision" ? (
                    <div>
                      <label htmlFor="practice-difficulty" className="label">
                        Difficulty
                      </label>
                      <select
                        id="practice-difficulty"
                        className="input"
                        value={difficulty}
                        onChange={(event) =>
                          setDifficulty(event.target.value as "mixed" | Difficulty)
                        }
                      >
                        <option value="mixed">Mixed</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Intermediate</option>
                        <option value="hard">Advanced</option>
                      </select>
                    </div>
                  ) : null}

                  {selectedMode !== "daily-challenge" ? (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label htmlFor="practice-count" className="label">
                          Questions
                        </label>
                        <select
                          id="practice-count"
                          className="input"
                          value={count}
                          onChange={(event) => setCount(Number(event.target.value))}
                        >
                          {COUNTS.map((value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="practice-duration" className="label">
                          Minutes
                        </label>
                        <select
                          id="practice-duration"
                          className="input"
                          value={duration}
                          onChange={(event) => setDuration(Number(event.target.value))}
                        >
                          {DURATIONS.map((value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-xl border border-line/10 bg-white/[0.02] p-2.5">
                        <p className="text-[10px] uppercase tracking-wide text-muted">Questions</p>
                        <p className="text-sm font-semibold text-ink">10</p>
                      </div>
                      <div className="rounded-xl border border-line/10 bg-white/[0.02] p-2.5">
                        <p className="text-[10px] uppercase tracking-wide text-muted">Minutes</p>
                        <p className="text-sm font-semibold text-ink">12</p>
                      </div>
                    </div>
                  )}

                  <div className="rounded-xl border border-line/10 bg-white/[0.02] p-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted">Available questions</span>
                      <span className="font-semibold text-ink">{available.length}</span>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-xs">
                      <span className="text-muted">This session</span>
                      <span className="font-semibold text-brand-400">
                        {actualCount} questions
                      </span>
                    </div>
                    {actualCount < count ? (
                      <p className="mt-2 text-[10px] leading-relaxed text-amber-400">
                        Only {available.length} matching questions are available. The session will
                        use all of them.
                      </p>
                    ) : null}
                  </div>

                  {selectedMode === "daily-challenge" && daily?.completed ? (
                    <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-3 text-[11px] leading-relaxed text-emerald-400">
                      You already completed today&apos;s challenge with {daily.score}%. Repeating
                      it will not double your streak credit.
                    </p>
                  ) : null}

                  {selectedMode === "revision" && revisionQuestions.length === 0 ? (
                    <p className="rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-3 text-[11px] leading-relaxed text-amber-400">
                      No incorrect answers yet. Complete a practice or CBT first, then come back to
                      revise your mistakes.
                    </p>
                  ) : null}

                  {selectedMode === "weakness-training" && !performance.weakestTopics.length ? (
                    <p className="rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-3 text-[11px] leading-relaxed text-amber-400">
                      Not enough topic data yet, so this session will use a mixed set. Answer at
                      least three questions per topic to unlock precise weakness training.
                    </p>
                  ) : null}

                  <button
                    type="button"
                    onClick={startSession}
                    disabled={!canStart || starting}
                    className="btn-primary w-full"
                  >
                    {starting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Preparing…
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" /> Start session
                      </>
                    )}
                  </button>
                  <p className="flex items-center justify-center gap-1.5 text-[10px] text-muted">
                    <Clock3 className="h-3 w-3" />
                    {duration} minutes · answers save automatically
                  </p>
                </div>
              </>
            ) : (
              <div className="py-8 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-brand-500/20 bg-brand-500/10 text-brand-400">
                  <Sparkles className="h-7 w-7" />
                </span>
                <h2 className="mt-3 text-base font-semibold text-ink">Pick a practice mode</h2>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">
                  Each card on the left explains what the session covers. Your setup options will
                  appear here.
                </p>
                <Link href="/exam" className="btn-secondary mt-4 w-full text-xs">
                  Or take a full CBT
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
