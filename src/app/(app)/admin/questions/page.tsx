"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  Check,
  ChevronDown,
  Download,
  Filter,
  Layers,
  Loader2,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2
} from "lucide-react";
import { SubjectIcon } from "@/components/subjects/subject-icon";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { useApp } from "@/components/providers/app-provider";
import { useToast } from "@/components/providers/toast-provider";
import { SUBJECTS, getSubject, subjectName } from "@/lib/subjects";
import { DIFFICULTY_LABEL, cn, downloadFile } from "@/lib/utils";
import type { AdminQuestionInput, Difficulty, Question } from "@/lib/types";

const LETTERS = ["A", "B", "C", "D"] as const;
const PAGE_SIZE = 25;

function emptyInput(subject = "english-language"): AdminQuestionInput {
  return {
    subject,
    topic: "",
    difficulty: "medium",
    text: "",
    options: ["", "", "", ""],
    correctIndex: 0,
    explanation: ""
  };
}

function toInput(question: Question): AdminQuestionInput {
  return {
    subject: question.subject,
    topic: question.topic,
    difficulty: question.difficulty,
    text: question.text,
    options: [...question.options] as AdminQuestionInput["options"],
    correctIndex: question.correctIndex,
    explanation: question.explanation
  };
}

export default function AdminQuestionsPage() {
  const toast = useToast();
  const {
    db,
    questionBank,
    addQuestion,
    editQuestion,
    removeQuestion
  } = useApp();

  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("all");
  const [difficulty, setDifficulty] = useState<"all" | Difficulty>("all");
  const [source, setSource] = useState<"all" | "seed" | "custom" | "edited">("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Question | null>(null);
  const [form, setForm] = useState<AdminQuestionInput>(emptyInput());
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Question | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const overrides = useMemo(() => db?.overrides ?? {}, [db?.overrides]);
  const deletedIds = db?.deletedQuestionIds ?? [];

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return questionBank.filter((question) => {
      if (subject !== "all" && question.subject !== subject) return false;
      if (difficulty !== "all" && question.difficulty !== difficulty) return false;
      const isCustom = Boolean(question.isCustom);
      const isEdited = Boolean(overrides[question.id]);
      if (source === "seed" && isCustom) return false;
      if (source === "custom" && !isCustom) return false;
      if (source === "edited" && !isEdited) return false;
      if (needle) {
        return (
          question.text.toLowerCase().includes(needle) ||
          question.topic.toLowerCase().includes(needle) ||
          subjectName(question.subject).toLowerCase().includes(needle)
        );
      }
      return true;
    });
  }, [questionBank, query, subject, difficulty, source, overrides]);

  const visible = filtered.slice(0, visibleCount);
  const customCount = questionBank.filter((question) => question.isCustom).length;
  const editedCount = Object.keys(overrides).length;
  const seedCount = questionBank.length - customCount;

  const resetFilters = () => {
    setQuery("");
    setSubject("all");
    setDifficulty("all");
    setSource("all");
    setVisibleCount(PAGE_SIZE);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyInput(subject !== "all" ? subject : "english-language"));
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (question: Question) => {
    setEditing(question);
    setForm(toInput(question));
    setFormError(null);
    setFormOpen(true);
  };

  const updateField = <K extends keyof AdminQuestionInput>(
    key: K,
    value: AdminQuestionInput[K]
  ) => {
    setForm((current) => {
      if (key === "subject") {
        return { ...current, subject: value as string, topic: "" };
      }
      return { ...current, [key]: value };
    });
  };

  const updateOption = (index: number, value: string) => {
    setForm((current) => {
      const options = [...current.options] as AdminQuestionInput["options"];
      options[index] = value;
      return { ...current, options };
    });
  };

  const validate = (): string | null => {
    if (!form.subject) return "Choose a subject.";
    if (!form.topic.trim()) return "Add a topic.";
    if (form.text.trim().length < 10) return "The question text must be at least 10 characters.";
    if (form.options.some((option) => !option.trim())) return "All four answer options are required.";
    const normalised = form.options.map((option) => option.trim().toLowerCase());
    if (new Set(normalised).size < 4) return "Answer options must be different from each other.";
    if (form.correctIndex < 0 || form.correctIndex > 3) return "Select the correct answer.";
    if (form.explanation.trim().length < 10) {
      return "Write an explanation of at least 10 characters.";
    }
    const duplicate = questionBank.find(
      (question) =>
        question.id !== editing?.id &&
        question.text.trim().toLowerCase() === form.text.trim().toLowerCase()
    );
    if (duplicate) return "A question with identical text already exists in the bank.";
    return null;
  };

  const submit = () => {
    const error = validate();
    if (error) {
      setFormError(error);
      return;
    }
    setBusy(true);
    const payload: AdminQuestionInput = {
      ...form,
      topic: form.topic.trim(),
      text: form.text.trim(),
      options: form.options.map((option) => option.trim()) as AdminQuestionInput["options"],
      explanation: form.explanation.trim()
    };
    const outcome = editing ? editQuestion(editing.id, payload) : addQuestion(payload);
    setBusy(false);
    if (outcome.ok) {
      toast.success(
        editing ? "Question updated" : "Question added",
        editing
          ? editing.isCustom
            ? "Your custom question has been updated."
            : "This seed question now uses your edited version."
          : "The question is now live in the bank."
      );
      setFormOpen(false);
      setEditing(null);
      setExpanded(null);
    } else {
      setFormError(outcome.error ?? "Could not save the question.");
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const outcome = removeQuestion(deleteTarget.id);
    if (outcome.ok) {
      toast.info("Question removed", `${subjectName(deleteTarget.subject)} · ${deleteTarget.topic}`);
      setDeleteTarget(null);
      setExpanded(null);
    } else {
      toast.error("Could not remove question", outcome.error);
    }
  };

  const exportQuestions = () => {
    const rows = [
      [
        "id",
        "subject",
        "topic",
        "difficulty",
        "question",
        "optionA",
        "optionB",
        "optionC",
        "optionD",
        "correctAnswer",
        "explanation",
        "source"
      ],
      ...filtered.map((question) => [
        question.id,
        subjectName(question.subject),
        question.topic,
        question.difficulty,
        question.text,
        ...question.options,
        LETTERS[question.correctIndex],
        question.explanation,
        question.isCustom ? "custom" : overrides[question.id] ? "edited-seed" : "seed"
      ])
    ];
    downloadFile(
      `praise-question-bank-${new Date().toISOString().slice(0, 10)}.csv`,
      rows
        .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        .join("\n"),
      "text/csv"
    );
  };

  const formTopics = getSubject(form.subject)?.topics ?? [];

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Administration"
        title="Question bank"
        description="Add, edit, inspect and remove questions. Seed edits are stored as overrides so the original content can be restored by resetting demo data."
        actions={
          <>
            <button
              type="button"
              onClick={exportQuestions}
              className="btn-secondary"
              disabled={!filtered.length}
            >
              <Download className="h-4 w-4" />
              Export
            </button>
            <Link href="/admin/import" className="btn-secondary">
              <Layers className="h-4 w-4" />
              Bulk import
            </Link>
            <button type="button" onClick={openCreate} className="btn-primary">
              <Plus className="h-4 w-4" />
              Add question
            </button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total questions", value: questionBank.length, icon: BookOpen, accent: "text-brand-400" },
          { label: "Seed questions", value: seedCount, icon: ShieldCheck, accent: "text-emerald-400" },
          { label: "Custom questions", value: customCount, icon: Sparkles, accent: "text-cyan-400" },
          { label: "Edited seeds", value: editedCount, icon: Pencil, accent: "text-amber-400" }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="card flex items-center gap-3 p-4">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-line/10 bg-white/[0.03]">
                <Icon className={cn("h-5 w-5", item.accent)} />
              </span>
              <div>
                <p className="text-[11px] text-muted">{item.label}</p>
                <p className="text-lg font-bold text-ink">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              placeholder="Search question text, topic or subject"
              aria-label="Search question bank"
              className="input h-9 pl-8 text-xs"
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-3 xl:w-auto">
            <select
              value={subject}
              onChange={(event) => {
                setSubject(event.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              aria-label="Filter by subject"
              className="input h-9 text-xs"
            >
              <option value="all">All subjects</option>
              {SUBJECTS.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
            <select
              value={difficulty}
              onChange={(event) => {
                setDifficulty(event.target.value as "all" | Difficulty);
                setVisibleCount(PAGE_SIZE);
              }}
              aria-label="Filter by difficulty"
              className="input h-9 text-xs"
            >
              <option value="all">All difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Intermediate</option>
              <option value="hard">Advanced</option>
            </select>
            <select
              value={source}
              onChange={(event) => {
                setSource(event.target.value as typeof source);
                setVisibleCount(PAGE_SIZE);
              }}
              aria-label="Filter by source"
              className="input h-9 text-xs"
            >
              <option value="all">All sources</option>
              <option value="seed">Seed questions</option>
              <option value="custom">Custom questions</option>
              <option value="edited">Edited seeds</option>
            </select>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-1.5 text-[11px] text-muted">
            <Filter className="h-3 w-3" />
            Showing {filtered.length ? Math.min(visibleCount, filtered.length) : 0} of{" "}
            {filtered.length} matching question{filtered.length === 1 ? "" : "s"}
          </p>
          {filtered.length !== questionBank.length ? (
            <button type="button" onClick={resetFilters} className="btn-ghost text-[11px]">
              <RotateCcw className="h-3 w-3" />
              Clear filters
            </button>
          ) : null}
        </div>
      </div>

      {deletedIds.length ? (
        <div className="card flex items-start gap-2.5 border-amber-500/20 bg-amber-500/[0.04] p-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          <div>
            <p className="text-xs font-semibold text-ink">
              {deletedIds.length} question{deletedIds.length === 1 ? "" : "s"} currently removed
            </p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
              Deleted seed questions stay hidden on this device. Resetting demo data restores the
              complete original bank. Custom deletions are permanent.
            </p>
          </div>
        </div>
      ) : null}

      {visible.length ? (
        <div className="space-y-2.5">
          {visible.map((question) => {
            const isOpen = expanded === question.id;
            const isEdited = Boolean(overrides[question.id]);
            return (
              <div key={question.id} className="card overflow-hidden">
                <div className="flex items-start gap-3 p-4">
                  <SubjectIcon subject={question.subject} size="sm" className="mt-0.5" />
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : question.id)}
                    aria-expanded={isOpen}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-ink">
                        {subjectName(question.subject)}
                      </span>
                      <span className="chip">{question.topic}</span>
                      <Badge
                        tone={
                          question.difficulty === "hard"
                            ? "danger"
                            : question.difficulty === "medium"
                              ? "warning"
                              : "success"
                        }
                      >
                        {DIFFICULTY_LABEL[question.difficulty]}
                      </Badge>
                      {question.isCustom ? <Badge tone="cyan">Custom</Badge> : null}
                      {isEdited ? <Badge tone="warning">Edited seed</Badge> : null}
                      <span className="text-[10px] text-muted">{question.id}</span>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-sm font-medium leading-relaxed text-ink">
                      {question.text}
                    </p>
                  </button>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(question)}
                      aria-label="Edit question"
                      className="grid h-8 w-8 place-items-center rounded-lg border border-line/15 text-muted transition hover:border-brand-500/40 hover:text-brand-400"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(question)}
                      aria-label="Delete question"
                      className="grid h-8 w-8 place-items-center rounded-lg border border-line/15 text-muted transition hover:border-rose-500/40 hover:text-rose-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : question.id)}
                      aria-label={isOpen ? "Collapse question" : "Inspect question"}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-line/15 text-muted transition hover:text-ink"
                    >
                      <ChevronDown className={cn("h-3.5 w-3.5 transition", isOpen && "rotate-180")} />
                    </button>
                  </div>
                </div>

                {isOpen ? (
                  <div className="border-t border-line/10 p-4">
                    <div className="space-y-1.5">
                      {question.options.map((option, index) => (
                        <div
                          key={`${question.id}-${index}`}
                          className={cn(
                            "flex items-start gap-2 rounded-lg border px-2.5 py-1.5 text-[11px]",
                            index === question.correctIndex
                              ? "border-emerald-500/40 bg-emerald-500/10 text-ink"
                              : "border-line/10 text-muted"
                          )}
                        >
                          <span
                            className={cn(
                              "grid h-4 w-4 shrink-0 place-items-center rounded text-[9px] font-bold",
                              index === question.correctIndex
                                ? "bg-emerald-500 text-white"
                                : "border border-line/20 text-muted"
                            )}
                          >
                            {index === question.correctIndex ? (
                              <Check className="h-2.5 w-2.5" />
                            ) : (
                              LETTERS[index]
                            )}
                          </span>
                          {option}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2.5 rounded-lg border border-brand-500/20 bg-brand-500/[0.06] p-2.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-300">
                        Explanation
                      </p>
                      <p className="mt-1 text-[11px] leading-relaxed text-muted">
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}

          {filtered.length > visibleCount ? (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                className="btn-secondary text-xs"
              >
                Load {Math.min(PAGE_SIZE, filtered.length - visibleCount)} more
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title={questionBank.length ? "No questions match your filters" : "The question bank is empty"}
          description={
            questionBank.length
              ? "Try a different subject, difficulty or search term. Clear the filters to see the full bank."
              : "Add your first question, or import a CSV/JSON batch from the bulk import screen."
          }
          action={
            <button type="button" onClick={resetFilters} className="btn-primary">
              <RotateCcw className="h-4 w-4" />
              Clear filters
            </button>
          }
        />
      )}

      <Modal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
          setFormError(null);
        }}
        title={editing ? "Edit question" : "Add a question"}
        description={
          editing
            ? "Saving changes to a seed question creates an override. The original stays intact."
            : "Every question needs four distinct options and an explanation."
        }
        size="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => {
                setFormOpen(false);
                setEditing(null);
                setFormError(null);
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="button" onClick={submit} className="btn-primary" disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {editing ? "Save changes" : "Add question"}
            </button>
          </>
        }
      >
        <div className="space-y-3">
          {formError ? (
            <p
              role="alert"
              className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-xs text-rose-400"
            >
              {formError}
            </p>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="question-subject" className="label">
                Subject
              </label>
              <select
                id="question-subject"
                className="input"
                value={form.subject}
                onChange={(event) => updateField("subject", event.target.value)}
              >
                {SUBJECTS.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="question-difficulty" className="label">
                Difficulty
              </label>
              <select
                id="question-difficulty"
                className="input"
                value={form.difficulty}
                onChange={(event) =>
                  updateField("difficulty", event.target.value as Difficulty)
                }
              >
                <option value="easy">Easy</option>
                <option value="medium">Intermediate</option>
                <option value="hard">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="question-topic" className="label">
              Topic
            </label>
            <input
              id="question-topic"
              className="input"
              list="admin-question-topics"
              value={form.topic}
              onChange={(event) => updateField("topic", event.target.value)}
              placeholder="e.g. Algebra"
            />
            <datalist id="admin-question-topics">
              {formTopics.map((topic) => (
                <option key={topic} value={topic} />
              ))}
            </datalist>
          </div>

          <div>
            <label htmlFor="question-text" className="label">
              Question text
            </label>
            <textarea
              id="question-text"
              className="input min-h-[90px] resize-y"
              value={form.text}
              onChange={(event) => updateField("text", event.target.value)}
              placeholder="Write a clear, unambiguous question."
            />
          </div>

          <div>
            <p className="label">Answer options — select the correct one</p>
            <div className="space-y-2">
              {form.options.map((option, index) => (
                <label
                  key={index}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl border p-2 transition",
                    form.correctIndex === index
                      ? "border-emerald-500/40 bg-emerald-500/[0.06]"
                      : "border-line/15"
                  )}
                >
                  <input
                    type="radio"
                    name="correct-answer"
                    checked={form.correctIndex === index}
                    onChange={() => updateField("correctIndex", index)}
                    className="h-4 w-4 accent-emerald-500"
                    aria-label={`Mark option ${LETTERS[index]} correct`}
                  />
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-line/20 text-[10px] font-bold text-muted">
                    {LETTERS[index]}
                  </span>
                  <input
                    className="input h-9 flex-1 text-xs"
                    value={option}
                    onChange={(event) => updateOption(index, event.target.value)}
                    placeholder={`Option ${LETTERS[index]}`}
                    aria-label={`Option ${LETTERS[index]}`}
                  />
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="question-explanation" className="label">
              Explanation
            </label>
            <textarea
              id="question-explanation"
              className="input min-h-[90px] resize-y"
              value={form.explanation}
              onChange={(event) => updateField("explanation", event.target.value)}
              placeholder="Explain why the correct answer is right."
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Remove this question?"
        description="Students will no longer see it in practice or examinations."
        footer={
          <>
            <button type="button" onClick={() => setDeleteTarget(null)} className="btn-secondary">
              Keep question
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="btn-primary bg-gradient-to-r from-rose-500 to-rose-700"
            >
              <Trash2 className="h-4 w-4" />
              Remove question
            </button>
          </>
        }
      >
        <div className="space-y-2">
          <p className="text-xs leading-relaxed text-muted">{deleteTarget?.text}</p>
          <p className="text-[11px] text-muted">
            {deleteTarget?.isCustom
              ? "This is a custom question, so removal is permanent."
              : "This is a seed question. Reset demo data to restore the original bank later."}
          </p>
        </div>
      </Modal>
    </div>
  );
}
