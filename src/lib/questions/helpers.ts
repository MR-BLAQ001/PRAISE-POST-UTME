import type { AnswerLetter, Difficulty, Question } from "@/lib/types";

export type SeedRow = [
  topic: string,
  difficulty: Difficulty,
  text: string,
  options: [string, string, string, string],
  answer: AnswerLetter,
  explanation: string
];

const LETTERS: AnswerLetter[] = ["A", "B", "C", "D"];

/**
 * Builds a bank of uniquely identified practice questions. IDs are stable and
 * deterministic so examination history remains valid across app updates.
 */
export function makeQuestions(
  subject: string,
  prefix: string,
  rows: SeedRow[]
): Question[] {
  return rows.map((row, index) => {
    const [topic, difficulty, text, options, answer, explanation] = row;
    return {
      id: `${prefix}-${String(index + 1).padStart(3, "0")}`,
      subject,
      topic,
      difficulty,
      text,
      options,
      correctIndex: LETTERS.indexOf(answer) as 0 | 1 | 2 | 3,
      explanation,
      source: "practice",
      createdAt: "2026-01-01T00:00:00.000Z"
    } satisfies Question;
  });
}
