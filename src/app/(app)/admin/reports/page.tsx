"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CircleSlash,
  ClipboardCheck,
  Flag,
  Inbox,
  RotateCcw,
  Search,
  ShieldCheck
} from "lucide-react";
import { SubjectIcon } from "@/components/subjects/subject-icon";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { useApp } from "@/components/providers/app-provider";
import { useToast } from "@/components/providers/toast-provider";
import { subjectName } from "@/lib/subjects";
import { cn, formatDateTime, timeAgo } from "@/lib/utils";
import type { QuestionReport } from "@/lib/types";

type StatusFilter = "all" | QuestionReport["status"];

const STATUS_STYLES: Record<
  QuestionReport["status"],
  { label: string; tone: "warning" | "success" | "neutral" }
> = {
  open: { label: "Open", tone: "warning" },
  resolved: { label: "Resolved", tone: "success" },
  dismissed: { label: "Dismissed", tone: "neutral" }
};

export default function AdminReportsPage() {
  const toast = useToast();
  const { reports, questionBank, updateReport } = useApp();

  const [status, setStatus] = useState<StatusFilter>("open");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<QuestionReport | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return reports.filter((report) => {
      if (status !== "all" && report.status !== status) return false;
      if (!needle) return true;
      const question = questionBank.find((item) => item.id === report.questionId);
      return (
        report.reason.toLowerCase().includes(needle) ||
        report.detail.toLowerCase().includes(needle) ||
        report.userName.toLowerCase().includes(needle) ||
        report.questionId.toLowerCase().includes(needle) ||
        subjectName(report.subject).toLowerCase().includes(needle) ||
        (question?.text.toLowerCase().includes(needle) ?? false)
      );
    });
  }, [reports, status, query, questionBank]);

  const openCount = reports.filter((report) => report.status === "open").length;
  const resolvedCount = reports.filter((report) => report.status === "resolved").length;
  const dismissedCount = reports.filter((report) => report.status === "dismissed").length;

  const changeStatus = (report: QuestionReport, next: QuestionReport["status"]) => {
    const outcome = updateReport(report.id, next);
    if (outcome.ok) {
      toast.success(
        next === "resolved"
          ? "Report resolved"
          : next === "dismissed"
            ? "Report dismissed"
            : "Report reopened",
        `${subjectName(report.subject)} · ${report.reason}`
      );
      setSelected(null);
    } else {
      toast.error("Could not update report", outcome.error);
    }
  };

  const selectedQuestion = selected
    ? questionBank.find((question) => question.id === selected.questionId)
    : null;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Moderation"
        title="Question reports"
        description="Every report comes from a student reviewing a real attempt. Resolve genuine errors, dismiss mistaken reports, and keep an audit trail of the decision."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Open reports"
          value={openCount}
          hint="Awaiting a decision"
          icon={Flag}
          accent="rose"
        />
        <StatCard
          label="Resolved"
          value={resolvedCount}
          hint="Question corrected or confirmed"
          icon={CheckCircle2}
          accent="emerald"
        />
        <StatCard
          label="Dismissed"
          value={dismissedCount}
          hint="No action required"
          icon={CircleSlash}
          accent="amber"
        />
        <StatCard
          label="Total reports"
          value={reports.length}
          hint="Since this device was set up"
          icon={ShieldCheck}
          accent="brand"
        />
      </div>

      <div className="card p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                { value: "open", label: "Open", count: openCount },
                { value: "resolved", label: "Resolved", count: resolvedCount },
                { value: "dismissed", label: "Dismissed", count: dismissedCount },
                { value: "all", label: "All reports", count: reports.length }
              ] as { value: StatusFilter; label: string; count: number }[]
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setStatus(option.value)}
                aria-pressed={status === option.value}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
                  status === option.value
                    ? "border-brand-500/50 bg-brand-500/15 text-brand-300"
                    : "border-line/15 text-muted hover:text-ink"
                )}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>
          <div className="relative sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search reports, students or questions"
              aria-label="Search reports"
              className="input h-9 pl-8 text-xs"
            />
          </div>
        </div>
      </div>

      {filtered.length ? (
        <div className="space-y-2.5">
          {filtered.map((report) => {
            const question = questionBank.find((item) => item.id === report.questionId);
            const style = STATUS_STYLES[report.status];
            return (
              <div key={report.id} className="card p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <SubjectIcon subject={report.subject} size="sm" className="mt-0.5" />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="text-sm font-semibold text-ink">{report.reason}</p>
                        <Badge tone={style.tone}>{style.label}</Badge>
                        <span className="chip">{subjectName(report.subject)}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted">
                        Reported by {report.userName} · {timeAgo(report.createdAt)} ·{" "}
                        <span className="font-mono">{report.questionId}</span>
                      </p>
                      {report.detail ? (
                        <p className="mt-2 rounded-lg border border-line/10 bg-white/[0.02] px-2.5 py-1.5 text-[11px] leading-relaxed text-muted">
                          {report.detail}
                        </p>
                      ) : null}
                      {question ? (
                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink">
                          {question.text}
                        </p>
                      ) : (
                        <p className="mt-2 text-[11px] italic text-muted">
                          The reported question is no longer in the bank.
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelected(report)}
                      className="btn-secondary text-[11px]"
                    >
                      <Inbox className="h-3 w-3" />
                      Open
                    </button>
                    {report.status === "open" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => changeStatus(report, "resolved")}
                          className="btn-secondary text-[11px] text-emerald-400"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          Resolve
                        </button>
                        <button
                          type="button"
                          onClick={() => changeStatus(report, "dismissed")}
                          className="btn-ghost text-[11px]"
                        >
                          Dismiss
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => changeStatus(report, "open")}
                        className="btn-ghost text-[11px]"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Reopen
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={status === "open" ? ClipboardCheck : Flag}
          title={
            status === "open"
              ? "No open reports"
              : reports.length
                ? "No reports match this filter"
                : "No question reports yet"
          }
          description={
            status === "open"
              ? "Every student report has been reviewed. New reports will appear here as soon as they are submitted."
              : reports.length
                ? "Try a different status or clear the search."
                : "Students can report a question from any result review or during a practice session. Reports help keep the bank accurate."
          }
        />
      )}

      <div className="card border-brand-500/20 p-4">
        <p className="flex items-center gap-2 text-xs font-semibold text-ink">
          <AlertTriangle className="h-3.5 w-3.5 text-brand-400" />
          Moderation policy
        </p>
        <p className="mt-1 text-[11px] leading-relaxed text-muted">
          Resolve a report only after checking the question text, answer key and explanation. Use the
          question bank screen to correct the content. Dismiss reports that are mistaken or duplicate;
          the audit trail keeps the report visible under its new status.
        </p>
      </div>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected ? selected.reason : "Report"}
        description={selected ? `Submitted ${formatDateTime(selected.createdAt)}` : undefined}
        size="lg"
        footer={
          selected ? (
            <>
              <button type="button" onClick={() => setSelected(null)} className="btn-secondary">
                Close
              </button>
              {selected.status === "open" ? (
                <>
                  <button
                    type="button"
                    onClick={() => changeStatus(selected, "dismissed")}
                    className="btn-secondary"
                  >
                    <CircleSlash className="h-4 w-4" />
                    Dismiss
                  </button>
                  <button
                    type="button"
                    onClick={() => changeStatus(selected, "resolved")}
                    className="btn-primary"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark resolved
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => changeStatus(selected, "open")}
                  className="btn-primary"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reopen report
                </button>
              )}
            </>
          ) : null
        }
      >
        {selected ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { label: "Status", value: STATUS_STYLES[selected.status].label },
                { label: "Reporter", value: selected.userName },
                { label: "Subject", value: subjectName(selected.subject) },
                { label: "Question", value: selected.questionId }
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-line/10 bg-white/[0.02] p-3">
                  <p className="text-[10px] uppercase tracking-wide text-muted">{item.label}</p>
                  <p className="mt-0.5 truncate text-xs font-bold text-ink">{item.value}</p>
                </div>
              ))}
            </div>

            {selected.detail ? (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                  Student detail
                </p>
                <p className="mt-1 rounded-xl border border-line/10 p-3 text-xs leading-relaxed text-muted">
                  {selected.detail}
                </p>
              </div>
            ) : null}

            {selectedQuestion ? (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                  Question content
                </p>
                <div className="mt-1 rounded-xl border border-line/10 p-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="chip">{selectedQuestion.topic}</span>
                    <span className="chip">{selectedQuestion.difficulty}</span>
                    {selectedQuestion.isCustom ? <Badge tone="cyan">Custom</Badge> : null}
                  </div>
                  <p className="mt-2 text-xs font-medium leading-relaxed text-ink">
                    {selectedQuestion.text}
                  </p>
                  <div className="mt-2 space-y-1">
                    {selectedQuestion.options.map((option, index) => (
                      <p
                        key={`${selectedQuestion.id}-${index}`}
                        className={
                          index === selectedQuestion.correctIndex
                            ? "rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-[11px] text-ink"
                            : "rounded-lg border border-line/10 px-2 py-1 text-[11px] text-muted"
                        }
                      >
                        <span className="mr-1.5 font-bold">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        {option}
                      </p>
                    ))}
                  </div>
                  <div className="mt-2 rounded-lg border border-brand-500/20 bg-brand-500/[0.06] p-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-300">
                      Explanation
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted">
                      {selectedQuestion.explanation}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
