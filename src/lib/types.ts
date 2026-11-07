export type Difficulty = "easy" | "medium" | "hard";

export type AnswerLetter = "A" | "B" | "C" | "D";

export interface Question {
  /** Stable unique identifier, e.g. mth-001 */
  id: string;
  /** Subject slug, e.g. mathematics */
  subject: string;
  topic: string;
  difficulty: Difficulty;
  text: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  /** All seed content is original practice material written for PRAISE POST UTME. */
  source: "practice" | "custom";
  isCustom?: boolean;
  createdAt?: string;
}

export interface Subject {
  slug: string;
  name: string;
  shortName: string;
  group: "Science" | "Arts & Humanities" | "Commercial" | "General";
  icon: string;
  gradient: string;
  description: string;
  topics: string[];
}

export interface SubjectPerformance {
  subject: string;
  attempted: number;
  correct: number;
  accuracy: number;
  averageScore?: number;
}

export interface TopicPerformance {
  subject: string;
  topic: string;
  attempted: number;
  correct: number;
  accuracy: number;
}

export interface ExamQuestionResult {
  questionId: string;
  subject: string;
  topic: string;
  difficulty: Difficulty;
  text: string;
  options: string[];
  selectedIndex: number | null;
  correctIndex: number;
  explanation: string;
  isCorrect: boolean;
}

export type ExamMode =
  | "full-cbt"
  | "quick-practice"
  | "subject-practice"
  | "topic-practice"
  | "daily-challenge"
  | "weakness-training"
  | "random-challenge"
  | "revision"
  | "custom";

export interface ExamConfig {
  mode: ExamMode;
  subjects: string[];
  topics: string[];
  questionCount: number;
  durationMinutes: number;
  difficulty: "mixed" | Difficulty;
  title: string;
}

export interface ExamSession {
  attemptId: string;
  config: ExamConfig;
  questionIds: string[];
  answers: Record<string, number | null>;
  marked: string[];
  startedAt: string;
  endsAt: string;
  currentIndex: number;
  customQuestions?: Question[];
}

export interface ExamResult {
  id: string;
  attemptId: string;
  userId: string;
  userName: string;
  username: string;
  avatar?: string;
  mode: ExamMode;
  title: string;
  subjects: string[];
  answers: ExamQuestionResult[];
  total: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  percentage: number;
  durationSeconds: number;
  timeSpentSeconds: number;
  startedAt: string;
  completedAt: string;
  points: number;
  passed: boolean;
  validation: "server" | "client-demo";
}

export interface PracticeAttempt {
  id: string;
  userId: string;
  questionId: string;
  subject: string;
  topic: string;
  difficulty: Difficulty;
  selectedIndex: number | null;
  correct: boolean;
  answeredAt: string;
  mode: ExamMode;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  displayName: string;
  role: "student" | "admin";
  school: string;
  universityId: string | null;
  preferredSubjects: string[];
  avatar: string | null;
  bio: string;
  leaderboardOptOut: boolean;
  isGuest: boolean;
  createdAt: string;
  lastActiveAt: string;
  passwordHash?: string;
  passwordSalt?: string;
  streak?: number;
}

export interface DailyChallengeState {
  date: string;
  completed: boolean;
  score: number | null;
  resultId: string | null;
}

export interface Notification {
  id: string;
  userId: string;
  type: "result" | "achievement" | "leaderboard" | "daily" | "report" | "system";
  title: string;
  message: string;
  href?: string;
  read: boolean;
  createdAt: string;
}

export interface Bookmark {
  userId: string;
  questionId: string;
  createdAt: string;
}

export interface Note {
  id: string;
  userId: string;
  questionId: string | null;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionReport {
  id: string;
  userId: string;
  userName: string;
  questionId: string;
  subject: string;
  reason: string;
  detail: string;
  status: "open" | "resolved" | "dismissed";
  createdAt: string;
}

export interface StudyTask {
  id: string;
  userId: string;
  title: string;
  subject: string;
  dueDate: string;
  done: boolean;
  createdAt: string;
}

export interface StudyPlanner {
  examDate: string | null;
  targetUniversityId: string | null;
  weeklyGoal: number;
  tasks: StudyTask[];
}

export interface ActivityEvent {
  id: string;
  userId: string;
  userName: string;
  type: "exam" | "practice" | "account" | "admin" | "question";
  message: string;
  createdAt: string;
}

export interface AdminQuestionInput {
  subject: string;
  topic: string;
  difficulty: Difficulty;
  text: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface ImportIssue {
  row: number;
  field: string;
  message: string;
  severity: "error" | "warning";
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  avatar: string | null;
  points: number;
  averageScore: number;
  exams: number;
  accuracy: number;
  isCurrentUser?: boolean;
}

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  category: "milestone" | "accuracy" | "streak" | "subject" | "community";
  icon: string;
  points: number;
  tier: "bronze" | "silver" | "gold" | "platinum";
  target: number;
  metric:
    | "exams"
    | "questions"
    | "perfect"
    | "streak"
    | "subject-master"
    | "top10"
    | "daily"
    | "accuracy"
    | "bookmarks"
    | "notes"
    | "science-average";
  subject?: string;
}

export interface University {
  id: string;
  name: string;
  abbreviation: string;
  state: string;
  city: string;
  type: "Federal" | "State" | "Private";
  website: string;
  established: number;
  overview: string;
  faculties: string[];
  courses: string[];
  postUtmeSubjects: string[];
  subjectCombinations: { course: string; subjects: string[] }[];
  requirements: string[];
  verificationNote: string;
}
