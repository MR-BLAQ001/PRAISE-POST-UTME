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
  ChevronDown,
  Clock3,
  Eye,
  EyeOff,
  Lightbulb,
  Play,
  Search,
  Target
} from "lucide-react";
import { SubjectIcon } from "@/components/subjects/subject-icon";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/components/providers/app-provider";
import { useToast } from "@/components/providers/toast-provider";
import { createExamSession, filterByDifficulty, saveExamSession } from "@/lib/exam";
import { buildPerformanceProfile } from "@/lib/performance";
import { getQuestionsForSubject } from "@/lib/questions";
import { getSubject } from "@/lib/subjects";
import { DIFFICULTY_LABEL, cn } from "@/lib/utils";
import type { Difficulty, Question } from "@/lib/types";

const LETTERS = ["A", "B", "C", "D"];

export default function SubjectDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const toast = useToast();
  const { user, questionBank, userResults, userPractice, isBookmarked, bookmark } = useApp();

  const subject = getSubject(params.slug);

  const [difficulty, setDifficulty] = useState<"mixed" | Difficulty>("mixed");
  const [query, setQuery] = useState("");
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const allQuestions = useMemo(
    () => getQuestionsForSubject(params.slug),
    [params.slug]
  );
  const customQuestions = useMemo(
    () => questionBank.filter((question) => question.subject === params.slug && question.isCustom),
    [questionBank, params.slug]
  );
  const pool = useMemo(() => {
    const seen = new Set<string>();
    return [...allQuestions, ...customQuestions].filter((question) => {
      if (seen.has(question.id)) return false;
      seen.add(question.id);
      return true;
    });
  }, [allQuestions, customQuestions]);

  const performance = useMemo(
    () => buildPerformanceProfile(userResults, userPractice, user?.id),
    [userResults, userPractice, user?.id]
  );
  const subjectStats = performance.subjects.find((entry) => entry.subject === params.slug);
  const subjectTopics = performance.topics.filter((entry) => entry.subject === params.slug);
  const topicAccuracy = useMemo(
    () => new Map(subjectTopics.map((entry) => [entry.topic, entry.accuracy])),
    [subjectTopics]
  );
  const weakTopic = useMemo(() => {
    const sorted = [...subjectTopics].sort((a, b) => a.accuracy - b.accuracy);
    return sorted[0] ?? null;
  }, [subjectTopics]);

  const filtered = useMemo(
    () =>
      filterByDifficulty(pool, difficulty).filter((question) => {
        if (!query.trim()) return true;
        const needle = query.trim().toLowerCase();
        return (
          question.text.toLowerCase().includes(needle) ||
          question.topic.toLowerCase().includes(needle)
        );
      }),
    [pool, difficulty, query]
  );

  if (!user) return null;

  if (!subject) {
    return (
      <div className="mx-auto max-w-xl">
        <EmptyState
          icon={Search}
          title="Subject not found"
          description="That subject does not exist in the syllabus. Browse all subjects to find what you need."
          action={{ label: "Browse subjects", href: "/subjects" }}
        />
      </div>
    );
  }

  const startSession = (questions: Question[], mode: "subject-practice" | "topic-practice", title: string, minutes: number) => {
    if (!questions.length) {
      toast.error("No questions available", "Try a different difficulty or topic.");
      return;
    }
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const chosen = shuffled.slice(0, Math.min(questions.length, 20));
    saveExamSession(
      createExamSession(
        {
          mode,
          subjects: [params.slug],
          topics: Array.from(new Set(chosen.map((question) => question.topic))),
          questionCount: chosen.length,
          durationMinutes: minutes,
          difficulty,
          title
        },
        chosen
      )
    );
    router.push("/exam/run");
  };

  const startSubjectPractice = () =>
    startSession(
      filterByDifficulty(pool, difficulty),
      "subject-practice",
      `${subject.name} Practice`,
      20
    );

  const startTopicPractice = (topic: string) => {
    const questions = pool.filter(
      (question) =>
        question.topic === topic &&
        (difficulty === "mixed" || question.difficulty === difficulty)
    );
    startSession(questions, "topic-practice", `${topic} Drill`, 10);
  };

  const startWeakTopic = () => {
    if (!weakTopic) {
      startSubjectPractice();
      return;
    }
    startTopicPractice(weakTopic.topic);
  };

  return (
    <div className="space-y-5">
      <Link
        href="/subjects"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All subjects
      </Link>

      <div className="card overflow-hidden">
        <div className={cn("h-1.5 bg-gradient-to-r", subject.gradient)} />
        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex items-start gap-4">
            <SubjectIcon subject={subject.slug} size="lg" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge tone="brand">{subject.group}</Badge>
                <Badge tone="neutral">{pool.length} questions</Badge>
                <Badge tone="neutral">{subject.topics.length} topics</Badge>
              </div>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink">{subject.name}</h1>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
                {subject.description}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
            <button type="button" onClick={startSubjectPractice} className="btn-primary">
              <Play className="h-4 w-4" />
              Practise this subject
            </button>
            <button
              type="button"
              onClick={startWeakTopic}
              className="btn-secondary"
              disabled={!subjectTopics.length}
            >
              <Target className="h-4 w-4" />
              Train weak topic
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px border-t border-line/10 bg-line/10 sm:grid-cols-4">
          {[
            {
              label: "Your accuracy",
              value: subjectStats ? `${subjectStats.accuracy}%` : "Not attempted"
            },
            {
              label: "Questions answered",
              value: subjectStats?.attempted ?? 0
            },
            {
              label: "Correct answers",
              value: subjectStats?.correct ?? 0
            },
            {
              label: "Bank size",
              value: pool.length
            }
          ].map((item) => (
            <div key={item.label} className="bg-card px-4 py-3">
              <p className="text-[10px] uppercase tracking-wide text-muted">{item.label}</p>
              <p className="mt-0.5 text-sm font-bold text-ink">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <div className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-ink">Topics in this subject</h2>
              <p className="text-[11px] text-muted">Start a ten-question drill on any topic.</p>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {subject.topics.map((topic) => {
                const count = pool.filter((question) => question.topic === topic).length;
                const accuracy = topicAccuracy.get(topic);
                return (
                  <div
                    key={topic}
                    className="flex items-center gap-3 rounded-xl border border-line/10 bg-white/[0.02] p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-ink">{topic}</p>
                      <p className="text-[10px] text-muted">
                        {count} question{count === 1 ? "" : "s"}
                        {accuracy !== undefined ? ` · ${accuracy}% accuracy` : ""}
                      </p>
                      {accuracy !== undefined ? (
                        <Progress
                          value={accuracy}
                          className="mt-1.5 h-1"
                          barClassName={
                            accuracy >= 70
                              ? "bg-emerald-500"
                              : accuracy >= 50
                                ? "bg-amber-500"
                                : "bg-rose-500"
                          }
                        />
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => startTopicPractice(topic)}
                      disabled={!count}
                      className="btn-secondary shrink-0 px-2.5 py-1.5 text-[10px]"
                    >
                      Drill
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-ink">Question bank preview</h2>
                <p className="mt-0.5 text-[11px] text-muted">
                  Read the questions, reveal answers and bookmark what you want to revisit.
                </p>
              </div>
              <select
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value as "mixed" | Difficulty)}
                aria-label="Filter questions by difficulty"
                className="input h-9 text-xs sm:w-40"
              >
                <option value="mixed">All difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Intermediate</option>
                <option value="hard">Advanced</option>
              </select>
            </div>

            <div className="relative mt-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search questions in this subject"
                aria-label="Search questions"
                className="input h-9 pl-8 text-xs"
              />
            </div>

            <div className="mt-4 space-y-2.5">
              {filtered.slice(0, 25).map((question, index) => {
                const isOpen = revealed[question.id] ?? false;
                const bookmarked = isBookmarked(question.id);
                return (
                  <div key={question.id} className="rounded-xl border border-line/10">
                    <button
                      type="button"
                      onClick={() =>
                        setRevealed((current) => ({
                          ...current,
                          [question.id]: !isOpen
                        }))
                      }
                      aria-expanded={isOpen}
                      className="flex w-full items-start gap-3 p-3.5 text-left"
                    >
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-brand-500/10 text-[10px] font-bold text-brand-300">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="chip">{question.topic}</span>
                          <Badge
                            tone={
                              question.difficulty === "hard"
                                ? "danger"
                                : question.difficulty === "medium"
                                  ? "warning"
                                  : "success"
                            }
                          >
                            {DIFFICULTY_LABEL[question.difficulty]}
                          </Badge>
                          {question.isCustom ? <Badge tone="cyan">Custom</Badge> : null}
                        </div>
                        <p className="mt-1.5 text-xs font-medium leading-relaxed text-ink">
                          {question.text}
                        </p>
                      </div>
                      <ChevronDown
                        className={cn("h-4 w-4 shrink-0 text-muted transition", isOpen && "rotate-180")}
                      />
                    </button>

                    {isOpen ? (
                      <div className="border-t border-line/10 p-3.5">
                        <div className="space-y-1.5">
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={`${question.id}-${optionIndex}`}
                              className={cn(
                                "flex items-start gap-2 rounded-lg border px-2.5 py-1.5 text-[11px]",
                                optionIndex === question.correctIndex
                                  ? "border-emerald-500/40 bg-emerald-500/10 text-ink"
                                  : "border-line/10 text-muted"
                              )}
                            >
                              <span
                                className={cn(
                                  "grid h-4 w-4 shrink-0 place-items-center rounded text-[9px] font-bold",
                                  optionIndex === question.correctIndex
                                    ? "bg-emerald-500 text-white"
                                    : "border border-line/20 text-muted"
                                )}
                              >
                                {optionIndex === question.correctIndex ? (
                                  <Check className="h-2.5 w-2.5" />
                                ) : (
                                  LETTERS[optionIndex]
                                )}
                              </span>
                              {option}
                            </div>
                          ))}
                        </div>
                        <div className="mt-2.5 rounded-lg border border-brand-500/20 bg-brand-500/[0.06] p-2.5">
                          <p className="flex items-center gap-1.5 text-[10px] font-semibold text-brand-300">
                            <Lightbulb className="h-3 w-3" />
                            Explanation
                          </p>
                          <p className="mt-1 text-[11px] leading-relaxed text-muted">
                            {question.explanation}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              bookmark(question.id);
                              toast.success(
                                bookmarked ? "Bookmark removed" : "Bookmarked for revision"
                              );
                            }}
                            className="btn-ghost text-[10px]"
                          >
                            {bookmarked ? (
                              <BookmarkCheck className="h-3 w-3 text-amber-400" />
                            ) : (
                              <Bookmark className="h-3 w-3" />
                            )}
                            {bookmarked ? "Bookmarked" : "Bookmark"}
                          </button>
                          <button
                            type="button"
                            onClick={() => startTopicPractice(question.topic)}
                            className="btn-ghost text-[10px]"
                          >
                            <Play className="h-3 w-3" />
                            Practise this topic
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            {filtered.length > 25 ? (
              <p className="mt-3 text-center text-[11px] text-muted">
                Showing 25 of {filtered.length} matching questions. Start a practice session to see
                them all.
              </p>
            ) : null}

            {!filtered.length ? (
              <p className="mt-3 rounded-xl border border-dashed border-line/20 p-6 text-center text-xs text-muted">
                No questions match this search or difficulty.
              </p>
            ) : null}
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="card p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-400">
              Start practising
            </p>
            <h2 className="mt-1 text-lg font-bold text-ink">{subject.shortName} sessions</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Twenty questions with instant explanations, or a focused ten-question topic drill.
            </p>
            <div className="mt-3 space-y-2">
              <button type="button" onClick={startSubjectPractice} className="btn-primary w-full">
                <Play className="h-4 w-4" />
                Start subject practice
              </button>
              {weakTopic ? (
                <button type="button" onClick={startWeakTopic} className="btn-secondary w-full">
                  <Target className="h-4 w-4" />
                  Drill weakest topic
                </button>
              ) : null}
            </div>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-[10px] text-muted">
              <Clock3 className="h-3 w-3" />
              20 minutes · instant feedback
            </p>
          </div>

          <div className="card p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Target className="h-4 w-4 text-rose-400" />
              Your {subject.shortName} focus
            </p>
            {weakTopic ? (
              <div className="mt-3">
                <p className="text-xs font-medium text-ink">{weakTopic.topic}</p>
                <p className="mt-0.5 text-[11px] text-muted">
                  {weakTopic.accuracy}% accuracy over {weakTopic.attempted} question
                  {weakTopic.attempted === 1 ? "" : "s"}. This is your weakest topic in the subject.
                </p>
                <Progress value={weakTopic.accuracy} className="mt-2 h-1.5" />
                <button type="button" onClick={() => startTopicPractice(weakTopic.topic)} className="btn-secondary mt-3 w-full text-xs">
                  <Play className="h-3.5 w-3.5" />
                  Start a focused drill
                </button>
              </div>
            ) : (
              <p className="mt-2 text-xs leading-relaxed text-muted">
                Answer at least three questions in this subject to see topic-level analysis. Until
                then, start with a mixed subject practice.
              </p>
            )}
          </div>

          {subjectStats ? (
            <div className="card p-5">
              <p className="text-sm font-semibold text-ink">Topic accuracy</p>
              <div className="mt-3 space-y-2.5">
                {subjectTopics.map((topicEntry) => (
                  <div key={topicEntry.topic}>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="truncate text-muted">{topicEntry.topic}</span>
                      <span className="ml-2 shrink-0 font-semibold text-ink">
                        {topicEntry.accuracy}%
                      </span>
                    </div>
                    <Progress
                      value={topicEntry.accuracy}
                      className="mt-1 h-1"
                      barClassName={
                        topicEntry.accuracy >= 70
                          ? "bg-emerald-500"
                          : topicEntry.accuracy >= 50
                            ? "bg-amber-500"
                            : "bg-rose-500"
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <Link href="/library" className="card card-hover flex items-center gap-3 p-4">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-500/10 text-amber-400">
              <Eye className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-semibold text-ink">Bookmarks & notes</p>
              <p className="text-[10px] text-muted">Revisit saved questions in your library</p>
            </div>
            <ArrowRight className="ml-auto h-4 w-4 text-muted" />
          </Link>
          <p className="flex items-center justify-center gap-1.5 text-[10px] text-muted">
            <EyeOff className="h-3 w-3" />
            Answers stay hidden until you reveal them.
          </p>
        </aside>
      </div>
    </div>
  );
}
