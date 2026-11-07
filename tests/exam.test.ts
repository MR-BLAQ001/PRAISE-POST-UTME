import { describe, expect, it } from "vitest";
import {
  PRACTICE_MODES,
  RANKED_MODES,
  configTitle,
  createExamSession,
  filterByDifficulty,
  isPracticeMode,
  isRankedMode,
  isServerScorable,
  practiceAttemptFromQuestion,
  questionsForSession
} from "@/lib/exam";
import { SEED_QUESTIONS, getQuestionById } from "@/lib/questions";
import type { ExamConfig } from "@/lib/types";

const config: ExamConfig = {
  mode: "full-cbt",
  subjects: ["mathematics"],
  topics: [],
  questionCount: 10,
  durationMinutes: 15,
  difficulty: "mixed",
  title: ""
};

describe("exam modes", () => {
  it("ranks only full CBTs and custom examinations", () => {
    expect(RANKED_MODES).toEqual(["full-cbt", "custom"]);
    expect(isRankedMode("full-cbt")).toBe(true);
    expect(isRankedMode("custom")).toBe(true);
    expect(isRankedMode("quick-practice")).toBe(false);
    expect(isRankedMode("daily-challenge")).toBe(false);
  });

  it("identifies the seven practice modes", () => {
    expect(PRACTICE_MODES).toHaveLength(7);
    expect(PRACTICE_MODES.every((mode) => isPracticeMode(mode.mode))).toBe(true);
    expect(isPracticeMode("full-cbt")).toBe(false);
    expect(isPracticeMode("custom")).toBe(false);
  });

  it("derives sensible titles", () => {
    expect(configTitle(config)).toBe("Full CBT Simulation");
    expect(configTitle({ ...config, title: "My Mock" })).toBe("My Mock");
    expect(configTitle({ ...config, mode: "topic-practice", topics: ["Algebra"] })).toBe(
      "Topic Practice: Algebra"
    );
    expect(configTitle({ ...config, mode: "custom" })).toBe("Custom Examination");
  });

  it("filters questions by difficulty without mutating the source", () => {
    const hard = filterByDifficulty(SEED_QUESTIONS, "hard");
    expect(hard.length).toBeGreaterThan(0);
    expect(hard.every((question) => question.difficulty === "hard")).toBe(true);
    expect(filterByDifficulty(SEED_QUESTIONS, "mixed")).toBe(SEED_QUESTIONS);
  });
});

describe("exam sessions", () => {
  const questions = SEED_QUESTIONS.slice(0, 5);

  it("creates a session with a unique attempt, timers and blank answers", () => {
    const session = createExamSession(config, questions);
    expect(session.attemptId).toMatch(/^att_/);
    expect(session.questionIds).toEqual(questions.map((question) => question.id));
    expect(Object.keys(session.answers)).toHaveLength(5);
    expect(Object.values(session.answers).every((value) => value === null)).toBe(true);
    expect(session.marked).toEqual([]);
    expect(session.customQuestions).toHaveLength(5);
    expect(new Date(session.endsAt).getTime() - new Date(session.startedAt).getTime()).toBe(
      15 * 60_000
    );
  });

  it("builds different attempt IDs for separate sessions", () => {
    const first = createExamSession(config, questions);
    const second = createExamSession(config, questions);
    expect(first.attemptId).not.toBe(second.attemptId);
  });

  it("resolves questions from the live bank and the session snapshot", () => {
    const session = createExamSession(config, questions);
    expect(questionsForSession(session, SEED_QUESTIONS)).toHaveLength(5);

    const snapshotOnly = {
      ...session,
      customQuestions: [{ ...questions[0], id: "custom_snapshot", isCustom: true } as (typeof questions)[number]],
      questionIds: ["custom_snapshot"]
    };
    expect(questionsForSession(snapshotOnly, SEED_QUESTIONS)[0].id).toBe("custom_snapshot");
  });

  it("drops unknown question IDs from a stale session", () => {
    const session = createExamSession(config, questions);
    const stale = { ...session, questionIds: [...session.questionIds, "missing-id"] };
    expect(questionsForSession(stale, SEED_QUESTIONS)).toHaveLength(5);
  });
});

describe("server scoring eligibility", () => {
  it("accepts untouched seed questions", () => {
    const seed = getQuestionById(SEED_QUESTIONS[0].id)!;
    expect(isServerScorable([seed])).toBe(true);
  });

  it("rejects custom questions and unknown IDs", () => {
    const seed = SEED_QUESTIONS[0];
    expect(isServerScorable([{ ...seed, isCustom: true }])).toBe(false);
    expect(isServerScorable([{ ...seed, source: "custom" }])).toBe(false);
    expect(isServerScorable([{ ...seed, id: "custom_123" }])).toBe(false);
  });

  it("rejects edited seed content", () => {
    const seed = SEED_QUESTIONS[0];
    expect(isServerScorable([{ ...seed, text: `${seed.text} (edited)` }])).toBe(false);
    expect(isServerScorable([{ ...seed, correctIndex: ((seed.correctIndex + 1) % 4) as 0 | 1 | 2 | 3 }])).toBe(
      false
    );
    expect(
      isServerScorable([{ ...seed, options: [seed.options[1], seed.options[0], seed.options[2], seed.options[3]] }])
    ).toBe(false);
  });
});

describe("practiceAttemptFromQuestion", () => {
  it("records the selected answer and correctness", () => {
    const question = SEED_QUESTIONS[0];
    const correctAttempt = practiceAttemptFromQuestion(question, question.correctIndex, "quick-practice", "usr_1");
    expect(correctAttempt.correct).toBe(true);
    expect(correctAttempt.userId).toBe("usr_1");
    expect(correctAttempt.mode).toBe("quick-practice");
    expect(correctAttempt.questionId).toBe(question.id);
    expect(correctAttempt.id).toMatch(/^prac_/);

    const skipped = practiceAttemptFromQuestion(question, null, "revision", "usr_1");
    expect(skipped.correct).toBe(false);
    expect(skipped.selectedIndex).toBeNull();
  });
});
