import { startOfMonth, startOfWeek, isAfter } from "date-fns";
import type { ExamResult, LeaderboardEntry, UserProfile } from "@/lib/types";
import { isRankedMode } from "@/lib/exam";
import { percentage } from "@/lib/utils";

export type LeaderboardPeriod = "weekly" | "monthly" | "all-time";

export const PERIOD_LABELS: Record<LeaderboardPeriod, string> = {
  weekly: "This week",
  monthly: "This month",
  "all-time": "All time"
};

function periodStart(period: LeaderboardPeriod): Date | null {
  const now = new Date();
  if (period === "weekly") return startOfWeek(now, { weekStartsOn: 1 });
  if (period === "monthly") return startOfMonth(now);
  return null;
}

export function buildLeaderboard(options: {
  results: ExamResult[];
  users: UserProfile[];
  period?: LeaderboardPeriod;
  subject?: string | null;
  currentUserId?: string;
  limit?: number;
}): { entries: LeaderboardEntry[]; total: number; personal: LeaderboardEntry | null } {
  const {
    results,
    users,
    period = "all-time",
    subject = null,
    currentUserId,
    limit = 50
  } = options;

  const since = periodStart(period);
  const eligibleUsers = new Map(
    users
      .filter((u) => !u.isGuest && !u.leaderboardOptOut && u.role === "student")
      .map((u) => [u.id, u])
  );

  const aggregates = new Map<
    string,
    {
      userId: string;
      points: number;
      correct: number;
      total: number;
      exams: Set<string>;
    }
  >();

  for (const result of results) {
    if (!eligibleUsers.has(result.userId)) continue;
    if (!isRankedMode(result.mode)) continue;
    if (since && !isAfter(new Date(result.completedAt), since)) continue;

    let correct = 0;
    let total = 0;
    let points = 0;

    if (subject) {
      for (const answer of result.answers) {
        if (answer.subject !== subject) continue;
        total += 1;
        if (answer.isCorrect) {
          correct += 1;
          points += 10;
        }
      }
      if (total === 0) continue;
    } else {
      correct = result.correct;
      total = result.total;
      points = result.points;
    }

    const entry =
      aggregates.get(result.userId) ??
      { userId: result.userId, points: 0, correct: 0, total: 0, exams: new Set<string>() };
    entry.points += points;
    entry.correct += correct;
    entry.total += total;
    entry.exams.add(result.id);
    aggregates.set(result.userId, entry);
  }

  const entries: LeaderboardEntry[] = Array.from(aggregates.values())
    .map((aggregate) => {
      const user = eligibleUsers.get(aggregate.userId)!;
      return {
        rank: 0,
        userId: aggregate.userId,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        points: aggregate.points,
        averageScore: percentage(aggregate.correct, aggregate.total),
        exams: aggregate.exams.size,
        accuracy: percentage(aggregate.correct, aggregate.total),
        isCurrentUser: aggregate.userId === currentUserId
      };
    })
    .sort(
      (a, b) =>
        b.averageScore - a.averageScore ||
        b.points - a.points ||
        b.exams - a.exams ||
        a.username.localeCompare(b.username)
    )
    .map((entry, index) => ({ ...entry, rank: index + 1 }));

  const personal = currentUserId
    ? entries.find((entry) => entry.userId === currentUserId) ?? null
    : null;

  return {
    entries: entries.slice(0, limit),
    total: entries.length,
    personal
  };
}

export const LEADERBOARD_RULES = [
  "Only completed CBT examinations (full simulations and custom exams) count. Practice sessions do not affect leaderboards.",
  "Average score (accuracy) is the primary ranking criterion, so volume alone cannot inflate a position.",
  "Total points are the first tie-breaker; completed examinations are the second tie-breaker.",
  "Points: 10 for every correct answer, plus a 50-point bonus for a perfect examination.",
  "Each examination attempt is saved once. A refreshed page resumes the same attempt; it cannot be submitted twice.",
  "Weekly and monthly boards use calendar weeks and months. All-time includes every completed attempt.",
  "Guest attempts are never ranked, and students can opt out of public leaderboards from their profile.",
  "Only your display name, username, avatar and scores are public. Email addresses and personal details are never shown."
];
