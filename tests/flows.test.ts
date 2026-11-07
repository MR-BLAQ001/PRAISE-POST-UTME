import { describe, expect, it } from "vitest";
import {
  DEMO_ACCOUNTS,
  addCustomQuestion,
  createGuest,
  createSeedDB,
  deleteQuestion,
  deleteUserAccount,
  findUserByLogin,
  importQuestions,
  mergedQuestions,
  registerUser,
  resetDemoData,
  saveExamResult,
  sanitizeUser,
  toggleBookmark,
  saveNote,
  updateQuestion,
  updateSettings,
  verifyPassword
} from "@/lib/demo-db";
import { buildLeaderboard } from "@/lib/leaderboard";
import { isServerScorable } from "@/lib/exam";
import { SEED_QUESTIONS } from "@/lib/questions";
import { scoreExam } from "@/lib/scoring";
import type { AdminQuestionInput, ExamResult } from "@/lib/types";

async function seed() {
  return createSeedDB();
}

function makeInput(overrides: Partial<AdminQuestionInput> = {}): AdminQuestionInput {
  return {
    subject: "mathematics",
    topic: "Algebra",
    difficulty: "easy",
    text: "What is the value of 3x when x = 4?",
    options: ["7", "12", "34", "43"],
    correctIndex: 1,
    explanation: "Substitute x = 4 into 3x to get 3 × 4 = 12.",
    ...overrides
  };
}

async function makeResult(userId: string, attemptId: string, correct = 8, total = 10) {
  const questions = SEED_QUESTIONS.slice(0, total);
  const answers = Object.fromEntries(
    questions.map((question, index) => [
      question.id,
      index < correct ? question.correctIndex : (question.correctIndex + 1) % 4
    ])
  );
  return scoreExam({
    questions,
    answers,
    config: {
      mode: "full-cbt",
      subjects: ["mathematics"],
      topics: [],
      questionCount: total,
      durationMinutes: 10,
      difficulty: "mixed",
      title: "Flow CBT"
    },
    attemptId,
    userId,
    userName: userId,
    username: userId,
    startedAt: "2026-11-06T09:00:00.000Z",
    completedAt: "2026-11-06T09:09:00.000Z",
    durationSeconds: 600,
    timeSpentSeconds: 540
  });
}

describe("demo account flows", () => {
  it("seeds the documented demo accounts with verifiable passwords", async () => {
    const db = await seed();
    expect(db.users).toHaveLength(2);

    const admin = findUserByLogin(db, DEMO_ACCOUNTS.admin.email)!;
    const student = findUserByLogin(db, DEMO_ACCOUNTS.student.email)!;
    expect(admin.role).toBe("admin");
    expect(student.role).toBe("student");
    expect(await verifyPassword(admin, DEMO_ACCOUNTS.admin.password)).toBe(true);
    expect(await verifyPassword(student, DEMO_ACCOUNTS.student.password)).toBe(true);
    expect(await verifyPassword(student, "WrongPassword1")).toBe(false);

    // Usernames work as login identifiers too.
    expect(findUserByLogin(db, "demo_scholar")?.id).toBe(student.id);
  });

  it("never exposes password hashes through sanitizeUser", async () => {
    const db = await seed();
    const profile = sanitizeUser(db.users[0]);
    expect(profile).not.toHaveProperty("passwordHash");
    expect(profile).not.toHaveProperty("passwordSalt");
  });

  it("registers new students, signs them in and rejects duplicates", async () => {
    const db = await seed();
    const result = await registerUser(db, {
      displayName: "Ada Okafor",
      username: "ada_okafor",
      email: "ada@example.com",
      password: "Study123!",
      school: "Federal Government College",
      preferredSubjects: ["english-language", "mathematics"]
    });
    expect("db" in result).toBe(true);
    if (!("db" in result)) return;

    expect(result.db.users).toHaveLength(3);
    expect(result.db.sessionUserId).toBe(result.user.id);
    expect(result.db.plans[result.user.id]).toBeDefined();
    expect(result.db.notifications.some((n) => n.userId === result.user.id)).toBe(true);
    expect(await verifyPassword(result.user, "Study123!")).toBe(true);

    const duplicateEmail = await registerUser(result.db, {
      displayName: "Another Ada",
      username: "another_ada",
      email: "ADA@example.com",
      password: "Study123!",
      school: "",
      preferredSubjects: []
    });
    expect("error" in duplicateEmail).toBe(true);

    const duplicateUsername = await registerUser(result.db, {
      displayName: "Another Ada",
      username: "ADA_OKAFOR",
      email: "other@example.com",
      password: "Study123!",
      school: "",
      preferredSubjects: []
    });
    expect("error" in duplicateUsername).toBe(true);

    const weak = await registerUser(result.db, {
      displayName: "Weak",
      username: "weak_pass",
      email: "weak@example.com",
      password: "short",
      school: "",
      preferredSubjects: []
    });
    expect("error" in weak).toBe(true);
  });

  it("creates guests who are hidden from the leaderboard", async () => {
    const db = await seed();
    const guest = await createGuest(db, "Visitor");
    expect(guest.user.isGuest).toBe(true);
    expect(guest.user.leaderboardOptOut).toBe(true);
    expect(guest.db.sessionUserId).toBe(guest.user.id);

    const results = [await makeResult(guest.user.id, "att_guest")];
    const board = buildLeaderboard({
      results,
      users: guest.db.users.map(sanitizeUser),
      currentUserId: guest.user.id
    });
    expect(board.entries).toEqual([]);
    expect(board.total).toBe(0);
  });
});

describe("result persistence flows", () => {
  it("saves a result once, notifies the student and records activity", async () => {
    const db = await seed();
    const student = findUserByLogin(db, "demo@praise.ng")!;
    const result = await makeResult(student.id, "att_flow_1");

    const saved = saveExamResult(db, result);
    expect(saved.results).toHaveLength(1);
    expect(saved.notifications.some((n) => n.userId === student.id && n.href === `/results/${result.id}`)).toBe(true);
    expect(saved.activities[0].type).toBe("exam");

    const duplicate = saveExamResult(saved, result);
    expect(duplicate.results).toHaveLength(1);
  });

  it("ranks real saved results and ignores practice plus ineligible users", async () => {
    const db = await seed();
    const student = findUserByLogin(db, DEMO_ACCOUNTS.student.email)!;
    const admin = findUserByLogin(db, DEMO_ACCOUNTS.admin.email)!;
    const strong = await makeResult(student.id, "att_strong", 9, 10);
    const adminResult = await makeResult(admin.id, "att_admin", 10, 10);

    let saved = saveExamResult(db, strong);
    saved = saveExamResult(saved, adminResult);

    const board = buildLeaderboard({
      results: saved.results,
      users: saved.users.map(sanitizeUser),
      currentUserId: student.id
    });
    expect(board.entries).toHaveLength(1);
    expect(board.entries[0].userId).toBe(student.id);
    expect(board.entries[0].averageScore).toBe(90);
    expect(board.personal?.rank).toBe(1);
  });

  it("keeps bookmarks and notes scoped to their owners", async () => {
    const db = await seed();
    const student = findUserByLogin(db, "demo@praise.ng")!;
    const admin = findUserByLogin(db, "admin@praise.ng")!;
    const question = SEED_QUESTIONS[0];

    let next = toggleBookmark(db, student.id, question.id);
    expect(next.bookmarks).toHaveLength(1);
    expect(next.bookmarks[0].userId).toBe(student.id);

    next = toggleBookmark(next, student.id, question.id);
    expect(next.bookmarks).toHaveLength(0);

    next = saveNote(next, {
      userId: admin.id,
      questionId: question.id,
      title: "Admin note",
      body: "Private"
    });
    expect(next.notes).toHaveLength(1);
    expect(next.notes[0].userId).toBe(admin.id);
  });
});

describe("admin question flows", () => {
  it("adds, edits, imports and deletes questions", async () => {
    const db = await seed();
    const baseline = mergedQuestions(db).length;
    expect(baseline).toBe(800);

    const added = addCustomQuestion(db, makeInput());
    const created = mergedQuestions(added).at(-1)!;
    expect(created.source).toBe("custom");
    expect(created.isCustom).toBe(true);
    expect(added.customQuestions).toHaveLength(1);

    const edited = updateQuestion(added, created.id, makeInput({ text: "What is 4 × 3?", correctIndex: 1 }));
    expect(edited.customQuestions[0].text).toBe("What is 4 × 3?");
    expect(edited.overrides).toEqual({});

    const imported = importQuestions(edited, [makeInput({ text: "Import me: 5 + 5 = ?" })]);
    expect(imported.customQuestions).toHaveLength(2);

    const deleted = deleteQuestion(imported, created.id);
    expect(deleted.customQuestions).toHaveLength(1);
    expect(deleted.deletedQuestionIds).toContain(created.id);
  });

  it("overrides seed questions and makes them locally scored", async () => {
    const db = await seed();
    const seedQuestion = SEED_QUESTIONS[0];
    const edited = updateQuestion(db, seedQuestion.id, makeInput({ text: "Edited seed question for review?" }));

    expect(edited.overrides[seedQuestion.id].text).toBe("Edited seed question for review?");
    const merged = mergedQuestions(edited).find((question) => question.id === seedQuestion.id)!;
    expect(merged.text).toBe("Edited seed question for review?");
    expect(isServerScorable([merged])).toBe(false);
  });

  it("hides deleted seed questions from the active bank", async () => {
    const db = await seed();
    const seedQuestion = SEED_QUESTIONS[0];
    const deleted = deleteQuestion(db, seedQuestion.id);
    const merged = mergedQuestions(deleted);
    expect(merged.some((question) => question.id === seedQuestion.id)).toBe(false);
    expect(merged).toHaveLength(799);
  });

  it("updates platform settings without touching unrelated data", async () => {
    const db = await seed();
    const next = updateSettings(db, { passMark: 60, maintenance: true, siteNotice: "Notice" });
    expect(next.settings).toEqual({ passMark: 60, maintenance: true, siteNotice: "Notice" });
    expect(next.users).toHaveLength(db.users.length);
  });
});

describe("account deletion and demo reset", () => {
  it("removes every trace of a deleted student", async () => {
    const db = await seed();
    const student = findUserByLogin(db, DEMO_ACCOUNTS.student.email)!;
    const question = SEED_QUESTIONS[0];
    let next = saveExamResult(db, await makeResult(student.id, "att_delete"));
    next = toggleBookmark(next, student.id, question.id);
    next = saveNote(next, { userId: student.id, questionId: question.id, title: "Note", body: "" });
    next = {
      ...next,
      dailyChallenges: {
        [`${student.id}:2026-11-06`]: {
          date: "2026-11-06",
          completed: true,
          score: 80,
          resultId: null
        }
      }
    };

    const deleted = deleteUserAccount(next, student.id);
    expect(deleted.users.some((user) => user.id === student.id)).toBe(false);
    expect(deleted.results).toHaveLength(0);
    expect(deleted.bookmarks).toHaveLength(0);
    expect(deleted.notes).toHaveLength(0);
    expect(deleted.notifications.some((n) => n.userId === student.id)).toBe(false);
    expect(deleted.activities.some((activity) => activity.userId === student.id)).toBe(false);
    expect(deleted.plans[student.id]).toBeUndefined();
    expect(Object.keys(deleted.dailyChallenges)).toHaveLength(0);
  });

  it("resets demo data but keeps the two seeded accounts", async () => {
    const db = await seed();
    const student = findUserByLogin(db, DEMO_ACCOUNTS.student.email)!;
    const withData = saveExamResult(db, await makeResult(student.id, "att_reset"));

    const reset = resetDemoData(withData);
    expect(reset.results).toHaveLength(0);
    expect(reset.users.map((user) => user.id).sort()).toEqual(["usr_admin", "usr_demo"]);
    expect(reset.customQuestions).toHaveLength(0);
    expect(reset.settings.passMark).toBe(50);
  });
});
