"use client";

import type {
  AchievementDefinition,
  ActivityEvent,
  AdminQuestionInput,
  Bookmark,
  DailyChallengeState,
  ExamResult,
  Note,
  Notification,
  PracticeAttempt,
  Question,
  QuestionReport,
  StudyPlanner,
  UserProfile
} from "@/lib/types";
import { SEED_QUESTIONS } from "@/lib/questions";
import { hashPassword, makeSalt } from "@/lib/storage";
import { uid } from "@/lib/utils";

export interface StoredUser extends UserProfile {
  passwordHash: string;
  passwordSalt: string;
}

export interface UnlockedAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: string;
}

export interface DemoSettings {
  passMark: number;
  siteNotice: string;
  maintenance: boolean;
}

export interface DemoDB {
  version: number;
  users: StoredUser[];
  sessionUserId: string | null;
  results: ExamResult[];
  practice: PracticeAttempt[];
  bookmarks: Bookmark[];
  notes: Note[];
  reports: QuestionReport[];
  notifications: Notification[];
  plans: Record<string, StudyPlanner>;
  dailyChallenges: Record<string, DailyChallengeState>;
  customQuestions: Question[];
  overrides: Record<string, Partial<Question>>;
  deletedQuestionIds: string[];
  activities: ActivityEvent[];
  unlockedAchievements: UnlockedAchievement[];
  settings: DemoSettings;
}

export const DEMO_ACCOUNTS = {
  admin: { email: "admin@praise.ng", password: "Admin123!" },
  student: { email: "demo@praise.ng", password: "Demo123!" }
};

export const DEFAULT_PLAN: StudyPlanner = {
  examDate: null,
  targetUniversityId: null,
  weeklyGoal: 5,
  tasks: []
};

export function emptyDB(): DemoDB {
  return {
    version: 1,
    users: [],
    sessionUserId: null,
    results: [],
    practice: [],
    bookmarks: [],
    notes: [],
    reports: [],
    notifications: [],
    plans: {},
    dailyChallenges: {},
    customQuestions: [],
    overrides: {},
    deletedQuestionIds: [],
    activities: [],
    unlockedAchievements: [],
    settings: {
      passMark: 50,
      siteNotice: "Welcome to PRAISE POST UTME. Your next breakthrough starts with one practice session.",
      maintenance: false
    }
  };
}

async function makeUser(input: {
  id: string;
  username: string;
  email: string;
  password: string;
  displayName: string;
  role: "student" | "admin";
  school: string;
  preferredSubjects: string[];
}): Promise<StoredUser> {
  const salt = makeSalt();
  const now = new Date().toISOString();
  return {
    id: input.id,
    username: input.username,
    email: input.email.toLowerCase(),
    displayName: input.displayName,
    role: input.role,
    school: input.school,
    universityId: null,
    preferredSubjects: input.preferredSubjects,
    avatar: null,
    bio: "",
    leaderboardOptOut: false,
    isGuest: false,
    createdAt: now,
    lastActiveAt: now,
    passwordHash: await hashPassword(input.password, salt),
    passwordSalt: salt
  };
}

export async function createSeedDB(): Promise<DemoDB> {
  const db = emptyDB();
  const admin = await makeUser({
    id: "usr_admin",
    username: "admin",
    email: DEMO_ACCOUNTS.admin.email,
    password: DEMO_ACCOUNTS.admin.password,
    displayName: "Praise Admin",
    role: "admin",
    school: "PRAISE POST UTME",
    preferredSubjects: ["english-language", "mathematics", "biology"]
  });
  const student = await makeUser({
    id: "usr_demo",
    username: "demo_scholar",
    email: DEMO_ACCOUNTS.student.email,
    password: DEMO_ACCOUNTS.student.password,
    displayName: "Demo Scholar",
    role: "student",
    school: "Demo Secondary School",
    preferredSubjects: ["english-language", "mathematics", "biology"]
  });
  db.users = [admin, student];
  db.plans[admin.id] = { ...DEFAULT_PLAN, targetUniversityId: "unilag" };
  db.plans[student.id] = { ...DEFAULT_PLAN, targetUniversityId: "unilag" };
  db.notifications.push(
    {
      id: uid("ntf"),
      userId: admin.id,
      type: "system",
      title: "Administrator access ready",
      message: "Demo mode is active. Manage questions, students and reports from this dashboard.",
      href: "/admin",
      read: false,
      createdAt: new Date().toISOString()
    },
    {
      id: uid("ntf"),
      userId: student.id,
      type: "system",
      title: "Welcome to PRAISE POST UTME",
      message: "Take your first full CBT or start a quick practice session. Your progress is saved automatically.",
      href: "/practice",
      read: false,
      createdAt: new Date().toISOString()
    }
  );
  return db;
}

export function sanitizeUser(user: StoredUser): UserProfile {
  const { passwordHash: _passwordHash, passwordSalt: _passwordSalt, ...profile } = user;
  void _passwordHash;
  void _passwordSalt;
  return profile;
}

function normalise(value: string) {
  return value.trim().toLowerCase();
}

export function findUserByLogin(db: DemoDB, identifier: string): StoredUser | undefined {
  const key = normalise(identifier);
  return db.users.find(
    (user) => normalise(user.email) === key || normalise(user.username) === key
  );
}

export async function verifyPassword(user: StoredUser, password: string): Promise<boolean> {
  const hash = await hashPassword(password, user.passwordSalt);
  return hash === user.passwordHash;
}

export interface RegisterInput {
  displayName: string;
  username: string;
  email: string;
  password: string;
  school: string;
  preferredSubjects: string[];
}

export async function registerUser(
  db: DemoDB,
  input: RegisterInput
): Promise<{ db: DemoDB; user: StoredUser } | { error: string }> {
  const email = normalise(input.email);
  const username = normalise(input.username);
  if (db.users.some((u) => normalise(u.email) === email)) {
    return { error: "An account with that email already exists. Try logging in instead." };
  }
  if (db.users.some((u) => normalise(u.username) === username)) {
    return { error: "That username is already taken. Choose another one." };
  }
  if (input.password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }
  if (!/[A-Za-z]/.test(input.password) || !/[0-9]/.test(input.password)) {
    return { error: "Use at least one letter and one number in your password." };
  }
  const salt = makeSalt();
  const now = new Date().toISOString();
  const user: StoredUser = {
    id: uid("usr"),
    username,
    email,
    displayName: input.displayName.trim(),
    role: "student",
    school: input.school.trim(),
    universityId: null,
    preferredSubjects: input.preferredSubjects,
    avatar: null,
    bio: "",
    leaderboardOptOut: false,
    isGuest: false,
    createdAt: now,
    lastActiveAt: now,
    passwordHash: await hashPassword(input.password, salt),
    passwordSalt: salt
  };
  const next: DemoDB = {
    ...db,
    users: [...db.users, user],
    sessionUserId: user.id,
    plans: { ...db.plans, [user.id]: { ...DEFAULT_PLAN } },
    notifications: [
      ...db.notifications,
      {
        id: uid("ntf"),
        userId: user.id,
        type: "system",
        title: "Account created",
        message: "Welcome aboard. Start with a quick practice session or take a full CBT simulation.",
        href: "/practice",
        read: false,
        createdAt: now
      }
    ],
    activities: [
      {
        id: uid("act"),
        userId: user.id,
        userName: user.displayName,
        type: "account" as const,
        message: `New student registered: ${user.displayName} (@${user.username})`,
        createdAt: now
      },
      ...db.activities
    ].slice(0, 500)
  };
  return { db: next, user };
}

export async function createGuest(db: DemoDB, displayName = "Guest Scholar"): Promise<{ db: DemoDB; user: StoredUser }> {
  const salt = makeSalt();
  const now = new Date().toISOString();
  const suffix = Math.random().toString(36).slice(2, 6);
  const user: StoredUser = {
    id: uid("guest"),
    username: `guest_${suffix}`,
    email: `guest_${suffix}@local.demo`,
    displayName,
    role: "student",
    school: "",
    universityId: null,
    preferredSubjects: ["english-language", "mathematics", "biology"],
    avatar: null,
    bio: "",
    leaderboardOptOut: true,
    isGuest: true,
    createdAt: now,
    lastActiveAt: now,
    passwordHash: "",
    passwordSalt: salt
  };
  return {
    db: {
      ...db,
      users: [...db.users, user],
      sessionUserId: user.id,
      plans: { ...db.plans, [user.id]: { ...DEFAULT_PLAN } }
    },
    user
  };
}

export function saveExamResult(db: DemoDB, result: ExamResult): DemoDB {
  if (db.results.some((existing) => existing.attemptId === result.attemptId)) {
    return db;
  }
  const user = db.users.find((u) => u.id === result.userId);
  const notification: Notification = {
    id: uid("ntf"),
    userId: result.userId,
    type: "result",
    title: "Your examination result is ready",
    message: `${result.title}: ${result.percentage}% (${result.correct}/${result.total}). View the detailed explanations and review your weak topics.`,
    href: `/results/${result.id}`,
    read: false,
    createdAt: result.completedAt
  };
  return {
    ...db,
    results: [result, ...db.results],
    notifications: [notification, ...db.notifications].slice(0, 200),
    activities: [
      {
        id: uid("act"),
        userId: result.userId,
        userName: result.userName,
        type: "exam" as const,
        message: `${result.userName} completed "${result.title}" with ${result.percentage}%`,
        createdAt: result.completedAt
      },
      ...db.activities
    ].slice(0, 500),
    users: user
      ? db.users.map((u) =>
          u.id === user.id
            ? {
                ...u,
                lastActiveAt: result.completedAt,
                streak: u.streak ?? 0
              }
            : u
        )
      : db.users
  };
}

export function savePracticeAttempt(db: DemoDB, attempt: PracticeAttempt): DemoDB {
  return {
    ...db,
    practice: [attempt, ...db.practice].slice(0, 5000),
    users: db.users.map((user) =>
      user.id === attempt.userId ? { ...user, lastActiveAt: attempt.answeredAt } : user
    )
  };
}

export function saveDailyChallenge(db: DemoDB, state: DailyChallengeState & { userId: string }): DemoDB {
  return {
    ...db,
    dailyChallenges: {
      ...db.dailyChallenges,
      [`${state.userId}:${state.date}`]: state
    }
  };
}

export function toggleBookmark(db: DemoDB, userId: string, questionId: string): DemoDB {
  const exists = db.bookmarks.some((b) => b.userId === userId && b.questionId === questionId);
  return {
    ...db,
    bookmarks: exists
      ? db.bookmarks.filter((b) => !(b.userId === userId && b.questionId === questionId))
      : [{ userId, questionId, createdAt: new Date().toISOString() }, ...db.bookmarks]
  };
}

export function saveNote(
  db: DemoDB,
  input: { id?: string; userId: string; questionId: string | null; title: string; body: string }
): DemoDB {
  const now = new Date().toISOString();
  if (input.id) {
    return {
      ...db,
      notes: db.notes.map((note) =>
        note.id === input.id
          ? { ...note, title: input.title, body: input.body, updatedAt: now }
          : note
      )
    };
  }
  const note: Note = {
    id: uid("note"),
    userId: input.userId,
    questionId: input.questionId,
    title: input.title,
    body: input.body,
    createdAt: now,
    updatedAt: now
  };
  return { ...db, notes: [note, ...db.notes] };
}

export function deleteNote(db: DemoDB, userId: string, noteId: string): DemoDB {
  return {
    ...db,
    notes: db.notes.filter((note) => !(note.id === noteId && note.userId === userId))
  };
}

export function addReport(
  db: DemoDB,
  input: { userId: string; userName: string; questionId: string; subject: string; reason: string; detail: string }
): DemoDB {
  const report: QuestionReport = {
    id: uid("rep"),
    ...input,
    status: "open",
    createdAt: new Date().toISOString()
  };
  return {
    ...db,
    reports: [report, ...db.reports],
    activities: [
      {
        id: uid("act"),
        userId: input.userId,
        userName: input.userName,
        type: "question" as const,
        message: `Question reported: ${input.questionId}`,
        createdAt: report.createdAt
      },
      ...db.activities
    ].slice(0, 500)
  };
}

export function updateReportStatus(
  db: DemoDB,
  reportId: string,
  status: QuestionReport["status"]
): DemoDB {
  return {
    ...db,
    reports: db.reports.map((report) =>
      report.id === reportId ? { ...report, status } : report
    )
  };
}

export function markNotificationRead(db: DemoDB, userId: string, notificationId: string): DemoDB {
  return {
    ...db,
    notifications: db.notifications.map((notification) =>
      notification.id === notificationId && notification.userId === userId
        ? { ...notification, read: true }
        : notification
    )
  };
}

export function markAllNotificationsRead(db: DemoDB, userId: string): DemoDB {
  return {
    ...db,
    notifications: db.notifications.map((notification) =>
      notification.userId === userId ? { ...notification, read: true } : notification
    )
  };
}

export function addNotification(
  db: DemoDB,
  input: Omit<Notification, "id" | "createdAt" | "read">
): DemoDB {
  return {
    ...db,
    notifications: [
      {
        ...input,
        id: uid("ntf"),
        read: false,
        createdAt: new Date().toISOString()
      },
      ...db.notifications
    ].slice(0, 200)
  };
}

export function savePlan(db: DemoDB, userId: string, plan: StudyPlanner): DemoDB {
  return { ...db, plans: { ...db.plans, [userId]: plan } };
}

export function addStudyTask(
  db: DemoDB,
  userId: string,
  input: { title: string; subject: string; dueDate: string }
): DemoDB {
  const plan = db.plans[userId] ?? { ...DEFAULT_PLAN };
  const updated: StudyPlanner = {
    ...plan,
    tasks: [
      ...plan.tasks,
      {
        id: uid("task"),
        userId,
        title: input.title,
        subject: input.subject,
        dueDate: input.dueDate,
        done: false,
        createdAt: new Date().toISOString()
      }
    ]
  };
  return savePlan(db, userId, updated);
}

export function toggleStudyTask(db: DemoDB, userId: string, taskId: string): DemoDB {
  const plan = db.plans[userId] ?? { ...DEFAULT_PLAN };
  return savePlan(db, userId, {
    ...plan,
    tasks: plan.tasks.map((task) =>
      task.id === taskId ? { ...task, done: !task.done } : task
    )
  });
}

export function deleteStudyTask(db: DemoDB, userId: string, taskId: string): DemoDB {
  const plan = db.plans[userId] ?? { ...DEFAULT_PLAN };
  return savePlan(db, userId, {
    ...plan,
    tasks: plan.tasks.filter((task) => task.id !== taskId)
  });
}

export function mergedQuestions(db: DemoDB): Question[] {
  const deleted = new Set(db.deletedQuestionIds);
  const base = SEED_QUESTIONS.filter((question) => !deleted.has(question.id)).map(
    (question) => ({ ...question, ...(db.overrides[question.id] ?? {}) })
  );
  const custom = db.customQuestions.filter((question) => !deleted.has(question.id));
  return [...base, ...custom];
}

export function addCustomQuestion(db: DemoDB, input: AdminQuestionInput): DemoDB {
  const question: Question = {
    id: uid("custom"),
    subject: input.subject,
    topic: input.topic,
    difficulty: input.difficulty,
    text: input.text.trim(),
    options: input.options.map((option) => option.trim()) as Question["options"],
    correctIndex: input.correctIndex as 0 | 1 | 2 | 3,
    explanation: input.explanation.trim(),
    source: "custom",
    isCustom: true,
    createdAt: new Date().toISOString()
  };
  return { ...db, customQuestions: [question, ...db.customQuestions] };
}

export function updateQuestion(
  db: DemoDB,
  questionId: string,
  input: AdminQuestionInput
): DemoDB {
  const isCustom = db.customQuestions.some((question) => question.id === questionId);
  if (isCustom) {
    return {
      ...db,
      customQuestions: db.customQuestions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              subject: input.subject,
              topic: input.topic,
              difficulty: input.difficulty,
              text: input.text,
              options: input.options,
              correctIndex: input.correctIndex as 0 | 1 | 2 | 3,
              explanation: input.explanation
            }
          : question
      )
    };
  }
  return {
    ...db,
    overrides: {
      ...db.overrides,
      [questionId]: {
        subject: input.subject,
        topic: input.topic,
        difficulty: input.difficulty,
        text: input.text,
        options: input.options,
        correctIndex: input.correctIndex as 0 | 1 | 2 | 3,
        explanation: input.explanation
      }
    }
  };
}

export function deleteQuestion(db: DemoDB, questionId: string): DemoDB {
  return {
    ...db,
    customQuestions: db.customQuestions.filter((question) => question.id !== questionId),
    overrides: Object.fromEntries(
      Object.entries(db.overrides).filter(([id]) => id !== questionId)
    ),
    deletedQuestionIds: Array.from(new Set([...db.deletedQuestionIds, questionId])),
    bookmarks: db.bookmarks.filter((bookmark) => bookmark.questionId !== questionId)
  };
}

export function importQuestions(db: DemoDB, questions: AdminQuestionInput[]): DemoDB {
  const created = questions.map((input) => ({
    id: uid("custom"),
    subject: input.subject,
    topic: input.topic,
    difficulty: input.difficulty,
    text: input.text.trim(),
    options: input.options.map((option) => option.trim()) as Question["options"],
    correctIndex: input.correctIndex as 0 | 1 | 2 | 3,
    explanation: input.explanation.trim(),
    source: "custom" as const,
    isCustom: true,
    createdAt: new Date().toISOString()
  }));
  return { ...db, customQuestions: [...created, ...db.customQuestions] };
}

export function updateSettings(db: DemoDB, settings: Partial<DemoSettings>): DemoDB {
  return { ...db, settings: { ...db.settings, ...settings } };
}

export function addAchievementUnlocks(
  db: DemoDB,
  userId: string,
  definitions: AchievementDefinition[]
): DemoDB {
  const existing = new Set(
    db.unlockedAchievements
      .filter((unlock) => unlock.userId === userId)
      .map((unlock) => unlock.achievementId)
  );
  const fresh = definitions.filter((definition) => !existing.has(definition.id));
  if (!fresh.length) return db;
  const now = new Date().toISOString();
  return {
    ...db,
    unlockedAchievements: [
      ...db.unlockedAchievements,
      ...fresh.map((definition) => ({
        userId,
        achievementId: definition.id,
        unlockedAt: now
      }))
    ],
    notifications: [
      ...fresh.map((definition) => ({
        id: uid("ntf"),
        userId,
        type: "achievement" as const,
        title: `Achievement unlocked: ${definition.title}`,
        message: `You earned ${definition.points} badge points. ${definition.description}`,
        href: "/achievements",
        read: false,
        createdAt: now
      })),
      ...db.notifications
    ].slice(0, 200)
  };
}

export function adminUpdateUser(
  db: DemoDB,
  userId: string,
  update: Partial<Pick<UserProfile, "role" | "leaderboardOptOut" | "displayName">>
): DemoDB {
  return {
    ...db,
    users: db.users.map((user) => (user.id === userId ? { ...user, ...update } : user))
  };
}

export function deleteUserAccount(db: DemoDB, userId: string): DemoDB {
  const plans = { ...db.plans };
  delete plans[userId];
  return {
    ...db,
    users: db.users.filter((user) => user.id !== userId),
    sessionUserId: db.sessionUserId === userId ? null : db.sessionUserId,
    results: db.results.filter((result) => result.userId !== userId),
    practice: db.practice.filter((attempt) => attempt.userId !== userId),
    bookmarks: db.bookmarks.filter((bookmark) => bookmark.userId !== userId),
    notes: db.notes.filter((note) => note.userId !== userId),
    notifications: db.notifications.filter((notification) => notification.userId !== userId),
    reports: db.reports.filter((report) => report.userId !== userId),
    unlockedAchievements: db.unlockedAchievements.filter((unlock) => unlock.userId !== userId),
    plans,
    dailyChallenges: Object.fromEntries(
      Object.entries(db.dailyChallenges).filter(([key]) => !key.startsWith(`${userId}:`))
    ),
    activities: db.activities.filter((activity) => activity.userId !== userId)
  };
}

export function resetDemoData(db: DemoDB): DemoDB {
  const seedUserIds = new Set(["usr_admin", "usr_demo"]);
  return {
    ...emptyDB(),
    users: db.users.filter((user) => seedUserIds.has(user.id)),
    plans: Object.fromEntries(
      Object.entries(db.plans).filter(([userId]) => seedUserIds.has(userId))
    )
  };
}
