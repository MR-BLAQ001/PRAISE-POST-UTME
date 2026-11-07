import { describe, expect, it } from "vitest";
import { SEED_QUESTIONS } from "@/lib/questions";
import { computeSubjectBreakdown, pointsFor, scoreExam } from "@/lib/scoring";
import type { ExamConfig, Question } from "@/lib/types";

const config: ExamConfig = {
  mode: "full-cbt",
  subjects: ["mathematics"],
  topics: [],
  questionCount: 5,
  durationMinutes: 10,
  difficulty: "mixed",
  title: "Test CBT"
};

const questions = SEED_QUESTIONS.slice(0, 5);

function score(answers: Record<string, number | null>, overrides: Partial<Parameters<typeof scoreExam>[0]> = {}) {
  return scoreExam({
    questions,
    answers,
    config,
    attemptId: "attempt-test",
    userId: "usr_test",
    userName: "Test Student",
    username: "tester",
    startedAt: "2026-11-06T09:00:00.000Z",
    completedAt: "2026-11-06T09:10:00.000Z",
    durationSeconds: 600,
    timeSpentSeconds: 540,
    ...overrides
  });
}

describe("pointsFor", () => {
  it("awards 10 points per correct answer", () => {
    expect(pointsFor(0, 0)).toBe(0);
    expect(pointsFor(7, 70)).toBe(70);
  });

  it("adds a 50-point bonus for a perfect score", () => {
    expect(pointsFor(20, 100)).toBe(250);
  });
});

describe("scoreExam", () => {
  it("counts correct, incorrect and unanswered answers", () => {
    const answers: Record<string, number | null> = {
      [questions[0].id]: questions[0].correctIndex,
      [questions[1].id]: (questions[1].correctIndex + 1) % 4,
      [questions[2].id]: null,
      [questions[3].id]: null,
      [questions[4].id]: null
    };
    const result = score(answers);
    expect(result.total).toBe(5);
    expect(result.correct).toBe(1);
    expect(result.incorrect).toBe(1);
    expect(result.unanswered).toBe(3);
    expect(result.percentage).toBe(20);
    expect(result.points).toBe(10);
    expect(result.passed).toBe(false);
    expect(result.id).toBe("res_attempt-test");
    expect(result.validation).toBe("server");
  });

  it("rejects out-of-range or non-numeric selections as unanswered", () => {
    const result = score({
      [questions[0].id]: 9,
      [questions[1].id]: -2
    });
    expect(result.unanswered).toBe(5);
    expect(result.correct).toBe(0);
  });

  it("marks a perfect paper as passed with the perfect bonus", () => {
    const answers = Object.fromEntries(
      questions.map((question) => [question.id, question.correctIndex])
    );
    const result = score(answers, { passMark: 50 });
    expect(result.correct).toBe(5);
    expect(result.percentage).toBe(100);
    expect(result.points).toBe(100);
    expect(result.passed).toBe(true);
  });

  it("honours a custom pass mark", () => {
    const answers = Object.fromEntries(
      questions.slice(0, 3).map((question) => [question.id, question.correctIndex])
    );
    const result = score(answers, { passMark: 70 });
    expect(result.percentage).toBe(60);
    expect(result.passed).toBe(false);
  });

  it("preserves snapshots of question content for review", () => {
    const result = score({});
    expect(result.answers).toHaveLength(questions.length);
    result.answers.forEach((answer, index) => {
      expect(answer.questionId).toBe(questions[index].id);
      expect(answer.text).toBe(questions[index].text);
      expect(answer.options).toEqual(questions[index].options);
      expect(answer.explanation).toBe(questions[index].explanation);
    });
  });

  it("clamps negative duration values", () => {
    const result = score({}, { durationSeconds: -10, timeSpentSeconds: -3 });
    expect(result.durationSeconds).toBe(0);
    expect(result.timeSpentSeconds).toBe(0);
  });
});

describe("computeSubjectBreakdown", () => {
  it("groups answers by subject and reports percentage", () => {
    const result = score({
      [questions[0].id]: questions[0].correctIndex,
      [questions[1].id]: null
    });
    const breakdown = computeSubjectBreakdown(result);
    const totalAttempted = breakdown.reduce((sum, item) => sum + item.total, 0);
    expect(totalAttempted).toBe(result.total);
    expect(breakdown.every((item) => item.percentage >= 0 && item.percentage <= 100)).toBe(true);
  });
});
