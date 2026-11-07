import type { AdminQuestionInput, Difficulty, ImportIssue } from "@/lib/types";
import { getSubject, SUBJECTS } from "@/lib/subjects";
import { parseCSV } from "@/lib/utils";

export interface ImportResult {
  questions: AdminQuestionInput[];
  issues: ImportIssue[];
  totalRows: number;
  skipped: number;
}

const DIFFICULTY_MAP: Record<string, Difficulty> = {
  easy: "easy",
  beginner: "easy",
  medium: "medium",
  intermediate: "medium",
  hard: "hard",
  difficult: "hard",
  advanced: "hard"
};

function normaliseSubject(value: string): string | null {
  const input = value.trim().toLowerCase();
  const direct = SUBJECTS.find(
    (subject) =>
      subject.slug === input ||
      subject.name.toLowerCase() === input ||
      subject.shortName.toLowerCase() === input
  );
  return direct?.slug ?? null;
}

function answerIndex(value: string): number | null {
  const cleaned = value.trim().toUpperCase();
  if (["A", "B", "C", "D"].includes(cleaned)) return cleaned.charCodeAt(0) - 65;
  const number = Number(cleaned);
  if (Number.isInteger(number) && number >= 1 && number <= 4) return number - 1;
  return null;
}

function textKey(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function validateQuestionInput(input: unknown): {
  question?: AdminQuestionInput;
  issues: ImportIssue[];
} {
  const issues: ImportIssue[] = [];
  if (!input || typeof input !== "object") {
    return {
      issues: [{ row: 0, field: "row", message: "Row is not a valid object.", severity: "error" }]
    };
  }
  const record = input as Record<string, unknown>;
  const subjectRaw = String(record.subject ?? "");
  const subject = normaliseSubject(subjectRaw);
  if (!subject) {
    issues.push({
      row: 0,
      field: "subject",
      message: `"${subjectRaw}" is not a recognised subject.`,
      severity: "error"
    });
  }
  const topic = String(record.topic ?? "").trim();
  if (!topic) {
    issues.push({ row: 0, field: "topic", message: "Topic is required.", severity: "error" });
  }
  const difficultyRaw = String(record.difficulty ?? "medium").trim().toLowerCase();
  const difficulty = DIFFICULTY_MAP[difficultyRaw];
  if (!difficulty) {
    issues.push({
      row: 0,
      field: "difficulty",
      message: "Difficulty must be easy, medium or hard.",
      severity: "error"
    });
  }
  const text = String(record.text ?? record.question ?? "").trim();
  if (text.length < 10) {
    issues.push({
      row: 0,
      field: "question",
      message: "Question text is required (at least 10 characters).",
      severity: "error"
    });
  }

  const optionValues =
    (record.options as unknown) ??
    [record.optionA ?? record.option_a, record.optionB ?? record.option_b, record.optionC ?? record.option_c, record.optionD ?? record.option_d];
  let options: string[] = [];
  if (Array.isArray(optionValues)) {
    options = optionValues.map((value) => String(value ?? "").trim());
  } else if (optionValues && typeof optionValues === "object") {
    options = ["A", "B", "C", "D"].map((letter) =>
      String((optionValues as Record<string, unknown>)[letter] ?? "").trim()
    );
  }
  if (options.length !== 4 || options.some((option) => !option)) {
    issues.push({
      row: 0,
      field: "options",
      message: "Exactly four non-empty answer options are required.",
      severity: "error"
    });
  } else if (new Set(options.map((option) => option.toLowerCase())).size < 4) {
    issues.push({
      row: 0,
      field: "options",
      message: "Answer options must be distinct.",
      severity: "error"
    });
  }

  const rawCorrect = record.correctIndex ?? record.correct_index ?? record.correctAnswer ?? record.correct_answer ?? record.answer;
  let correctIndex: number | null = null;
  if (rawCorrect === null || rawCorrect === undefined || String(rawCorrect).trim() === "") {
    issues.push({
      row: 0,
      field: "correctAnswer",
      message: "A correct answer (A–D) is required.",
      severity: "error"
    });
  } else if (typeof rawCorrect === "number") {
    correctIndex = rawCorrect >= 0 && rawCorrect <= 3 ? rawCorrect : rawCorrect >= 1 && rawCorrect <= 4 ? rawCorrect - 1 : null;
    if (correctIndex === null) {
      issues.push({
        row: 0,
        field: "correctAnswer",
        message: "Numeric correct answer must be 0–3 or 1–4.",
        severity: "error"
      });
    }
  } else {
    correctIndex = answerIndex(String(rawCorrect));
    if (correctIndex === null) {
      issues.push({
        row: 0,
        field: "correctAnswer",
        message: "Correct answer must be A, B, C, D or a position from 1–4.",
        severity: "error"
      });
    }
  }

  const explanation = String(record.explanation ?? "").trim();
  if (explanation.length < 10) {
    issues.push({
      row: 0,
      field: "explanation",
      message: "A detailed explanation is required (at least 10 characters).",
      severity: "error"
    });
  }

  if (issues.some((issue) => issue.severity === "error")) return { issues };

  return {
    question: {
      subject: subject!,
      topic,
      difficulty: difficulty!,
      text,
      options: options as [string, string, string, string],
      correctIndex: correctIndex!,
      explanation
    },
    issues
  };
}

export function detectDuplicates(
  candidates: AdminQuestionInput[],
  existingTexts: string[]
): ImportIssue[] {
  const issues: ImportIssue[] = [];
  const seen = new Map<string, number>();
  const existing = new Set(existingTexts.map(textKey));
  candidates.forEach((question, index) => {
    const key = textKey(question.text);
    if (seen.has(key)) {
      issues.push({
        row: index + 1,
        field: "question",
        message: `Duplicate of row ${(seen.get(key) ?? 0) + 1} in this import.`,
        severity: "error"
      });
    } else if (existing.has(key)) {
      issues.push({
        row: index + 1,
        field: "question",
        message: "This question already exists in the bank.",
        severity: "error"
      });
    }
    seen.set(key, index);
  });
  return issues;
}

export function parseQuestionImport(
  raw: string,
  format: "json" | "csv",
  existingTexts: string[] = []
): ImportResult {
  const issues: ImportIssue[] = [];
  const rows: unknown[] = [];

  if (format === "csv") {
    const table = parseCSV(raw);
    if (table.length < 2) {
      return {
        questions: [],
        issues: [
          {
            row: 0,
            field: "file",
            message: "CSV must include a header row and at least one question.",
            severity: "error"
          }
        ],
        totalRows: 0,
        skipped: 0
      };
    }
    const header = table[0].map((cell) => cell.trim());
    const indexOf = (...names: string[]) =>
      header.findIndex((cell) =>
        names.some((name) => cell.toLowerCase().replace(/[\s_-]/g, "") === name.toLowerCase().replace(/[\s_-]/g, ""))
      );
    const required = ["subject", "topic", "question", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation"];
    const missing = required.filter((name) => indexOf(name) === -1);
    if (missing.length) {
      return {
        questions: [],
        issues: [
          {
            row: 1,
            field: "header",
            message: `Missing required columns: ${missing.join(", ")}. Download the template for the exact format.`,
            severity: "error"
          }
        ],
        totalRows: table.length - 1,
        skipped: table.length - 1
      };
    }
    const indexes = {
      subject: indexOf("subject"),
      topic: indexOf("topic"),
      difficulty: indexOf("difficulty"),
      text: indexOf("question", "text"),
      optionA: indexOf("optionA"),
      optionB: indexOf("optionB"),
      optionC: indexOf("optionC"),
      optionD: indexOf("optionD"),
      correctAnswer: indexOf("correctAnswer", "answer", "correctIndex"),
      explanation: indexOf("explanation")
    };
    for (let rowIndex = 1; rowIndex < table.length; rowIndex++) {
      const row = table[rowIndex];
      rows.push({
        subject: row[indexes.subject] ?? "",
        topic: row[indexes.topic] ?? "",
        difficulty: indexes.difficulty >= 0 ? row[indexes.difficulty] : "medium",
        text: row[indexes.text] ?? "",
        optionA: row[indexes.optionA] ?? "",
        optionB: row[indexes.optionB] ?? "",
        optionC: row[indexes.optionC] ?? "",
        optionD: row[indexes.optionD] ?? "",
        correctAnswer: row[indexes.correctAnswer] ?? "",
        explanation: row[indexes.explanation] ?? ""
      });
    }
  } else {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return {
        questions: [],
        issues: [
          { row: 0, field: "file", message: "Invalid JSON. Check for missing commas, quotes or brackets.", severity: "error" }
        ],
        totalRows: 0,
        skipped: 0
      };
    }
    if (Array.isArray(parsed)) rows.push(...parsed);
    else if (parsed && typeof parsed === "object" && Array.isArray((parsed as { questions?: unknown[] }).questions)) {
      rows.push(...((parsed as { questions: unknown[] }).questions));
    } else {
      return {
        questions: [],
        issues: [
          {
            row: 0,
            field: "file",
            message: "JSON must be an array of questions or an object with a questions array.",
            severity: "error"
          }
        ],
        totalRows: 0,
        skipped: 0
      };
    }
  }

  const valid: AdminQuestionInput[] = [];
  rows.forEach((row, index) => {
    const result = validateQuestionInput(row);
    if (result.question) valid.push(result.question);
    result.issues.forEach((issue) =>
      issues.push({ ...issue, row: issue.row || index + 2 })
    );
  });

  const duplicateIssues = detectDuplicates(valid, existingTexts);
  const questions = valid.filter((_, index) => {
    const issue = duplicateIssues.find((item) => item.row === index + 1);
    return !issue;
  });

  return {
    questions,
    issues: [...issues, ...duplicateIssues],
    totalRows: rows.length,
    skipped: rows.length - questions.length
  };
}

export const CSV_TEMPLATE = `subject,topic,difficulty,question,optionA,optionB,optionC,optionD,correctAnswer,explanation
Mathematics,Algebra,easy,"Solve for x: 2x + 4 = 10.",1,2,3,4,C,"Subtract 4 from both sides to get 2x = 6, then divide by 2: x = 3."
English Language,Grammar,medium,"Choose the correct option: She ___ to school every day.",go,goes,going,gone,B,"The third-person singular subject 'she' takes the verb 'goes'."
Physics,Mechanics,hard,"A body accelerates uniformly from rest at 2 m/s² for 6 s. Find its final velocity.",6 m/s,8 m/s,12 m/s,24 m/s,C,"Using v = u + at: v = 0 + 2 × 6 = 12 m/s."
`;

export const JSON_TEMPLATE = JSON.stringify(
  {
    questions: [
      {
        subject: "Mathematics",
        topic: "Algebra",
        difficulty: "easy",
        text: "Solve for x: 2x + 4 = 10.",
        options: ["1", "2", "3", "4"],
        correctAnswer: "C",
        explanation: "Subtract 4 from both sides to get 2x = 6, then divide by 2: x = 3."
      }
    ]
  },
  null,
  2
);

export function subjectLabel(slug: string) {
  return getSubject(slug)?.name ?? slug;
}
