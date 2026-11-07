import { englishQuestions } from "@/lib/questions/english";
import { mathematicsQuestions } from "@/lib/questions/mathematics";
import { physicsQuestions } from "@/lib/questions/physics";
import { chemistryQuestions } from "@/lib/questions/chemistry";
import { biologyQuestions } from "@/lib/questions/biology";
import { literatureQuestions } from "@/lib/questions/literature";
import { governmentQuestions } from "@/lib/questions/government";
import { crsQuestions } from "@/lib/questions/crs";
import { irsQuestions } from "@/lib/questions/irs";
import { historyQuestions } from "@/lib/questions/history";
import { economicsQuestions } from "@/lib/questions/economics";
import { commerceQuestions } from "@/lib/questions/commerce";
import { accountingQuestions } from "@/lib/questions/accounting";
import { geographyQuestions } from "@/lib/questions/geography";
import { agricultureQuestions } from "@/lib/questions/agriculture";
import { civicQuestions } from "@/lib/questions/civic";
import { SUBJECTS } from "@/lib/subjects";
import type { Difficulty, Question } from "@/lib/types";

export const SEED_QUESTIONS: Question[] = [
  ...englishQuestions,
  ...mathematicsQuestions,
  ...physicsQuestions,
  ...chemistryQuestions,
  ...biologyQuestions,
  ...literatureQuestions,
  ...governmentQuestions,
  ...crsQuestions,
  ...irsQuestions,
  ...historyQuestions,
  ...economicsQuestions,
  ...commerceQuestions,
  ...accountingQuestions,
  ...geographyQuestions,
  ...agricultureQuestions,
  ...civicQuestions
];

export const QUESTIONS_BY_ID: ReadonlyMap<string, Question> = new Map(
  SEED_QUESTIONS.map((q) => [q.id, q])
);

export function getQuestionById(id: string): Question | undefined {
  return QUESTIONS_BY_ID.get(id);
}

export function getQuestionsForSubject(subject: string): Question[] {
  return SEED_QUESTIONS.filter((q) => q.subject === subject);
}

export function getQuestionsForTopic(subject: string, topic: string): Question[] {
  return SEED_QUESTIONS.filter(
    (q) => q.subject === subject && q.topic === topic
  );
}

export function questionCountsBySubject(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const subject of SUBJECTS) counts[subject.slug] = 0;
  for (const question of SEED_QUESTIONS) {
    counts[question.subject] = (counts[question.subject] ?? 0) + 1;
  }
  return counts;
}

export function topicCounts(subject: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const question of getQuestionsForSubject(subject)) {
    counts[question.topic] = (counts[question.topic] ?? 0) + 1;
  }
  return counts;
}

export function filterQuestions(options: {
  subjects?: string[];
  topics?: string[];
  difficulty?: "mixed" | Difficulty;
  excludeIds?: string[];
}): Question[] {
  const { subjects, topics, difficulty, excludeIds = [] } = options;
  const excluded = new Set(excludeIds);
  return SEED_QUESTIONS.filter((q) => {
    if (subjects?.length && !subjects.includes(q.subject)) return false;
    if (topics?.length && !topics.includes(q.topic)) return false;
    if (difficulty && difficulty !== "mixed" && q.difficulty !== difficulty) return false;
    if (excluded.has(q.id)) return false;
    return true;
  });
}

/** Deterministic pseudo-random shuffle so the same seed always returns the same set. */
export function seededShuffle<T>(items: T[], seed: string): T[] {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    hash = Math.imul(hash ^ (hash >>> 15), 2246822507);
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
    const j = Math.abs(hash) % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function pickQuestions(
  options: Parameters<typeof filterQuestions>[0],
  count: number,
  seed: string
): Question[] {
  return seededShuffle(filterQuestions(options), seed).slice(0, count);
}

export function getDailyQuestionIds(dateKey: string, count = 10): string[] {
  return seededShuffle(SEED_QUESTIONS, `daily-${dateKey}`)
    .slice(0, count)
    .map((q) => q.id);
}

export function questionOfTheDay(dateKey: string): Question {
  return seededShuffle(SEED_QUESTIONS, `qotd-${dateKey}`)[0];
}

export function bankStats() {
  const byDifficulty = { easy: 0, medium: 0, hard: 0 };
  for (const q of SEED_QUESTIONS) byDifficulty[q.difficulty]++;
  return {
    total: SEED_QUESTIONS.length,
    subjects: SUBJECTS.length,
    topics: new Set(SEED_QUESTIONS.map((q) => `${q.subject}:${q.topic}`)).size,
    byDifficulty
  };
}
