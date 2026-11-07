import { describe, expect, it } from "vitest";
import {
  SEED_QUESTIONS,
  bankStats,
  filterQuestions,
  getDailyQuestionIds,
  getQuestionById,
  getQuestionsForSubject,
  pickQuestions,
  questionCountsBySubject,
  questionOfTheDay,
  seededShuffle
} from "@/lib/questions";
import { SUBJECTS, getSubject } from "@/lib/subjects";

function normalise(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

describe("seed question bank", () => {
  it("contains exactly 800 questions across 16 subjects", () => {
    expect(SEED_QUESTIONS).toHaveLength(800);
    expect(SUBJECTS).toHaveLength(16);
    expect(bankStats().total).toBe(800);
  });

  it("has exactly 50 questions in every subject", () => {
    const counts = questionCountsBySubject();
    for (const subject of SUBJECTS) {
      expect(counts[subject.slug], `${subject.name} count`).toBe(50);
      expect(getQuestionsForSubject(subject.slug)).toHaveLength(50);
    }
  });

  it("uses unique, stable IDs and unique question text", () => {
    const ids = new Set(SEED_QUESTIONS.map((question) => question.id));
    const texts = new Set(SEED_QUESTIONS.map((question) => normalise(question.text)));
    expect(ids.size).toBe(SEED_QUESTIONS.length);
    expect(texts.size).toBe(SEED_QUESTIONS.length);
  });

  it("every question has four distinct options and a valid answer key", () => {
    for (const question of SEED_QUESTIONS) {
      expect(question.options, question.id).toHaveLength(4);
      // Genotype options such as "AA" and "Aa" are legitimately case-sensitive.
      const options = question.options.map((option) => option.trim());
      expect(options.every(Boolean), `${question.id} has empty option`).toBe(true);
      expect(new Set(options).size, `${question.id} has duplicate options`).toBe(4);
      expect([0, 1, 2, 3], question.id).toContain(question.correctIndex);
      expect(question.explanation.trim().length, question.id).toBeGreaterThanOrEqual(20);
      expect(question.source, question.id).toBe("practice");
      expect(question.isCustom, question.id).toBeUndefined();
    }
  });

  it("uses topics that belong to the question's subject", () => {
    for (const question of SEED_QUESTIONS) {
      const subject = getSubject(question.subject);
      expect(subject, question.id).toBeDefined();
      expect(subject?.topics, `${question.id} (${question.topic})`).toContain(question.topic);
    }
  });

  it("looks up questions by ID and fails safely for unknown IDs", () => {
    const first = SEED_QUESTIONS[0];
    expect(getQuestionById(first.id)).toEqual(first);
    expect(getQuestionById("does-not-exist")).toBeUndefined();
  });
});

describe("question selection", () => {
  it("is deterministic for a given seed", () => {
    const first = pickQuestions({ subjects: ["mathematics"] }, 10, "attempt-1");
    const second = pickQuestions({ subjects: ["mathematics"] }, 10, "attempt-1");
    expect(first.map((question) => question.id)).toEqual(second.map((question) => question.id));
    expect(first).toHaveLength(10);
    expect(first.every((question) => question.subject === "mathematics")).toBe(true);
  });

  it("produces a different order for a different seed", () => {
    const a = seededShuffle(SEED_QUESTIONS, "seed-a").map((question) => question.id);
    const b = seededShuffle(SEED_QUESTIONS, "seed-b").map((question) => question.id);
    expect(a).not.toEqual(b);
    expect(a).toHaveLength(SEED_QUESTIONS.length);
    expect(new Set(a).size).toBe(SEED_QUESTIONS.length);
  });

  it("filters by difficulty, subject and excluded IDs", () => {
    const pool = filterQuestions({ subjects: ["physics"], difficulty: "hard" });
    expect(pool.length).toBeGreaterThan(0);
    expect(pool.every((question) => question.subject === "physics")).toBe(true);
    expect(pool.every((question) => question.difficulty === "hard")).toBe(true);

    const excluded = pool[0].id;
    const withoutFirst = filterQuestions({
      subjects: ["physics"],
      difficulty: "hard",
      excludeIds: [excluded]
    });
    expect(withoutFirst.some((question) => question.id === excluded)).toBe(false);
  });

  it("returns a stable daily set of unique IDs", () => {
    const ids = getDailyQuestionIds("2026-11-06");
    expect(ids).toHaveLength(10);
    expect(new Set(ids).size).toBe(10);
    expect(getDailyQuestionIds("2026-11-06")).toEqual(ids);
    expect(getDailyQuestionIds("2026-11-07")).not.toEqual(ids);
  });

  it("returns the same question of the day for the same date", () => {
    const today = questionOfTheDay("2026-11-06");
    expect(questionOfTheDay("2026-11-06").id).toBe(today.id);
    expect(SEED_QUESTIONS.some((question) => question.id === today.id)).toBe(true);
  });
});
