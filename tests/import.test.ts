import { describe, expect, it } from "vitest";
import {
  CSV_TEMPLATE,
  JSON_TEMPLATE,
  detectDuplicates,
  parseQuestionImport,
  validateQuestionInput
} from "@/lib/import";

describe("validateQuestionInput", () => {
  it("accepts a valid question", () => {
    const result = validateQuestionInput({
      subject: "Mathematics",
      topic: "Algebra",
      difficulty: "easy",
      text: "Solve for x when 2x + 4 = 10.",
      options: ["1", "2", "3", "4"],
      correctAnswer: "C",
      explanation: "Subtract 4 from both sides, then divide by 2 to get x = 3."
    });
    expect(result.issues).toEqual([]);
    expect(result.question).toMatchObject({
      subject: "mathematics",
      difficulty: "easy",
      correctIndex: 2
    });
  });

  it("normalises subject slugs, short names and difficulty aliases", () => {
    const result = validateQuestionInput({
      subject: "english-language",
      topic: "Grammar",
      difficulty: "advanced",
      text: "She ___ to school every day.",
      optionA: "go",
      optionB: "goes",
      optionC: "going",
      optionD: "gone",
      correctAnswer: "B",
      explanation: "Third-person singular subjects take the verb form 'goes'."
    });
    expect(result.question?.subject).toBe("english-language");
    expect(result.question?.difficulty).toBe("hard");
    expect(result.question?.correctIndex).toBe(1);
  });

  it("returns errors for unknown subject, missing fields and duplicate options", () => {
    const result = validateQuestionInput({
      subject: "Underwater Basket Weaving",
      topic: "",
      difficulty: "impossible",
      text: "short",
      options: ["same", "same", "other", ""],
      correctAnswer: "Z",
      explanation: "too short"
    });
    const fields = result.issues.map((issue) => issue.field);
    expect(fields).toEqual(
      expect.arrayContaining(["subject", "topic", "difficulty", "question", "options", "correctAnswer", "explanation"])
    );
    expect(result.question).toBeUndefined();
  });

  it("treats numeric answers as zero-based indexes and letters or numeric strings as positions", () => {
    const base = {
      subject: "Physics",
      topic: "Mechanics",
      difficulty: "medium",
      text: "A body moves 10 m in 2 s. What is its average speed?",
      options: ["2 m/s", "5 m/s", "10 m/s", "20 m/s"] as [string, string, string, string],
      explanation: "Average speed is distance divided by time: 10 / 2 = 5 m/s."
    };
    expect(validateQuestionInput({ ...base, correctAnswer: 2 }).question?.correctIndex).toBe(2);
    expect(validateQuestionInput({ ...base, correctAnswer: "2" }).question?.correctIndex).toBe(1);
    expect(validateQuestionInput({ ...base, correctAnswer: "B" }).question?.correctIndex).toBe(1);
  });
});

describe("detectDuplicates", () => {
  const base = {
    subject: "mathematics",
    topic: "Algebra",
    difficulty: "easy" as const,
    options: ["1", "2", "3", "4"] as [string, string, string, string],
    correctIndex: 2,
    explanation: "A sufficiently detailed explanation for this question."
  };

  it("detects duplicates inside the batch", () => {
    const issues = detectDuplicates(
      [
        { ...base, text: "What is 1 + 1?" },
        { ...base, text: "What is 1 + 1?" }
      ],
      []
    );
    expect(issues).toHaveLength(1);
    expect(issues[0].severity).toBe("error");
  });

  it("detects duplicates against existing bank text ignoring punctuation and case", () => {
    const issues = detectDuplicates(
      [{ ...base, text: "Solve: 2x + 4 = 10." }],
      ["solve 2x + 4 10"]
    );
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toContain("already exists");
  });

  it("passes distinct questions", () => {
    expect(
      detectDuplicates(
        [
          { ...base, text: "Find the value of x in x + 2 = 5." },
          { ...base, text: "Find the value of y in y + 4 = 9." }
        ],
        []
      )
    ).toEqual([]);
  });
});

describe("parseQuestionImport", () => {
  it("parses the bundled CSV template", () => {
    const result = parseQuestionImport(CSV_TEMPLATE, "csv");
    expect(result.totalRows).toBe(3);
    expect(result.questions).toHaveLength(3);
    expect(result.skipped).toBe(0);
    expect(result.questions[0].subject).toBe("mathematics");
    expect(result.questions[2].correctIndex).toBe(2);
  });

  it("parses the bundled JSON template", () => {
    const result = parseQuestionImport(JSON_TEMPLATE, "json");
    expect(result.questions).toHaveLength(1);
    expect(result.questions[0].text).toContain("2x + 4 = 10");
    expect(result.issues).toEqual([]);
  });

  it("skips invalid rows while importing the valid ones", () => {
    const csv = [
      "subject,topic,difficulty,question,optionA,optionB,optionC,optionD,correctAnswer,explanation",
      "Mathematics,Algebra,easy,What is two plus two?,1,2,3,4,D,Two plus two equals four.",
      "Not A Subject,Algebra,easy,This row is invalid,1,2,3,4,A,This explanation is long enough."
    ].join("\n");
    const result = parseQuestionImport(csv, "csv");
    expect(result.totalRows).toBe(2);
    expect(result.questions).toHaveLength(1);
    expect(result.skipped).toBe(1);
    expect(result.issues.some((issue) => issue.severity === "error")).toBe(true);
  });

  it("rejects duplicate rows within a file", () => {
    const row =
      'Mathematics,Algebra,easy,What is two plus two?,1,2,3,4,D,Two plus two equals four.';
    const csv = [
      "subject,topic,difficulty,question,optionA,optionB,optionC,optionD,correctAnswer,explanation",
      row,
      row
    ].join("\n");
    const result = parseQuestionImport(csv, "csv");
    expect(result.questions).toHaveLength(1);
    expect(result.issues.some((issue) => issue.message.includes("Duplicate"))).toBe(true);
  });

  it("returns a clear error for invalid JSON", () => {
    const result = parseQuestionImport("{ not json", "json");
    expect(result.questions).toEqual([]);
    expect(result.issues[0].field).toBe("file");
  });

  it("returns a clear error when CSV headers are missing", () => {
    const result = parseQuestionImport("subject,topic\nMaths,Algebra", "csv");
    expect(result.questions).toEqual([]);
    expect(result.issues[0].field).toBe("header");
  });
});
