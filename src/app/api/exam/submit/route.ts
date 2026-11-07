import { NextResponse, type NextRequest } from "next/server";
import { getQuestionById } from "@/lib/questions";
import { scoreExam } from "@/lib/scoring";
import type { Difficulty, ExamConfig, ExamMode } from "@/lib/types";

const MODES: ExamMode[] = [
  "full-cbt",
  "quick-practice",
  "subject-practice",
  "topic-practice",
  "daily-challenge",
  "weakness-training",
  "random-challenge",
  "revision",
  "custom"
];

function cleanString(value: unknown, max = 200, fallback = ""): string {
  return typeof value === "string" ? value.slice(0, max) : fallback;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const questionIds = Array.isArray(payload.questionIds)
    ? payload.questionIds.filter((id): id is string => typeof id === "string")
    : [];
  const answers =
    payload.answers && typeof payload.answers === "object"
      ? (payload.answers as Record<string, unknown>)
      : null;
  const attemptId = cleanString(payload.attemptId, 100);
  const startedAt = cleanString(payload.startedAt, 50);
  const completedAt = cleanString(payload.completedAt, 50);
  const user = payload.user as Record<string, unknown> | undefined;
  const configRaw = payload.config as Record<string, unknown> | undefined;

  if (!attemptId || questionIds.length === 0 || !answers) {
    return NextResponse.json(
      { error: "Attempt ID, questions and answers are required." },
      { status: 400 }
    );
  }

  if (questionIds.length > 100) {
    return NextResponse.json({ error: "Too many questions in one attempt." }, { status: 400 });
  }
  if (new Set(questionIds).size !== questionIds.length) {
    return NextResponse.json({ error: "Duplicate question IDs are not allowed." }, { status: 400 });
  }

  const questions = questionIds.map((id) => getQuestionById(id));
  if (questions.some((question) => !question)) {
    return NextResponse.json(
      {
        error:
          "One or more questions could not be verified. Custom or edited questions are scored locally in demo mode."
      },
      { status: 400 }
    );
  }

  if (!user || typeof user.id !== "string" || user.id.length < 2) {
    return NextResponse.json({ error: "A valid student session is required." }, { status: 400 });
  }

  const started = new Date(startedAt);
  const completed = new Date(completedAt);
  if (Number.isNaN(started.getTime()) || Number.isNaN(completed.getTime())) {
    return NextResponse.json({ error: "Invalid timestamps." }, { status: 400 });
  }
  const durationMinutes = Math.max(1, Math.min(180, Number(configRaw?.durationMinutes) || 30));
  const durationSeconds = durationMinutes * 60;
  const rawSpent = Number(payload.timeSpentSeconds);
  const timeSpentSeconds = Number.isFinite(rawSpent)
    ? Math.max(0, Math.min(durationSeconds + 30, Math.round(rawSpent)))
    : Math.max(0, Math.min(durationSeconds, Math.round((completed.getTime() - started.getTime()) / 1000)));

  const mode: ExamMode = MODES.includes(configRaw?.mode as ExamMode)
    ? (configRaw?.mode as ExamMode)
    : "custom";
  const difficulty = ["mixed", "easy", "medium", "hard"].includes(String(configRaw?.difficulty))
    ? (configRaw?.difficulty as ExamConfig["difficulty"])
    : "mixed";
  const subjects = Array.isArray(configRaw?.subjects)
    ? (configRaw?.subjects as unknown[]).filter((value): value is string => typeof value === "string").slice(0, 16)
    : questionIds
        .map((id) => getQuestionById(id)?.subject)
        .filter((value): value is string => Boolean(value));

  const config: ExamConfig = {
    mode,
    subjects: Array.from(new Set(subjects)),
    topics: Array.isArray(configRaw?.topics)
      ? (configRaw?.topics as unknown[]).filter((value): value is string => typeof value === "string").slice(0, 30)
      : [],
    questionCount: questions.length,
    durationMinutes,
    difficulty: difficulty as "mixed" | Difficulty,
    title: cleanString(configRaw?.title, 120, "CBT Examination")
  };

  const cleanedAnswers: Record<string, number | null> = {};
  for (const question of questions) {
    if (!question) continue;
    const raw = answers[question.id];
    if (raw === null || raw === undefined) {
      cleanedAnswers[question.id] = null;
    } else if (typeof raw === "number" && Number.isInteger(raw) && raw >= 0 && raw <= 3) {
      cleanedAnswers[question.id] = raw;
    } else {
      cleanedAnswers[question.id] = null;
    }
  }

  const passMarkRaw = Number(payload.passMark);
  const passMark = Number.isFinite(passMarkRaw) ? Math.max(0, Math.min(100, passMarkRaw)) : 50;

  const result = scoreExam({
    questions: questions.filter((question): question is NonNullable<typeof question> => Boolean(question)),
    answers: cleanedAnswers,
    config,
    attemptId,
    userId: cleanString(user.id, 100),
    userName: cleanString(user.name, 80, "Student"),
    username: cleanString(user.username, 40, "student"),
    avatar: typeof user.avatar === "string" ? user.avatar : undefined,
    startedAt: started.toISOString(),
    completedAt: completed.toISOString(),
    durationSeconds,
    timeSpentSeconds,
    validation: "server",
    passMark
  });

  return NextResponse.json({ result, scoredBy: "server" });
}
