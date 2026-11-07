"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Download,
  FileText,
  Search,
  Target,
  Trophy
} from "lucide-react";
import { ScoreTrendChart } from "@/components/charts/performance-charts";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { useApp } from "@/components/providers/app-provider";
import { RANKED_MODES } from "@/lib/exam";
import { MODE_LABELS, downloadFile, formatDate, formatLongDuration, timeAgo } from "@/lib/utils";
import type { ExamMode } from "@/lib/types";

const MODE_FILTERS: { value: "all" | ExamMode; label: string }[] = [
  { value: "all", label: "All attempts" },
  { value: "full-cbt", label: "Full CBT" },
  { value: "custom", label: "Custom" },
  { value: "quick-practice", label: "Quick" },
  { value: "subject-practice", label: "Subject" },
  { value: "topic-practice", label: "Topic" },
  { value: "daily-challenge", label: "Daily" },
  { value: "weakness-training", label: "Weakness" },
  { value: "revision", label: "Revision" }
];

export default function ResultsPage() {
  const { user, userResults } = useApp();
  const [mode, setMode] = useState<"all" | ExamMode>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"newest" | "highest" | "lowest">("newest");

  const filtered = useMemo(() => {
    const items = userResults.filter((result) => {
      if (mode !== "all" && result.mode !== mode) return false;
      if (query.trim()) {
        const needle = query.trim().toLowerCase();
        if (
          !result.title.toLowerCase().includes(needle) &&
          !result.subjects.some((subject) => subject.toLowerCase().includes(needle))
        ) {
          return false;
        }
      }
      return true;
    });
    return [...items].sort((a, b) => {
      if (sort === "highest") return b.percentage - a.percentage;
      if (sort === "lowest") return a.percentage - b.percentage;
      return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
    });
  }, [userResults, mode, query, sort]);

  if (!user) return null;

  const cbtResults = userResults.filter((result) => RANKED_MODES.includes(result.mode));
  const average = userResults.length
    ? Math.round(userResults.reduce((sum, result) => sum + result.percentage, 0) / userResults.length)
    : 0;
  const best = userResults.reduce((max, result) => Math.max(max, result.percentage), 0);
  const passRate = userResults.length
    ? Math.round((userResults.filter((result) => result.passed).length / userResults.length) * 100)
    : 0;
  const totalMinutes = Math.round(
    userResults.reduce((sum, result) => sum + result.timeSpentSeconds, 0) / 60
  );
  const trend = [...userResults]
    .slice(0, 10)
    .reverse()
    .map((result, index) => ({ label: `#${index + 1}`, score: result.percentage }));

  const exportResults = () => {
    const rows = [
      ["Date", "Title", "Mode", "Score", "Correct", "Total", "Percentage", "Passed", "Time (seconds)"],
      ...filtered.map((result) => [
        new Date(result.completedAt).toISOString(),
        result.title,
        MODE_LABELS[result.mode],
        result.correct,
        result.total,
        result.percentage,
        result.passed ? "Yes" : "No",
        result.timeSpentSeconds
      ])
    ];
    downloadFile(
      `praise-results-${new Date().toISOString().slice(0, 10)}.csv`,
      rows
        .map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
        )
        .join("\n"),
      "text/csv"
    );
  };

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Your history"
        title="Results & review"
        description="Every attempt you have completed on this device, with explanations and subject breakdowns."
        actions={
          <>
            <button type="button" onClick={exportResults} className="btn-secondary" disabled={!filtered.length}>
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <Link href="/practice" className="btn-primary">
              <ClipboardCheck className="h-4 w-4" />
              New attempt
            </Link>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Average score"
          value={`${average}%`}
          hint={`${userResults.length} attempt${userResults.length === 1 ? "" : "s"}`}
          icon={BarChart3}
          accent="brand"
        />
        <StatCard
          label="Personal best"
          value={`${best}%`}
          hint={cbtResults.length ? `${cbtResults.length} ranked CBT${cbtResults.length === 1 ? "" : "s"}` : "Complete a CBT to rank"}
          icon={Trophy}
          accent="amber"
        />
        <StatCard
          label="Pass rate"
          value={`${passRate}%`}
          hint="Based on your saved pass mark"
          icon={CheckCircle2}
          accent="emerald"
        />
        <StatCard
          label="Time studied"
          value={formatLongDuration(totalMinutes * 60)}
          hint="Across all saved attempts"
          icon={Clock3}
          accent="violet"
        />
      </div>

      {trend.length ? (
        <div className="card p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-ink">Score trend</h2>
              <p className="mt-0.5 text-xs text-muted">
                Most recent ten attempts, oldest to newest.
              </p>
            </div>
            <Badge tone="brand">{userResults.length} total</Badge>
          </div>
          <div className="mt-4">
            <ScoreTrendChart data={trend} />
          </div>
        </div>
      ) : null}

      <div className="card p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {MODE_FILTERS.map((option) => {
              const count =
                option.value === "all"
                  ? userResults.length
                  : userResults.filter((result) => result.mode === option.value).length;
              if (option.value !== "all" && count === 0) return null;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setMode(option.value)}
                  aria-pressed={mode === option.value}
                  className={
                    mode === option.value
                      ? "rounded-full border border-brand-500/50 bg-brand-500/15 px-3 py-1 text-[11px] font-semibold text-brand-300"
                      : "rounded-full border border-line/15 px-3 py-1 text-[11px] font-medium text-muted hover:text-ink"
                  }
                >
                  {option.label} ({count})
                </button>
              );
            })}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search results"
                aria-label="Search results"
                className="input h-9 pl-8 text-xs"
              />
            </div>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as typeof sort)}
              aria-label="Sort results"
              className="input h-9 text-xs"
            >
              <option value="newest">Newest first</option>
              <option value="highest">Highest score</option>
              <option value="lowest">Lowest score</option>
            </select>
          </div>
        </div>

        {filtered.length ? (
          <div className="mt-4 overflow-hidden rounded-xl border border-line/10">
            <div className="hidden grid-cols-[1fr_120px_100px_100px_90px_40px] gap-3 border-b border-line/10 bg-white/[0.02] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-muted lg:grid">
              <span>Attempt</span>
              <span>Mode</span>
              <span className="text-right">Score</span>
              <span className="text-right">Correct</span>
              <span className="text-right">Time</span>
              <span />
            </div>
            <div className="divide-y divide-line/10">
              {filtered.map((result) => (
                <Link
                  key={result.id}
                  href={`/results/${result.id}`}
                  className="grid gap-2 px-4 py-3 transition hover:bg-white/[0.03] lg:grid-cols-[1fr_120px_100px_100px_90px_40px] lg:items-center lg:gap-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{result.title}</p>
                    <p className="text-[11px] text-muted">
                      {formatDate(result.completedAt, {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}{" "}
                      · {timeAgo(result.completedAt)}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1 lg:hidden">
                      <Badge tone={result.passed ? "success" : "danger"}>{result.percentage}%</Badge>
                      <Badge tone="neutral">{MODE_LABELS[result.mode]}</Badge>
                    </div>
                  </div>
                  <div className="hidden lg:block">
                    <Badge tone={RANKED_MODES.includes(result.mode) ? "brand" : "neutral"}>
                      {MODE_LABELS[result.mode]}
                    </Badge>
                  </div>
                  <p
                    className={`hidden text-right text-sm font-bold tabular-nums lg:block ${
                      result.percentage >= 70
                        ? "text-emerald-400"
                        : result.percentage >= 50
                          ? "text-amber-400"
                          : "text-rose-400"
                    }`}
                  >
                    {result.percentage}%
                  </p>
                  <p className="hidden text-right text-xs tabular-nums text-muted lg:block">
                    {result.correct}/{result.total}
                  </p>
                  <p className="hidden text-right text-xs tabular-nums text-muted lg:block">
                    {Math.max(1, Math.round(result.timeSpentSeconds / 60))}m
                  </p>
                  <ArrowUpRight className="hidden h-4 w-4 text-muted lg:block" />
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title={userResults.length ? "No attempts match your filters" : "No results yet"}
            description={
              userResults.length
                ? "Clear the search or choose a different mode to see more attempts."
                : "Complete a practice session or CBT and your result will appear here immediately."
            }
            action={{ label: "Start a quick practice", href: "/practice?mode=quick-practice" }}
            className="mt-4 border-0 bg-transparent py-10"
          />
        )}
      </div>

      <div className="card border-brand-500/20 p-4">
        <p className="flex items-center gap-2 text-xs font-semibold text-ink">
          <Target className="h-3.5 w-3.5 text-brand-400" />
          Reading your results honestly
        </p>
        <p className="mt-1 text-[11px] leading-relaxed text-muted">
          Practice attempts contribute to your analytics but never to the leaderboard. Only full CBT
          simulations and custom examinations are ranked, and your rank uses average accuracy rather
          than volume.
        </p>
      </div>
    </div>
  );
}
