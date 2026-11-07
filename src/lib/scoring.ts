import type {
  ExamConfig,
  ExamQuestionResult,
  ExamResult,
  Question
} from "@/lib/types";
import { clamp, percentage } from "@/lib/utils";

export const PASS_MARK = 50;

export interface ScoreExamInput {
  questions: Question[];
  answers: Record<string, number | null>;
  config: ExamConfig;
  attemptId: string;
  userId: string;
  userName: string;
  username: string;
  avatar?: string;
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
  timeSpentSeconds: number;
  validation?: "server" | "client-demo";
  passMark?: number;
}

/** Transparent points rule: 10 per correct answer, +50 for a perfect examination. */
export function pointsFor(correct: number, percentageScore: number): number {
  return correct * 10 + (percentageScore === 100 ? 50 : 0);
}

export function scoreExam(input: ScoreExamInput): ExamResult {
  const {
    questions,
    answers,
    config,
    attemptId,
    userId,
    userName,
    username,
    avatar,
    startedAt,
    completedAt,
    durationSeconds,
    timeSpentSeconds,
    validation = "server",
    passMark = PASS_MARK
  } = input;

  const review: ExamQuestionResult[] = questions.map((question) => {
    const raw = answers[question.id];
    const selectedIndex =
      typeof raw === "number" && raw >= 0 && raw <= 3 ? raw : null;
    return {
      questionId: question.id,
      subject: question.subject,
      topic: question.topic,
      difficulty: question.difficulty,
      text: question.text,
      options: question.options,
      selectedIndex,
      correctIndex: question.correctIndex,
      explanation: question.explanation,
      isCorrect: selectedIndex === question.correctIndex
    };
  });

  const total = review.length;
  const correct = review.filter((r) => r.isCorrect).length;
  const unanswered = review.filter((r) => r.selectedIndex === null).length;
  const incorrect = total - correct - unanswered;
  const percentageScore = percentage(correct, total);
  const points = pointsFor(correct, percentageScore);

  return {
    id: `res_${attemptId}`,
    attemptId,
    userId,
    userName,
    username,
    avatar,
    mode: config.mode,
    title: config.title,
    subjects: config.subjects,
    answers: review,
    total,
    correct,
    incorrect,
    unanswered,
    percentage: percentageScore,
    durationSeconds: Math.max(0, Math.round(durationSeconds)),
    timeSpentSeconds: Math.max(0, Math.round(timeSpentSeconds)),
    startedAt,
    completedAt,
    points,
    passed: percentageScore >= passMark,
    validation
  };
}

export function computeSubjectBreakdown(result: ExamResult) {
  const map = new Map<
    string,
    { subject: string; attempted: number; correct: number; total: number }
  >();
  for (const answer of result.answers) {
    const entry =
      map.get(answer.subject) ??
      { subject: answer.subject, attempted: 0, correct: 0, total: 0 };
    entry.total += 1;
    if (answer.selectedIndex !== null) entry.attempted += 1;
    if (answer.isCorrect) entry.correct += 1;
    map.set(answer.subject, entry);
  }
  return Array.from(map.values()).map((entry) => ({
    ...entry,
    percentage: percentage(entry.correct, entry.total)
  }));
}

export function remainingSeconds(endsAt: string, now = Date.now()): number {
  return Math.max(0, Math.round((new Date(endsAt).getTime() - now) / 1000));
}

export function timeSpent(endsAt: string, durationMinutes: number, now = Date.now()) {
  const total = durationMinutes * 60;
  return clamp(total - remainingSeconds(endsAt, now), 0, total);
}
