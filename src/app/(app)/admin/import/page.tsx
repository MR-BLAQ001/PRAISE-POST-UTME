"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Download,
  FileJson,
  FileSpreadsheet,
  Loader2,
  Upload,
  XCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { useApp } from "@/components/providers/app-provider";
import { useToast } from "@/components/providers/toast-provider";
import {
  CSV_TEMPLATE,
  JSON_TEMPLATE,
  parseQuestionImport,
  type ImportResult
} from "@/lib/import";
import { downloadFile } from "@/lib/utils";
import type { AdminQuestionInput } from "@/lib/types";

type Format = "csv" | "json";

export default function AdminImportPage() {
  const toast = useToast();
  const { questionBank, importQuestionBatch } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);

  const [format, setFormat] = useState<Format>("csv");
  const [raw, setRaw] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<ImportResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [imported, setImported] = useState<number | null>(null);

  const existingTexts = useMemo(
    () => questionBank.map((question) => question.text),
    [questionBank]
  );

  const handleFile = async (file: File) => {
    if (file.size > 2_000_000) {
      toast.error("File too large", "Imports are limited to 2 MB of text.");
      return;
    }
    const text = await file.text();
    const guessed: Format = file.name.toLowerCase().endsWith(".json") ? "json" : "csv";
    setFormat(guessed);
    setRaw(text);
    setFileName(file.name);
    setPreview(null);
    setImported(null);
  };

  const parse = () => {
    if (!raw.trim()) {
      toast.error("Nothing to parse", "Paste your CSV/JSON or choose a file first.");
      return;
    }
    const result = parseQuestionImport(raw, format, existingTexts);
    setPreview(result);
    setImported(null);
    if (result.questions.length) {
      toast.success(
        "Preview ready",
        `${result.questions.length} valid question${result.questions.length === 1 ? "" : "s"} ready to import.`
      );
    } else {
      toast.error("No valid questions", "Fix the listed issues and parse again.");
    }
  };

  const runImport = () => {
    if (!preview?.questions.length) return;
    setBusy(true);
    const outcome = importQuestionBatch(preview.questions as AdminQuestionInput[]);
    setBusy(false);
    if (outcome.ok) {
      setImported(outcome.data ?? preview.questions.length);
      toast.success(
        "Import complete",
        `${outcome.data ?? preview.questions.length} question${(outcome.data ?? preview.questions.length) === 1 ? "" : "s"} added to the bank.`
      );
      setRaw("");
      setFileName(null);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
    } else {
      toast.error("Import failed", outcome.error);
    }
  };

  const downloadTemplate = () => {
    if (format === "csv") {
      downloadFile("praise-question-template.csv", CSV_TEMPLATE, "text/csv");
    } else {
      downloadFile("praise-question-template.json", JSON_TEMPLATE, "application/json");
    }
  };

  const errorIssues = preview?.issues.filter((issue) => issue.severity === "error") ?? [];

  return (
    <div className="space-y-5">
      <Link
        href="/admin/questions"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to question bank
      </Link>

      <PageHeader
        eyebrow="Administration"
        title="Bulk import questions"
        description="Bring in a reviewed CSV or JSON batch. Every row is validated for subject, options, answer key, explanation and duplicates before anything is written to the bank."
        actions={
          <button type="button" onClick={downloadTemplate} className="btn-secondary">
            <Download className="h-4 w-4" />
            Download {format.toUpperCase()} template
          </button>
        }
      />

      {imported !== null ? (
        <div className="card flex items-start gap-3 border-emerald-500/25 bg-emerald-500/[0.06] p-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-emerald-400">
              {imported} question{imported === 1 ? "" : "s"} imported successfully
            </p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
              They are now available in practice, custom examinations and the subject browser. Seed
              scoring still falls back to local validation for imported rows.
            </p>
          </div>
          <Link href="/admin/questions" className="btn-secondary shrink-0 text-xs">
            View bank
          </Link>
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <div className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-ink">1. Choose a format and paste data</h2>
                <p className="mt-0.5 text-[11px] text-muted">
                  CSV needs the exact template header. JSON accepts an array or an object with a
                  {" "}<code className="rounded bg-white/5 px-1 py-0.5">questions</code> array.
                </p>
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setFormat("csv");
                    setPreview(null);
                  }}
                  aria-pressed={format === "csv"}
                  className={
                    format === "csv"
                      ? "inline-flex items-center gap-1.5 rounded-lg border border-brand-500/50 bg-brand-500/15 px-3 py-1.5 text-xs font-semibold text-brand-300"
                      : "inline-flex items-center gap-1.5 rounded-lg border border-line/15 px-3 py-1.5 text-xs font-medium text-muted hover:text-ink"
                  }
                >
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                  CSV
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormat("json");
                    setPreview(null);
                  }}
                  aria-pressed={format === "json"}
                  className={
                    format === "json"
                      ? "inline-flex items-center gap-1.5 rounded-lg border border-brand-500/50 bg-brand-500/15 px-3 py-1.5 text-xs font-semibold text-brand-300"
                      : "inline-flex items-center gap-1.5 rounded-lg border border-line/15 px-3 py-1.5 text-xs font-medium text-muted hover:text-ink"
                  }
                >
                  <FileJson className="h-3.5 w-3.5" />
                  JSON
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <input
                ref={fileRef}
                type="file"
                accept=".csv,.json,text/csv,application/json"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void handleFile(file);
                }}
                className="sr-only"
                id="import-file"
              />
              <label htmlFor="import-file" className="btn-secondary cursor-pointer text-xs">
                <Upload className="h-3.5 w-3.5" />
                Choose file
              </label>
              <button
                type="button"
                onClick={() => {
                  setFormat("csv");
                  setRaw(CSV_TEMPLATE);
                  setFileName(null);
                  setPreview(null);
                }}
                className="btn-ghost text-[11px]"
              >
                Load CSV sample
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormat("json");
                  setRaw(JSON_TEMPLATE);
                  setFileName(null);
                  setPreview(null);
                }}
                className="btn-ghost text-[11px]"
              >
                Load JSON sample
              </button>
              {fileName ? (
                <span className="text-[11px] text-muted">
                  {fileName} · {raw.length.toLocaleString()} characters
                </span>
              ) : null}
            </div>

            <div className="mt-3">
              <label htmlFor="import-raw" className="label">
                {format.toUpperCase()} content
              </label>
              <textarea
                id="import-raw"
                value={raw}
                onChange={(event) => {
                  setRaw(event.target.value);
                  setPreview(null);
                }}
                spellCheck={false}
                className="input min-h-[300px] resize-y font-mono text-[11px] leading-relaxed"
                placeholder={
                  format === "csv"
                    ? CSV_TEMPLATE
                    : JSON_TEMPLATE
                }
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button type="button" onClick={parse} className="btn-primary text-xs">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Validate & preview
              </button>
              <button
                type="button"
                onClick={() => {
                  setRaw("");
                  setPreview(null);
                  setFileName(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
                className="btn-ghost text-[11px]"
                disabled={!raw}
              >
                Clear
              </button>
            </div>
          </div>

          {preview ? (
            <div className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold text-ink">2. Review the preview</h2>
                  <p className="mt-0.5 text-[11px] text-muted">
                    Nothing is imported until you press the import button.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge tone="neutral">{preview.totalRows} rows</Badge>
                  <Badge tone={preview.questions.length ? "success" : "danger"}>
                    {preview.questions.length} valid
                  </Badge>
                  <Badge tone={errorIssues.length ? "danger" : "neutral"}>
                    {errorIssues.length} issue{errorIssues.length === 1 ? "" : "s"}
                  </Badge>
                </div>
              </div>

              {preview.questions.length ? (
                <>
                  <div className="mt-4 max-h-80 space-y-2 overflow-y-auto pr-1">
                    {preview.questions.slice(0, 30).map((question, index) => (
                      <div
                        key={`${question.text}-${index}`}
                        className="rounded-xl border border-line/10 bg-white/[0.02] p-3"
                      >
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-bold text-muted">#{index + 1}</span>
                          <span className="chip">{question.subject}</span>
                          <span className="chip">{question.topic}</span>
                          <span className="chip">{question.difficulty}</span>
                          <span className="chip">
                            Answer {String.fromCharCode(65 + question.correctIndex)}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-ink">{question.text}</p>
                        <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-muted">
                          {question.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                  {preview.questions.length > 30 ? (
                    <p className="mt-2 text-center text-[10px] text-muted">
                      Previewing the first 30 rows. All {preview.questions.length} valid rows will be
                      imported.
                    </p>
                  ) : null}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={runImport}
                      disabled={busy}
                      className="btn-primary text-xs"
                    >
                      {busy ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Upload className="h-3.5 w-3.5" />
                      )}
                      Import {preview.questions.length} question
                      {preview.questions.length === 1 ? "" : "s"}
                    </button>
                    <p className="text-[10px] text-muted">
                      Imported rows are marked as custom and scored locally.
                    </p>
                  </div>
                </>
              ) : null}

              {preview.issues.length ? (
                <div className="mt-4">
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-400">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Validation messages
                  </p>
                  <div className="mt-2 max-h-56 space-y-1.5 overflow-y-auto pr-1">
                    {preview.issues.map((issue, index) => (
                      <div
                        key={`${issue.row}-${issue.field}-${index}`}
                        className={
                          issue.severity === "error"
                            ? "flex items-start gap-2 rounded-lg border border-rose-500/20 bg-rose-500/[0.06] px-2.5 py-1.5"
                            : "flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-2.5 py-1.5"
                        }
                      >
                        {issue.severity === "error" ? (
                          <XCircle className="mt-0.5 h-3 w-3 shrink-0 text-rose-400" />
                        ) : (
                          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-amber-400" />
                        )}
                        <p className="text-[10px] leading-relaxed text-muted">
                          <span className="font-semibold text-ink">
                            {issue.row ? `Row ${issue.row} · ` : ""}
                            {issue.field}:
                          </span>{" "}
                          {issue.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <EmptyState
              icon={Upload}
              title="No preview yet"
              description="Paste a batch or choose a file, then validate it. The preview shows exactly which rows will be imported and which rows need fixing."
              className="py-10"
            />
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="card p-5">
            <p className="text-sm font-semibold text-ink">Accepted columns</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted">
              CSV headers are matched case-insensitively and ignore spaces, underscores and hyphens.
            </p>
            <div className="mt-3 space-y-1.5">
              {[
                ["subject", "Required — slug or full subject name"],
                ["topic", "Required — free text"],
                ["difficulty", "easy · medium · hard (default medium)"],
                ["question", "Required — at least 10 characters"],
                ["optionA–optionD", "Required — four distinct options"],
                ["correctAnswer", "A–D, a string position 1–4, or a JSON number 0–3"],
                ["explanation", "Required — at least 10 characters"]
              ].map(([field, detail]) => (
                <div key={field} className="rounded-lg border border-line/10 px-2.5 py-1.5">
                  <p className="font-mono text-[10px] font-semibold text-brand-300">{field}</p>
                  <p className="text-[10px] leading-relaxed text-muted">{detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <p className="text-sm font-semibold text-ink">Integrity rules</p>
            <ul className="mt-2 space-y-2 text-[11px] leading-relaxed text-muted">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                Rows with any error are skipped — valid rows in the same batch still import.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                Duplicate question text within a file or against the existing bank is rejected.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                Imported questions are labelled custom so students know they are locally validated.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                There is no fake success state: the preview counts exactly what will be written.
              </li>
            </ul>
          </div>

          <div className="card border-brand-500/20 p-5">
            <p className="text-sm font-semibold text-ink">Bank size</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted">
              You currently have <span className="font-semibold text-ink">{questionBank.length}</span>{" "}
              active questions across 16 subjects. The seed bank alone holds 800.
            </p>
            <Link href="/admin/questions" className="btn-secondary mt-3 w-full text-xs">
              Open question bank
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
