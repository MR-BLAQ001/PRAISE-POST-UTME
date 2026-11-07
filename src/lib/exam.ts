import type {
  Difficulty,
  ExamConfig,
  ExamMode,
  ExamSession,
  PracticeAttempt,
  Question
} from "@/lib/types";
import { readStorage, removeStorage, writeStorage } from "@/lib/storage";
import { getQuestionById } from "@/lib/questions";
import { uid } from "@/lib/utils";

/** Modes that count towards leaderboards and CBT milestone achievements. */
export const RANKED_MODES: ExamMode[] = ["full-cbt", "custom"];

export function isRankedMode(mode: ExamMode): boolean {
  return RANKED_MODES.includes(mode);
}

export interface ModeMeta {
  mode: ExamMode;
  title: string;
  short: string;
  description: string;
  icon: string;
  questions: number;
  duration: number;
  accent: string;
}

export const PRACTICE_MODES: ModeMeta[] = [
  {
    mode: "quick-practice",
    title: "Quick Practice",
    short: "Quick",
    description: "Ten mixed questions with instant explanations. Perfect for a short break.",
    icon: "Zap",
    questions: 10,
    duration: 10,
    accent: "from-amber-500 to-orange-600"
  },
  {
    mode: "subject-practice",
    title: "Subject Practice",
    short: "Subject",
    description: "Focus on one subject with a full set of twenty questions.",
    icon: "BookOpen",
    questions: 20,
    duration: 20,
    accent: "from-sky-500 to-blue-600"
  },
  {
    mode: "topic-practice",
    title: "Topic Practice",
    short: "Topic",
    description: "Drill one specific topic until the concept finally clicks.",
    icon: "Target",
    questions: 10,
    duration: 10,
    accent: "from-emerald-500 to-teal-600"
  },
  {
    mode: "daily-challenge",
    title: "Daily Challenge",
    short: "Daily",
    description: "The same ten questions for everyone today. Keep your streak alive.",
    icon: "CalendarCheck",
    questions: 10,
    duration: 12,
    accent: "from-fuchsia-500 to-purple-600"
  },
  {
    mode: "weakness-training",
    title: "Weakness Training",
    short: "Weak spots",
    description: "Questions drawn from the topics where your accuracy is lowest.",
    icon: "TrendingUp",
    questions: 15,
    duration: 18,
    accent: "from-rose-500 to-pink-600"
  },
  {
    mode: "random-challenge",
    title: "Random Challenge",
    short: "Random",
    description: "A surprise mix of subjects and difficulty levels. No warning.",
    icon: "Shuffle",
    questions: 15,
    duration: 15,
    accent: "from-cyan-500 to-blue-600"
  },
  {
    mode: "revision",
    title: "Revision Mode",
    short: "Revision",
    description: "Revisit questions you got wrong and lock in the correct reasoning.",
    icon: "RotateCcw",
    questions: 15,
    duration: 18,
    accent: "from-violet-500 to-indigo-600"
  }
];

export function modeMeta(mode: ExamMode): ModeMeta | undefined {
  return PRACTICE_MODES.find((entry) => entry.mode === mode);
}

export const PRACTICE_MODE_IDS: ExamMode[] = PRACTICE_MODES.map((entry) => entry.mode);

export function isPracticeMode(mode: ExamMode): boolean {
  return PRACTICE_MODE_IDS.includes(mode);
}

export function configTitle(config: ExamConfig): string {
  if (config.title.trim()) return config.title.trim();
  switch (config.mode) {
    case "full-cbt":
      return "Full CBT Simulation";
    case "subject-practice":
      return "Subject Practice";
    case "topic-practice":
      return config.topics[0] ? `Topic Practice: ${config.topics[0]}` : "Topic Practice";
    case "weakness-training":
      return "Weakness Training";
    case "random-challenge":
      return "Random Challenge";
    case "revision":
      return "Revision Session";
    case "daily-challenge":
      return "Daily Challenge";
    case "custom":
      return "Custom Examination";
    default:
      return "Quick Practice";
  }
}

export function createExamSession(config: ExamConfig, questions: Question[]): ExamSession {
  const now = new Date();
  const ends = new Date(now.getTime() + config.durationMinutes * 60_000);
  return {
    attemptId: uid("att"),
    config,
    questionIds: questions.map((question) => question.id),
    answers: Object.fromEntries(questions.map((question) => [question.id, null])),
    marked: [],
    startedAt: now.toISOString(),
    endsAt: ends.toISOString(),
    currentIndex: 0,
    // Snapshot keeps custom and edited questions stable even if the bank changes mid-session.
    customQuestions: questions
  };
}

export function saveExamSession(session: ExamSession): void {
  writeStorage("exam-session", session);
}

export function loadExamSession(): ExamSession | null {
  return readStorage<ExamSession | null>("exam-session", null);
}

export function clearExamSession(): void {
  removeStorage("exam-session");
}

export function questionsForSession(session: ExamSession, bank: Question[]): Question[] {
  const byId = new Map<string, Question>();
  for (const question of bank) byId.set(question.id, question);
  for (const question of session.customQuestions ?? []) byId.set(question.id, question);
  return session.questionIds
    .map((id) => byId.get(id))
    .filter((question): question is Question => Boolean(question));
}

/**
 * Seed questions are scored on the server. Any custom or admin-edited question
 * must be scored locally because the server only knows the original seed data.
 */
export function isServerScorable(questions: Question[]): boolean {
  return questions.every((question) => {
    const seed = getQuestionById(question.id);
    if (!seed) return false;
    if (question.isCustom || question.source === "custom") return false;
    if (question.text !== seed.text) return false;
    if (question.correctIndex !== seed.correctIndex) return false;
    if (question.options.length !== seed.options.length) return false;
    return question.options.every((option, index) => option === seed.options[index]);
  });
}

export function formatCountdown(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function filterByDifficulty(
  questions: Question[],
  difficulty: "mixed" | Difficulty
): Question[] {
  if (difficulty === "mixed") return questions;
  return questions.filter((question) => question.difficulty === difficulty);
}

export function practiceAttemptFromQuestion(
  question: Question,
  selectedIndex: number | null,
  mode: ExamMode,
  userId: string
): PracticeAttempt {
  return {
    id: uid("prac"),
    userId,
    questionId: question.id,
    subject: question.subject,
    topic: question.topic,
    difficulty: question.difficulty,
    selectedIndex,
    correct: selectedIndex === question.correctIndex,
    answeredAt: new Date().toISOString(),
    mode
  };
}
