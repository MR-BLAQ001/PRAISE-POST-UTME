import process from "node:process";
import { SEED_QUESTIONS } from "../src/lib/questions";
import { SUBJECTS, getSubject } from "../src/lib/subjects";
import type { Question } from "../src/lib/types";

interface Problem {
  questionId: string;
  message: string;
}

const EXPECTED_TOTAL = 800;
const EXPECTED_PER_SUBJECT = 50;

const problems: Problem[] = [];
const warnings: Problem[] = [];

function fail(questionId: string, message: string) {
  problems.push({ questionId, message });
}

function warn(questionId: string, message: string) {
  warnings.push({ questionId, message });
}

function key(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function validateQuestion(question: Question) {
  const subject = getSubject(question.subject);
  if (!subject) {
    fail(question.id, `Unknown subject "${question.subject}".`);
  } else if (!subject.topics.includes(question.topic)) {
    fail(
      question.id,
      `Topic "${question.topic}" is not listed for ${subject.name}. Known topics: ${subject.topics.join(", ")}.`
    );
  }

  if (!["easy", "medium", "hard"].includes(question.difficulty)) {
    fail(question.id, `Invalid difficulty "${question.difficulty}".`);
  }

  if (question.text.trim().length < 10) {
    fail(question.id, "Question text is shorter than 10 characters.");
  }

  if (question.options.length !== 4) {
    fail(question.id, `Expected 4 options, found ${question.options.length}.`);
  }

  // Genotype options such as "AA" and "Aa" are legitimately case-sensitive.
  const trimmedOptions = question.options.map((option) => option.trim());
  if (trimmedOptions.some((option) => !option)) {
    fail(question.id, "One or more options are empty.");
  }
  if (new Set(trimmedOptions).size !== trimmedOptions.length) {
    fail(question.id, "Options are not all distinct.");
  }

  if (![0, 1, 2, 3].includes(question.correctIndex)) {
    fail(question.id, `correctIndex ${question.correctIndex} is out of range.`);
  }

  if (question.explanation.trim().length < 20) {
    fail(question.id, "Explanation is shorter than 20 characters.");
  }

  if (question.source !== "practice") {
    fail(question.id, `Seed question source must be "practice", found "${question.source}".`);
  }

  if (question.isCustom) {
    fail(question.id, "Seed question must not be flagged as custom.");
  }

  // A question should not leak the answer letter into the text in a blatant way.
  if (/\banswer\s*(is|:)\s*[A-D]\b/i.test(question.text)) {
    warn(question.id, "Question text may reveal the answer letter.");
  }
}

function main() {
  console.log("Validating PRAISE POST UTME question bank…\n");

  if (SEED_QUESTIONS.length !== EXPECTED_TOTAL) {
    fail("bank", `Expected ${EXPECTED_TOTAL} questions, found ${SEED_QUESTIONS.length}.`);
  }

  const ids = new Map<string, number>();
  const texts = new Map<string, string>();
  const perSubject = new Map<string, number>();

  for (const question of SEED_QUESTIONS) {
    validateQuestion(question);

    if (ids.has(question.id)) {
      fail(question.id, "Duplicate question ID.");
    }
    ids.set(question.id, 1);

    const textKey = key(question.text);
    const existing = texts.get(textKey);
    if (existing) {
      fail(question.id, `Duplicate question text (also used by ${existing}).`);
    } else {
      texts.set(textKey, question.id);
    }

    perSubject.set(question.subject, (perSubject.get(question.subject) ?? 0) + 1);
  }

  for (const subject of SUBJECTS) {
    const count = perSubject.get(subject.slug) ?? 0;
    if (count !== EXPECTED_PER_SUBJECT) {
      fail(
        subject.slug,
        `${subject.name} has ${count} questions; expected ${EXPECTED_PER_SUBJECT}.`
      );
    }

    const topics = new Set(
      SEED_QUESTIONS.filter((question) => question.subject === subject.slug).map(
        (question) => question.topic
      )
    );
    for (const topic of subject.topics) {
      if (!topics.has(topic)) {
        warn(subject.slug, `Topic "${topic}" has no seed questions.`);
      }
    }
  }

  for (const [subject, count] of perSubject) {
    if (!SUBJECTS.some((item) => item.slug === subject)) {
      fail(subject, `Questions exist for unknown subject "${subject}".`);
      void count;
    }
  }

  const difficulty = { easy: 0, medium: 0, hard: 0 };
  for (const question of SEED_QUESTIONS) difficulty[question.difficulty] += 1;

  console.log(`Total questions: ${SEED_QUESTIONS.length}`);
  console.log(`Subjects:        ${perSubject.size}`);
  console.log(`Topics:          ${new Set(SEED_QUESTIONS.map((q) => `${q.subject}:${q.topic}`)).size}`);
  console.log(
    `Difficulty:      easy ${difficulty.easy} · medium ${difficulty.medium} · hard ${difficulty.hard}`
  );
  console.log(
    `Per subject:     ${SUBJECTS.map((s) => `${s.shortName} ${perSubject.get(s.slug) ?? 0}`).join(" · ")}\n`
  );

  if (warnings.length) {
    console.log(`${warnings.length} warning${warnings.length === 1 ? "" : "s"}:`);
    for (const warning of warnings) {
      console.log(`  ⚠ ${warning.questionId}: ${warning.message}`);
    }
    console.log("");
  }

  if (problems.length) {
    console.error(`${problems.length} problem${problems.length === 1 ? "" : "s"} found:`);
    for (const problem of problems) {
      console.error(`  ✖ ${problem.questionId}: ${problem.message}`);
    }
    console.error("\nQuestion bank validation failed.");
    process.exit(1);
  }

  console.log("Question bank validation passed.");
}

main();
