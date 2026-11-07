import type { AchievementDefinition, ExamResult, PracticeAttempt } from "@/lib/types";
import { isRankedMode } from "@/lib/exam";
import { percentage } from "@/lib/utils";

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "first-exam",
    title: "First Step",
    description: "Complete your first full CBT examination.",
    category: "milestone",
    icon: "Flag",
    points: 20,
    tier: "bronze",
    target: 1,
    metric: "exams"
  },
  {
    id: "ten-exams",
    title: "Consistent Grinder",
    description: "Complete 10 full CBT examinations.",
    category: "milestone",
    icon: "Layers",
    points: 80,
    tier: "silver",
    target: 10,
    metric: "exams"
  },
  {
    id: "hundred-questions",
    title: "Century Club",
    description: "Answer 100 questions across practice and examinations.",
    category: "milestone",
    icon: "Target",
    points: 50,
    tier: "bronze",
    target: 100,
    metric: "questions"
  },
  {
    id: "perfect-score",
    title: "Flawless",
    description: "Score 100% in a full CBT examination.",
    category: "accuracy",
    icon: "Crown",
    points: 100,
    tier: "gold",
    target: 1,
    metric: "perfect"
  },
  {
    id: "seven-day-streak",
    title: "Seven Day Flame",
    description: "Study for seven consecutive days.",
    category: "streak",
    icon: "Flame",
    points: 70,
    tier: "silver",
    target: 7,
    metric: "streak"
  },
  {
    id: "maths-master",
    title: "Mathematics Master",
    description: "Answer 20+ Mathematics questions with 80% accuracy or better.",
    category: "subject",
    icon: "Sigma",
    points: 60,
    tier: "gold",
    target: 20,
    metric: "subject-master",
    subject: "mathematics"
  },
  {
    id: "science-champion",
    title: "Science Champion",
    description: "Reach 75% overall accuracy across 30+ science questions.",
    category: "subject",
    icon: "Atom",
    points: 80,
    tier: "platinum",
    target: 75,
    metric: "science-average"
  },
  {
    id: "top-ten",
    title: "Top Ten Scholar",
    description: "Reach the top 10 of the global leaderboard.",
    category: "community",
    icon: "Trophy",
    points: 100,
    tier: "gold",
    target: 1,
    metric: "top10"
  },
  {
    id: "daily-challenger",
    title: "Daily Challenger",
    description: "Complete five daily challenges.",
    category: "community",
    icon: "CalendarCheck",
    points: 50,
    tier: "silver",
    target: 5,
    metric: "daily"
  },
  {
    id: "accuracy-ace",
    title: "Accuracy Ace",
    description: "Maintain 90% accuracy across at least 50 attempted questions.",
    category: "accuracy",
    icon: "Sparkles",
    points: 75,
    tier: "gold",
    target: 90,
    metric: "accuracy"
  },
  {
    id: "bookworm",
    title: "Bookworm",
    description: "Bookmark 10 questions for later revision.",
    category: "milestone",
    icon: "Bookmark",
    points: 30,
    tier: "bronze",
    target: 10,
    metric: "bookmarks"
  },
  {
    id: "note-taker",
    title: "Note Taker",
    description: "Create five personal study notes.",
    category: "milestone",
    icon: "NotebookPen",
    points: 30,
    tier: "bronze",
    target: 5,
    metric: "notes"
  }
];

export interface AchievementStats {
  exams: number;
  questions: number;
  perfect: number;
  streak: number;
  daily: number;
  accuracy: number;
  bookmarks: number;
  notes: number;
  top10: boolean;
  subjectAccuracy: Record<string, { accuracy: number; attempted: number }>;
  scienceAccuracy: { accuracy: number; attempted: number };
}

export interface AchievementProgress {
  definition: AchievementDefinition;
  progress: number;
  target: number;
  unlocked: boolean;
  progressPercent: number;
  detail: string;
}

const SCIENCE_SUBJECTS = ["physics", "chemistry", "biology", "mathematics", "agricultural-science"];

export function computeAchievementStats(options: {
  results: ExamResult[];
  practice: PracticeAttempt[];
  userId: string;
  streak: number;
  dailyCount: number;
  bookmarks: number;
  notes: number;
  globalRank: number | null;
}): AchievementStats {
  const { results, practice, userId, streak, dailyCount, bookmarks, notes, globalRank } = options;
  const userResults = results.filter((r) => r.userId === userId);
  const userCbtResults = userResults.filter((r) => isRankedMode(r.mode));
  const userPractice = practice.filter((p) => p.userId === userId);
  const examQuestions = userResults.reduce((sum, r) => sum + r.total, 0);
  const practiceQuestions = userPractice.length;
  const examCorrect = userResults.reduce((sum, r) => sum + r.correct, 0);
  const practiceCorrect = userPractice.filter((p) => p.correct).length;
  const totalQuestions = examQuestions + practiceQuestions;
  const totalCorrect = examCorrect + practiceCorrect;

  const subjectMap: Record<string, { correct: number; attempted: number }> = {};
  const add = (subject: string, correct: boolean) => {
    const entry = subjectMap[subject] ?? { correct: 0, attempted: 0 };
    entry.attempted += 1;
    if (correct) entry.correct += 1;
    subjectMap[subject] = entry;
  };
  for (const result of userResults) {
    for (const answer of result.answers) add(answer.subject, answer.isCorrect);
  }
  for (const attempt of userPractice) add(attempt.subject, attempt.correct);

  const subjectAccuracy: Record<string, { accuracy: number; attempted: number }> = {};
  for (const [subject, value] of Object.entries(subjectMap)) {
    subjectAccuracy[subject] = {
      accuracy: percentage(value.correct, value.attempted),
      attempted: value.attempted
    };
  }

  const scienceEntries = Object.entries(subjectMap).filter(([subject]) =>
    SCIENCE_SUBJECTS.includes(subject)
  );
  const scienceAttempted = scienceEntries.reduce((sum, [, v]) => sum + v.attempted, 0);
  const scienceCorrect = scienceEntries.reduce((sum, [, v]) => sum + v.correct, 0);

  return {
    exams: userCbtResults.length,
    questions: totalQuestions,
    perfect: userCbtResults.filter((r) => r.percentage === 100).length,
    streak,
    daily: dailyCount,
    accuracy: percentage(totalCorrect, totalQuestions),
    bookmarks,
    notes,
    top10: globalRank !== null && globalRank <= 10,
    subjectAccuracy,
    scienceAccuracy: {
      accuracy: percentage(scienceCorrect, scienceAttempted),
      attempted: scienceAttempted
    }
  };
}

export function achievementProgress(
  stat: AchievementStats,
  definition: AchievementDefinition
): AchievementProgress {
  let progress = 0;
  let target = definition.target;
  let unlocked = false;
  let detail = "";

  switch (definition.metric) {
    case "exams":
      progress = stat.exams;
      unlocked = stat.exams >= target;
      detail = `${stat.exams} of ${target} examinations`;
      break;
    case "questions":
      progress = stat.questions;
      unlocked = stat.questions >= target;
      detail = `${stat.questions} of ${target} questions`;
      break;
    case "perfect":
      progress = stat.perfect;
      unlocked = stat.perfect >= target;
      detail = stat.perfect ? "Perfect score earned" : "Score 100% in a CBT";
      break;
    case "streak":
      progress = stat.streak;
      unlocked = stat.streak >= target;
      detail = `${stat.streak} of ${target} days`;
      break;
    case "daily":
      progress = stat.daily;
      unlocked = stat.daily >= target;
      detail = `${stat.daily} of ${target} challenges`;
      break;
    case "bookmarks":
      progress = stat.bookmarks;
      unlocked = stat.bookmarks >= target;
      detail = `${stat.bookmarks} of ${target} bookmarks`;
      break;
    case "notes":
      progress = stat.notes;
      unlocked = stat.notes >= target;
      detail = `${stat.notes} of ${target} notes`;
      break;
    case "top10":
      progress = stat.top10 ? 1 : 0;
      target = 1;
      unlocked = stat.top10;
      detail = stat.top10 ? "Currently in the top 10" : "Reach the global top 10";
      break;
    case "accuracy":
      progress = stat.accuracy;
      target = 90;
      unlocked = stat.accuracy >= 90 && stat.questions >= 50;
      detail = `${stat.accuracy}% accuracy across ${stat.questions} questions`;
      break;
    case "science-average":
      progress = stat.scienceAccuracy.accuracy;
      target = 75;
      unlocked =
        stat.scienceAccuracy.accuracy >= 75 && stat.scienceAccuracy.attempted >= 30;
      detail = `${stat.scienceAccuracy.accuracy}% across ${stat.scienceAccuracy.attempted} science questions`;
      break;
    case "subject-master": {
      const subject = definition.subject ?? "mathematics";
      const record = stat.subjectAccuracy[subject] ?? { accuracy: 0, attempted: 0 };
      progress = record.attempted;
      target = 20;
      unlocked = record.attempted >= 20 && record.accuracy >= 80;
      detail = `${record.attempted} questions at ${record.accuracy}% accuracy (need 80%+)`;
      break;
    }
    default:
      break;
  }

  const progressPercent =
    target > 0 ? Math.min(100, Math.round((Math.max(0, progress) / target) * 100)) : 0;

  return {
    definition,
    progress: Math.min(progress, target),
    target,
    unlocked,
    progressPercent: unlocked ? 100 : progressPercent,
    detail
  };
}

export function computeAllAchievements(
  stats: AchievementStats
): AchievementProgress[] {
  return ACHIEVEMENTS.map((definition) => achievementProgress(stats, definition));
}

export function achievementPoints(progresses: AchievementProgress[]): number {
  return progresses
    .filter((progress) => progress.unlocked)
    .reduce((sum, progress) => sum + progress.definition.points, 0);
}
