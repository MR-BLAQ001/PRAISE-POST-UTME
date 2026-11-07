import { describe, expect, it } from "vitest";
import { buildLeaderboard } from "@/lib/leaderboard";
import type { ExamMode, ExamQuestionResult, ExamResult, UserProfile } from "@/lib/types";

function user(id: string, overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    id,
    username: id,
    email: `${id}@example.com`,
    displayName: id.toUpperCase(),
    role: "student",
    school: "Test School",
    universityId: null,
    preferredSubjects: [],
    avatar: null,
    bio: "",
    leaderboardOptOut: false,
    isGuest: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    lastActiveAt: "2026-11-06T00:00:00.000Z",
    ...overrides
  };
}

function answer(
  subject: string,
  correct: boolean,
  index = 0
): ExamQuestionResult {
  return {
    questionId: `q-${index}`,
    subject,
    topic: "Topic",
    difficulty: "medium",
    text: "Question",
    options: ["A", "B", "C", "D"],
    selectedIndex: correct ? 1 : 0,
    correctIndex: 1,
    explanation: "Explanation",
    isCorrect: correct
  };
}

function result(options: {
  id: string;
  userId: string;
  mode?: ExamMode;
  correct: number;
  total: number;
  points?: number;
  completedAt?: string;
  answers?: ExamQuestionResult[];
}): ExamResult {
  const {
    id,
    userId,
    mode = "full-cbt",
    correct,
    total,
    points = correct * 10,
    completedAt = new Date().toISOString(),
    answers
  } = options;
  return {
    id,
    attemptId: `att-${id}`,
    userId,
    userName: userId,
    username: userId,
    mode,
    title: "Test",
    subjects: ["mathematics"],
    answers:
      answers ??
      Array.from({ length: total }, (_, index) => answer("mathematics", index < correct, index)),
    total,
    correct,
    incorrect: total - correct,
    unanswered: 0,
    percentage: total ? Math.round((correct / total) * 100) : 0,
    durationSeconds: 600,
    timeSpentSeconds: 500,
    startedAt: completedAt,
    completedAt,
    points,
    passed: correct / total >= 0.5,
    validation: "server"
  };
}

const oldDate = new Date(Date.now() - 40 * 86_400_000).toISOString();

describe("buildLeaderboard", () => {
  it("ranks eligible students by accuracy, then points, then exams", () => {
    const users = [user("alice"), user("bob"), user("carol")];
    const results = [
      result({ id: "r1", userId: "alice", correct: 16, total: 20, points: 160 }),
      result({ id: "r2", userId: "bob", correct: 18, total: 20, points: 180 }),
      result({ id: "r3", userId: "carol", correct: 16, total: 20, points: 120 }),
      result({ id: "r4", userId: "carol", correct: 4, total: 5, points: 40 })
    ];

    const { entries, total } = buildLeaderboard({ results, users });
    expect(total).toBe(3);
    expect(entries.map((entry) => entry.userId)).toEqual(["bob", "carol", "alice"]);
    expect(entries[0].rank).toBe(1);
    expect(entries[0].averageScore).toBe(90);
    // Carol and Alice both average 80% with 160 points; Carol wins the exam-count tie-break.
    expect(entries[1].averageScore).toBe(80);
    expect(entries[2].averageScore).toBe(80);
    expect(entries[1].points).toBe(160);
    expect(entries[1].exams).toBe(2);
    expect(entries[2].exams).toBe(1);
  });

  it("excludes guests, opted-out students, administrators and unranked modes", () => {
    const users = [
      user("student"),
      user("guest", { isGuest: true }),
      user("hidden", { leaderboardOptOut: true }),
      user("admin", { role: "admin" })
    ];
    const results = [
      result({ id: "r1", userId: "student", correct: 10, total: 20 }),
      result({ id: "r2", userId: "student", mode: "quick-practice", correct: 20, total: 20 }),
      result({ id: "r3", userId: "guest", correct: 20, total: 20 }),
      result({ id: "r4", userId: "hidden", correct: 20, total: 20 }),
      result({ id: "r5", userId: "admin", correct: 20, total: 20 }),
      result({ id: "r6", userId: "student", mode: "custom", correct: 5, total: 10 })
    ];

    const { entries, total } = buildLeaderboard({ results, users });
    expect(total).toBe(1);
    expect(entries).toHaveLength(1);
    expect(entries[0].userId).toBe("student");
    expect(entries[0].exams).toBe(2);
    expect(entries[0].points).toBe(150);
    expect(entries[0].averageScore).toBe(50);
  });

  it("filters by weekly, monthly and all-time periods", () => {
    const users = [user("alice")];
    const results = [
      result({ id: "recent", userId: "alice", correct: 10, total: 10 }),
      result({
        id: "old",
        userId: "alice",
        correct: 2,
        total: 10,
        completedAt: oldDate
      })
    ];

    expect(buildLeaderboard({ results, users, period: "all-time" }).entries[0].exams).toBe(2);
    expect(buildLeaderboard({ results, users, period: "weekly" }).entries[0].exams).toBe(1);
    expect(buildLeaderboard({ results, users, period: "monthly" }).entries[0].exams).toBe(1);
  });

  it("recomputes rankings for a subject filter", () => {
    const users = [user("alice"), user("bob")];
    const results = [
      result({
        id: "r1",
        userId: "alice",
        correct: 2,
        total: 4,
        answers: [
          answer("mathematics", true, 0),
          answer("mathematics", true, 1),
          answer("english-language", false, 2),
          answer("english-language", false, 3)
        ]
      }),
      result({
        id: "r2",
        userId: "bob",
        correct: 3,
        total: 4,
        answers: [
          answer("mathematics", false, 0),
          answer("mathematics", true, 1),
          answer("english-language", true, 2),
          answer("english-language", true, 3)
        ]
      })
    ];

    const standard = buildLeaderboard({ results, users });
    expect(standard.entries[0].userId).toBe("bob");

    const maths = buildLeaderboard({ results, users, subject: "mathematics" });
    expect(maths.entries[0].userId).toBe("alice");
    expect(maths.entries[0].points).toBe(20);
    expect(maths.entries[1].userId).toBe("bob");
    expect(maths.entries[1].points).toBe(10);
  });

  it("returns a personal entry and honours the limit", () => {
    const users = [user("alice"), user("bob"), user("carol")];
    const results = [
      result({ id: "r1", userId: "alice", correct: 20, total: 20 }),
      result({ id: "r2", userId: "bob", correct: 10, total: 20 }),
      result({ id: "r3", userId: "carol", correct: 5, total: 20 })
    ];
    const { entries, total, personal } = buildLeaderboard({
      results,
      users,
      currentUserId: "carol",
      limit: 2
    });
    expect(total).toBe(3);
    expect(entries).toHaveLength(2);
    expect(personal?.userId).toBe("carol");
    expect(personal?.rank).toBe(3);
    expect(personal?.isCurrentUser).toBe(true);
  });

  it("returns an empty board when there is no ranked activity", () => {
    const users = [user("alice")];
    const { entries, total, personal } = buildLeaderboard({
      results: [],
      users,
      currentUserId: "alice"
    });
    expect(entries).toEqual([]);
    expect(total).toBe(0);
    expect(personal).toBeNull();
  });
});
