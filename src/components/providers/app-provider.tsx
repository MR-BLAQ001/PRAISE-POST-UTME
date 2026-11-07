"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import type {
  AchievementDefinition,
  AdminQuestionInput,
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
import {
  addCustomQuestion,
  addReport,
  addStudyTask,
  adminUpdateUser,
  createGuest,
  createSeedDB,
  deleteNote,
  deleteQuestion,
  deleteStudyTask,
  deleteUserAccount,
  emptyDB,
  findUserByLogin,
  importQuestions,
  markAllNotificationsRead,
  markNotificationRead,
  mergedQuestions,
  registerUser,
  resetDemoData,
  saveDailyChallenge,
  saveExamResult,
  saveNote,
  savePlan,
  savePracticeAttempt,
  toggleBookmark,
  toggleStudyTask,
  updateQuestion,
  updateReportStatus,
  updateSettings,
  verifyPassword,
  type DemoDB,
  type StoredUser,
  type RegisterInput,
  sanitizeUser,
  DEFAULT_PLAN
} from "@/lib/demo-db";
import { readStorage, writeStorage, hashPassword, makeSalt } from "@/lib/storage";
import { buildLeaderboard } from "@/lib/leaderboard";
import { calculateStreak } from "@/lib/performance";
import {
  computeAchievementStats,
  computeAllAchievements
} from "@/lib/achievements";
import { addAchievementUnlocks } from "@/lib/demo-db";
import { uid } from "@/lib/utils";

interface Result<T = void> {
  ok: boolean;
  error?: string;
  data?: T;
}

interface AppContextValue {
  ready: boolean;
  user: UserProfile | null;
  isAdmin: boolean;
  isGuest: boolean;
  db: DemoDB | null;
  questionBank: Question[];
  notifications: Notification[];
  unreadCount: number;
  settings: DemoDB["settings"] | null;
  register: (input: RegisterInput) => Promise<Result>;
  login: (identifier: string, password: string) => Promise<Result>;
  loginAsDemo: (kind: "student" | "admin") => Promise<Result>;
  enterGuest: (name?: string) => Promise<Result>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<Result>;
  resetPassword: (email: string, newPassword: string) => Promise<Result>;
  updateProfile: (
    update: Partial<
      Pick<
        UserProfile,
        | "displayName"
        | "username"
        | "school"
        | "universityId"
        | "preferredSubjects"
        | "avatar"
        | "bio"
        | "leaderboardOptOut"
      >
    >
  ) => Result;
  saveResult: (result: ExamResult) => void;
  recordPractice: (attempt: PracticeAttempt) => void;
  completeDailyChallenge: (state: DailyChallengeState) => void;
  getDailyChallenge: (dateKey: string) => DailyChallengeState | null;
  isBookmarked: (questionId: string) => boolean;
  bookmark: (questionId: string) => void;
  userNotes: Note[];
  createOrUpdateNote: (input: {
    id?: string;
    questionId: string | null;
    title: string;
    body: string;
  }) => Result;
  removeNote: (noteId: string) => void;
  submitReport: (input: {
    questionId: string;
    subject: string;
    reason: string;
    detail: string;
  }) => Result;
  markRead: (id: string) => void;
  markAllRead: () => void;
  plan: StudyPlanner;
  updatePlan: (plan: StudyPlanner) => void;
  addTask: (input: { title: string; subject: string; dueDate: string }) => Result;
  toggleTask: (taskId: string) => void;
  removeTask: (taskId: string) => void;
  addQuestion: (input: AdminQuestionInput) => Result;
  editQuestion: (id: string, input: AdminQuestionInput) => Result;
  removeQuestion: (id: string) => Result;
  importQuestionBatch: (questions: AdminQuestionInput[]) => Result<number>;
  updatePlatformSettings: (input: Partial<DemoDB["settings"]>) => Result;
  updateUserAsAdmin: (
    userId: string,
    update: Partial<Pick<UserProfile, "role" | "leaderboardOptOut" | "displayName">>
  ) => Result;
  removeUserAsAdmin: (userId: string) => Result;
  updateReport: (reportId: string, status: QuestionReport["status"]) => Result;
  resetAllDemoData: () => void;
  userResults: ExamResult[];
  userPractice: PracticeAttempt[];
  unlockedAchievementIds: Set<string>;
  allStudents: UserProfile[];
  adminResults: ExamResult[];
  reports: QuestionReport[];
}

const AppContext = createContext<AppContextValue | null>(null);

function sortNotifications(items: Notification[]) {
  return [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<DemoDB | null>(null);
  const [ready, setReady] = useState(false);
  const dbRef = useRef<DemoDB | null>(null);

  const apply = useCallback((next: DemoDB) => {
    dbRef.current = next;
    setDb(next);
    writeStorage("db", next);
  }, []);

  const update = useCallback(
    (updater: (current: DemoDB) => DemoDB): DemoDB | null => {
      const current = dbRef.current;
      if (!current) return null;
      const next = updater(current);
      apply(next);
      return next;
    },
    [apply]
  );

  useEffect(() => {
    let cancelled = false;
    async function initialise() {
      const stored = readStorage<DemoDB | null>("db", null);
      if (stored && stored.version === 1 && Array.isArray(stored.users) && stored.users.length) {
        const merged: DemoDB = { ...emptyDB(), ...stored };
        if (!cancelled) {
          dbRef.current = merged;
          setDb(merged);
          setReady(true);
        }
        return;
      }
      const seeded = await createSeedDB();
      if (cancelled) return;
      dbRef.current = seeded;
      setDb(seeded);
      writeStorage("db", seeded);
      setReady(true);
    }
    initialise();
    return () => {
      cancelled = true;
    };
  }, []);

  const currentUser: StoredUser | null = useMemo(() => {
    if (!db?.sessionUserId) return null;
    return db.users.find((user) => user.id === db.sessionUserId) ?? null;
  }, [db]);

  const user: UserProfile | null = currentUser ? sanitizeUser(currentUser) : null;
  const isAdmin = currentUser?.role === "admin";
  const isGuest = Boolean(currentUser?.isGuest);

  const questionBank = useMemo(
    () => (db ? mergedQuestions(db) : mergedQuestions(emptyDB())),
    [db]
  );

  const notifications = useMemo(() => {
    if (!db || !user) return [];
    return sortNotifications(
      db.notifications.filter((notification) => notification.userId === user.id)
    );
  }, [db, user]);

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const userResults = useMemo(
    () =>
      db && user
        ? db.results
            .filter((result) => result.userId === user.id)
            .sort(
              (a, b) =>
                new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
            )
        : [],
    [db, user]
  );

  const userPractice = useMemo(
    () =>
      db && user
        ? db.practice.filter((attempt) => attempt.userId === user.id)
        : [],
    [db, user]
  );

  const userNotes = useMemo(
    () =>
      db && user
        ? db.notes
            .filter((note) => note.userId === user.id)
            .sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            )
        : [],
    [db, user]
  );

  const plan = useMemo(() => {
    if (!db || !user) return { ...DEFAULT_PLAN };
    return db.plans[user.id] ?? { ...DEFAULT_PLAN };
  }, [db, user]);

  const unlockedAchievementIds = useMemo(() => {
    if (!db || !user) return new Set<string>();
    return new Set(
      db.unlockedAchievements
        .filter((unlock) => unlock.userId === user.id)
        .map((unlock) => unlock.achievementId)
    );
  }, [db, user]);

  const allStudents = useMemo(
    () =>
      db
        ? db.users
            .filter((student) => !student.isGuest)
            .map(sanitizeUser)
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
        : [],
    [db]
  );

  const reports = useMemo(
    () =>
      db
        ? [...db.reports].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        : [],
    [db]
  );

  const syncAchievements = useCallback(
    (next: DemoDB, userId: string): DemoDB => {
      const member = next.users.find((item) => item.id === userId);
      if (!member || member.isGuest) return next;
      const streak = calculateStreak(next.results, next.practice, userId).current;
      const rankBoard = buildLeaderboard({
        results: next.results,
        users: next.users.map(sanitizeUser),
        currentUserId: userId,
        limit: 1000
      });
      const dailyCount = Object.keys(next.dailyChallenges).filter(
        (key) => key.startsWith(`${userId}:`) && next.dailyChallenges[key].completed
      ).length;
      const stats = computeAchievementStats({
        results: next.results,
        practice: next.practice,
        userId,
        streak,
        dailyCount,
        bookmarks: next.bookmarks.filter((bookmark) => bookmark.userId === userId).length,
        notes: next.notes.filter((note) => note.userId === userId).length,
        globalRank: rankBoard.personal?.rank ?? null
      });
      const unlocked = computeAllAchievements(stats)
        .filter((achievement) => achievement.unlocked)
        .map((achievement) => achievement.definition as AchievementDefinition);
      return addAchievementUnlocks(next, userId, unlocked);
    },
    []
  );

  const register = useCallback(
    async (input: RegisterInput): Promise<Result> => {
      const current = dbRef.current;
      if (!current) return { ok: false, error: "The application is still loading." };
      const result = await registerUser(current, input);
      if ("error" in result) return { ok: false, error: result.error };
      const synced = syncAchievements(result.db, result.user.id);
      apply(synced);
      return { ok: true };
    },
    [apply, syncAchievements]
  );

  const login = useCallback(
    async (identifier: string, password: string): Promise<Result> => {
      const current = dbRef.current;
      if (!current) return { ok: false, error: "The application is still loading." };
      const found = findUserByLogin(current, identifier);
      if (!found) return { ok: false, error: "No account matches that email or username." };
      const valid = await verifyPassword(found, password);
      if (!valid) return { ok: false, error: "Incorrect password. Please try again." };
      update((database) => ({
        ...database,
        sessionUserId: found.id,
        users: database.users.map((member) =>
          member.id === found.id
            ? { ...member, lastActiveAt: new Date().toISOString() }
            : member
        )
      }));
      return { ok: true };
    },
    [update]
  );

  const loginAsDemo = useCallback(
    async (kind: "student" | "admin"): Promise<Result> => {
      const email = kind === "admin" ? "admin@praise.ng" : "demo@praise.ng";
      return login(email, kind === "admin" ? "Admin123!" : "Demo123!");
    },
    [login]
  );

  const enterGuest = useCallback(
    async (name = "Guest Scholar"): Promise<Result> => {
      const current = dbRef.current;
      if (!current) return { ok: false, error: "The application is still loading." };
      const result = await createGuest(current, name);
      apply(result.db);
      return { ok: true };
    },
    [apply]
  );

  const logout = useCallback(() => {
    update((database) => ({ ...database, sessionUserId: null }));
  }, [update]);

  const requestPasswordReset = useCallback(async (email: string): Promise<Result> => {
    const current = dbRef.current;
    if (!current) return { ok: false, error: "The application is still loading." };
    const found = current.users.find(
      (member) => member.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (!found) {
      return { ok: false, error: "No account matches that email address." };
    }
    return { ok: true, data: undefined };
  }, []);

  const resetPassword = useCallback(
    async (email: string, newPassword: string): Promise<Result> => {
      const current = dbRef.current;
      if (!current) return { ok: false, error: "The application is still loading." };
      if (newPassword.length < 8 || !/[A-Za-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
        return {
          ok: false,
          error: "Use at least 8 characters with one letter and one number."
        };
      }
      const found = current.users.find(
        (member) => member.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (!found) return { ok: false, error: "No account matches that email address." };
      const salt = makeSalt();
      const passwordHash = await hashPassword(newPassword, salt);
      update((database) => ({
        ...database,
        users: database.users.map((member) =>
          member.id === found.id ? { ...member, passwordHash, passwordSalt: salt } : member
        )
      }));
      return { ok: true };
    },
    [update]
  );

  const updateProfile = useCallback(
    (
      input: Partial<
        Pick<
          UserProfile,
          | "displayName"
          | "username"
          | "school"
          | "universityId"
          | "preferredSubjects"
          | "avatar"
          | "bio"
          | "leaderboardOptOut"
        >
      >
    ): Result => {
      const current = dbRef.current;
      if (!current || !current.sessionUserId) {
        return { ok: false, error: "You must be signed in to update your profile." };
      }
      if (input.username) {
        const normalised = input.username.trim().toLowerCase();
        if (!/^[a-z0-9_]{3,20}$/.test(normalised)) {
          return {
            ok: false,
            error: "Username must be 3–20 characters using letters, numbers or underscores."
          };
        }
        const taken = current.users.some(
          (member) =>
            member.id !== current.sessionUserId &&
            member.username.toLowerCase() === normalised
        );
        if (taken) return { ok: false, error: "That username is already taken." };
        input = { ...input, username: normalised };
      }
      update((database) => ({
        ...database,
        users: database.users.map((member) =>
          member.id === database.sessionUserId ? { ...member, ...input } : member
        )
      }));
      return { ok: true };
    },
    [update]
  );

  const saveResult = useCallback(
    (result: ExamResult) => {
      const next = update((database) => {
        let updated = saveExamResult(database, result);
        if (result.mode === "daily-challenge") {
          updated = saveDailyChallenge(updated, {
            userId: result.userId,
            date: result.completedAt.slice(0, 10),
            completed: true,
            score: result.percentage,
            resultId: result.id
          });
        }
        return syncAchievements(updated, result.userId);
      });
      void next;
    },
    [update, syncAchievements]
  );

  const recordPractice = useCallback(
    (attempt: PracticeAttempt) => {
      update((database) => syncAchievements(savePracticeAttempt(database, attempt), attempt.userId));
    },
    [update, syncAchievements]
  );

  const completeDailyChallenge = useCallback(
    (state: DailyChallengeState) => {
      if (!user) return;
      update((database) =>
        syncAchievements(
          saveDailyChallenge(database, { ...state, userId: user.id }),
          user.id
        )
      );
    },
    [update, user, syncAchievements]
  );

  const getDailyChallenge = useCallback(
    (key: string): DailyChallengeState | null => {
      if (!db || !user) return null;
      return db.dailyChallenges[`${user.id}:${key}`] ?? null;
    },
    [db, user]
  );

  const isBookmarked = useCallback(
    (questionId: string): boolean =>
      Boolean(
        db &&
          user &&
          db.bookmarks.some(
            (bookmark) =>
              bookmark.userId === user.id && bookmark.questionId === questionId
          )
      ),
    [db, user]
  );

  const bookmark = useCallback(
    (questionId: string) => {
      if (!user) return;
      update((database) => {
        const next = toggleBookmark(database, user.id, questionId);
        return syncAchievements(next, user.id);
      });
    },
    [update, user, syncAchievements]
  );

  const createOrUpdateNote = useCallback(
    (input: {
      id?: string;
      questionId: string | null;
      title: string;
      body: string;
    }): Result => {
      if (!user) return { ok: false, error: "Sign in to save notes." };
      if (!input.title.trim()) return { ok: false, error: "Give your note a title." };
      update((database) => {
        const next = saveNote(database, { ...input, userId: user.id });
        return syncAchievements(next, user.id);
      });
      return { ok: true };
    },
    [update, user, syncAchievements]
  );

  const removeNote = useCallback(
    (noteId: string) => {
      if (!user) return;
      update((database) => deleteNote(database, user.id, noteId));
    },
    [update, user]
  );

  const submitReport = useCallback(
    (input: {
      questionId: string;
      subject: string;
      reason: string;
      detail: string;
    }): Result => {
      if (!user) return { ok: false, error: "Sign in to report a question." };
      update((database) =>
        addReport(database, {
          ...input,
          userId: user.id,
          userName: user.displayName
        })
      );
      return { ok: true };
    },
    [update, user]
  );

  const markRead = useCallback(
    (id: string) => {
      if (!user) return;
      update((database) => markNotificationRead(database, user.id, id));
    },
    [update, user]
  );

  const markAllRead = useCallback(() => {
    if (!user) return;
    update((database) => markAllNotificationsRead(database, user.id));
  }, [update, user]);

  const updatePlan = useCallback(
    (nextPlan: StudyPlanner) => {
      if (!user) return;
      update((database) => savePlan(database, user.id, nextPlan));
    },
    [update, user]
  );

  const addTask = useCallback(
    (input: { title: string; subject: string; dueDate: string }): Result => {
      if (!user) return { ok: false, error: "Sign in to build a study plan." };
      if (!input.title.trim()) return { ok: false, error: "Enter a task title." };
      update((database) => addStudyTask(database, user.id, input));
      return { ok: true };
    },
    [update, user]
  );

  const toggleTask = useCallback(
    (taskId: string) => {
      if (!user) return;
      update((database) => toggleStudyTask(database, user.id, taskId));
    },
    [update, user]
  );

  const removeTask = useCallback(
    (taskId: string) => {
      if (!user) return;
      update((database) => deleteStudyTask(database, user.id, taskId));
    },
    [update, user]
  );

  const requireAdmin = useCallback((): StoredUser | null => {
    const current = dbRef.current;
    if (!current?.sessionUserId) return null;
    const member = current.users.find((item) => item.id === current.sessionUserId);
    return member?.role === "admin" ? member : null;
  }, []);

  const addQuestion = useCallback(
    (input: AdminQuestionInput): Result => {
      if (!requireAdmin()) return { ok: false, error: "Administrator access required." };
      update((database) => addCustomQuestion(database, input));
      return { ok: true };
    },
    [requireAdmin, update]
  );

  const editQuestion = useCallback(
    (id: string, input: AdminQuestionInput): Result => {
      if (!requireAdmin()) return { ok: false, error: "Administrator access required." };
      update((database) => updateQuestion(database, id, input));
      return { ok: true };
    },
    [requireAdmin, update]
  );

  const removeQuestion = useCallback(
    (id: string): Result => {
      if (!requireAdmin()) return { ok: false, error: "Administrator access required." };
      update((database) => deleteQuestion(database, id));
      return { ok: true };
    },
    [requireAdmin, update]
  );

  const importQuestionBatch = useCallback(
    (questions: AdminQuestionInput[]): Result<number> => {
      if (!requireAdmin()) return { ok: false, error: "Administrator access required." };
      if (!questions.length) return { ok: false, error: "No valid questions to import." };
      update((database) => importQuestions(database, questions));
      return { ok: true, data: questions.length };
    },
    [requireAdmin, update]
  );

  const updatePlatformSettings = useCallback(
    (input: Partial<DemoDB["settings"]>): Result => {
      if (!requireAdmin()) return { ok: false, error: "Administrator access required." };
      update((database) => updateSettings(database, input));
      return { ok: true };
    },
    [requireAdmin, update]
  );

  const updateUserAsAdmin = useCallback(
    (
      userId: string,
      updateFields: Partial<Pick<UserProfile, "role" | "leaderboardOptOut" | "displayName">>
    ): Result => {
      if (!requireAdmin()) return { ok: false, error: "Administrator access required." };
      if (userId === "usr_admin" && updateFields.role === "student") {
        return { ok: false, error: "The primary administrator account cannot be demoted." };
      }
      update((database) => adminUpdateUser(database, userId, updateFields));
      return { ok: true };
    },
    [requireAdmin, update]
  );

  const removeUserAsAdmin = useCallback(
    (userId: string): Result => {
      const admin = requireAdmin();
      if (!admin) return { ok: false, error: "Administrator access required." };
      if (userId === admin.id) return { ok: false, error: "You cannot delete your own admin account." };
      if (userId === "usr_admin") return { ok: false, error: "The primary admin account cannot be deleted." };
      update((database) => deleteUserAccount(database, userId));
      return { ok: true };
    },
    [requireAdmin, update]
  );

  const updateReport = useCallback(
    (reportId: string, status: QuestionReport["status"]): Result => {
      if (!requireAdmin()) return { ok: false, error: "Administrator access required." };
      update((database) => updateReportStatus(database, reportId, status));
      return { ok: true };
    },
    [requireAdmin, update]
  );

  const resetAllDemoData = useCallback(() => {
    const current = dbRef.current;
    if (!current) return;
    const next = resetDemoData(current);
    next.sessionUserId =
      current.sessionUserId && next.users.some((member) => member.id === current.sessionUserId)
        ? current.sessionUserId
        : null;
    apply(next);
  }, [apply]);

  const value: AppContextValue = {
    ready,
    user,
    isAdmin,
    isGuest,
    db,
    questionBank,
    notifications,
    unreadCount,
    settings: db?.settings ?? null,
    register,
    login,
    loginAsDemo,
    enterGuest,
    logout,
    requestPasswordReset,
    resetPassword,
    updateProfile,
    saveResult,
    recordPractice,
    completeDailyChallenge,
    getDailyChallenge,
    isBookmarked,
    bookmark,
    userNotes,
    createOrUpdateNote,
    removeNote,
    submitReport,
    markRead,
    markAllRead,
    plan,
    updatePlan,
    addTask,
    toggleTask,
    removeTask,
    addQuestion,
    editQuestion,
    removeQuestion,
    importQuestionBatch,
    updatePlatformSettings,
    updateUserAsAdmin,
    removeUserAsAdmin,
    updateReport,
    resetAllDemoData,
    userResults,
    userPractice,
    unlockedAchievementIds,
    allStudents,
    adminResults: db ? db.results : [],
    reports
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}

// Helper used by sign-in flows that want a friendly default.
export const DEMO_LOGIN = {
  student: { email: "demo@praise.ng", password: "Demo123!" },
  admin: { email: "admin@praise.ng", password: "Admin123!" }
};

export function makeLocalId(prefix = "id") {
  return uid(prefix);
}
