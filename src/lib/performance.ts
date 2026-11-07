import type {
  ExamResult,
  PracticeAttempt,
  SubjectPerformance,
  TopicPerformance
} from "@/lib/types";
import { percentage } from "@/lib/utils";

export interface PerformanceProfile {
  subjects: SubjectPerformance[];
  topics: TopicPerformance[];
  weakestSubjects: SubjectPerformance[];
  strongestSubjects: SubjectPerformance[];
  weakestTopics: TopicPerformance[];
  strongestTopics: TopicPerformance[];
  overall: {
    attempted: number;
    correct: number;
    accuracy: number;
  };
}

interface AttemptRecord {
  subject: string;
  topic: string;
  correct: boolean;
  selected: boolean;
}

export function collectAttempts(
  results: ExamResult[],
  practice: PracticeAttempt[],
  userId?: string
): AttemptRecord[] {
  const records: AttemptRecord[] = [];
  for (const result of results) {
    if (userId && result.userId !== userId) continue;
    for (const answer of result.answers) {
      records.push({
        subject: answer.subject,
        topic: answer.topic,
        correct: answer.isCorrect,
        selected: answer.selectedIndex !== null
      });
    }
  }
  for (const attempt of practice) {
    if (userId && attempt.userId !== userId) continue;
    records.push({
      subject: attempt.subject,
      topic: attempt.topic,
      correct: attempt.correct,
      selected: attempt.selectedIndex !== null
    });
  }
  return records;
}

export function buildPerformanceProfile(
  results: ExamResult[],
  practice: PracticeAttempt[],
  userId?: string
): PerformanceProfile {
  const records = collectAttempts(results, practice, userId);
  const subjectMap = new Map<string, { attempted: number; correct: number }>();
  const topicMap = new Map<string, { subject: string; attempted: number; correct: number }>();

  for (const record of records) {
    const subject = subjectMap.get(record.subject) ?? { attempted: 0, correct: 0 };
    subject.attempted += 1;
    if (record.correct) subject.correct += 1;
    subjectMap.set(record.subject, subject);

    const key = `${record.subject}::${record.topic}`;
    const topic = topicMap.get(key) ?? {
      subject: record.subject,
      attempted: 0,
      correct: 0
    };
    topic.attempted += 1;
    if (record.correct) topic.correct += 1;
    topicMap.set(key, topic);
  }

  const subjects: SubjectPerformance[] = Array.from(subjectMap.entries()).map(
    ([subject, value]) => ({
      subject,
      attempted: value.attempted,
      correct: value.correct,
      accuracy: percentage(value.correct, value.attempted)
    })
  );

  const topics: TopicPerformance[] = Array.from(topicMap.entries()).map(
    ([key, value]) => ({
      subject: value.subject,
      topic: key.split("::")[1],
      attempted: value.attempted,
      correct: value.correct,
      accuracy: percentage(value.correct, value.attempted)
    })
  );

  const eligibleSubjects = subjects.filter((s) => s.attempted >= 3);
  const eligibleTopics = topics.filter((t) => t.attempted >= 3);

  const totalAttempted = records.length;
  const totalCorrect = records.filter((r) => r.correct).length;

  return {
    subjects: subjects.sort((a, b) => b.attempted - a.attempted),
    topics: topics.sort((a, b) => b.attempted - a.attempted),
    weakestSubjects: [...eligibleSubjects].sort((a, b) => a.accuracy - b.accuracy).slice(0, 3),
    strongestSubjects: [...eligibleSubjects].sort((a, b) => b.accuracy - a.accuracy).slice(0, 3),
    weakestTopics: [...eligibleTopics].sort((a, b) => a.accuracy - b.accuracy).slice(0, 5),
    strongestTopics: [...eligibleTopics].sort((a, b) => b.accuracy - a.accuracy).slice(0, 5),
    overall: {
      attempted: totalAttempted,
      correct: totalCorrect,
      accuracy: percentage(totalCorrect, totalAttempted)
    }
  };
}

export function calculateStreak(results: ExamResult[], practice: PracticeAttempt[], userId: string) {
  const days = new Set<string>();
  for (const result of results) {
    if (result.userId === userId) days.add(result.completedAt.slice(0, 10));
  }
  for (const attempt of practice) {
    if (attempt.userId === userId) days.add(attempt.answeredAt.slice(0, 10));
  }
  if (!days.size) return { current: 0, longest: 0, studiedToday: false };

  const sorted = Array.from(days).sort();
  let longest = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(`${sorted[i - 1]}T00:00:00`);
    const curr = new Date(`${sorted[i]}T00:00:00`);
    const diff = Math.round((curr.getTime() - prev.getTime()) / 86_400_000);
    if (diff === 1) {
      run += 1;
      longest = Math.max(longest, run);
    } else if (diff > 1) {
      run = 1;
    }
  }

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const yesterday = new Date(today.getTime() - 86_400_000);
  const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

  let current = 0;
  if (days.has(todayKey) || days.has(yesterdayKey)) {
    const cursor = days.has(todayKey) ? today : yesterday;
    while (true) {
      const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
      if (!days.has(key)) break;
      current += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  return { current, longest, studiedToday: days.has(todayKey) };
}

export function weeklyReport(
  results: ExamResult[],
  practice: PracticeAttempt[],
  userId: string
) {
  const now = Date.now();
  const week = 7 * 86_400_000;
  const current = results.filter(
    (r) => r.userId === userId && now - new Date(r.completedAt).getTime() <= week
  );
  const previous = results.filter((r) => {
    if (r.userId !== userId) return false;
    const age = now - new Date(r.completedAt).getTime();
    return age > week && age <= week * 2;
  });
  const currentPractice = practice.filter(
    (p) => p.userId === userId && now - new Date(p.answeredAt).getTime() <= week
  );

  const currentAvg = current.length
    ? Math.round(current.reduce((sum, r) => sum + r.percentage, 0) / current.length)
    : 0;
  const previousAvg = previous.length
    ? Math.round(previous.reduce((sum, r) => sum + r.percentage, 0) / previous.length)
    : 0;

  return {
    exams: current.length,
    questions: current.reduce((sum, r) => sum + r.total, 0) + currentPractice.length,
    minutes: Math.round(
      (current.reduce((sum, r) => sum + r.timeSpentSeconds, 0) +
        currentPractice.length * 45) /
        60
    ),
    average: currentAvg,
    previousAverage: previousAvg,
    change: current.length && previous.length ? currentAvg - previousAvg : null
  };
}
