"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  ExternalLink,
  GraduationCap,
  MapPin,
  Search,
  ShieldCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { useApp } from "@/components/providers/app-provider";
import { UNIVERSITIES, UNIVERSITY_STATES } from "@/lib/universities";
import { cn } from "@/lib/utils";
import type { University } from "@/lib/types";

const TYPES: { value: "all" | University["type"]; label: string }[] = [
  { value: "all", label: "All types" },
  { value: "Federal", label: "Federal" },
  { value: "State", label: "State" },
  { value: "Private", label: "Private" }
];

export default function UniversitiesPage() {
  const { user, plan } = useApp();
  const [query, setQuery] = useState("");
  const [state, setState] = useState("all");
  const [type, setType] = useState<"all" | University["type"]>("all");

  const filtered = useMemo(
    () =>
      UNIVERSITIES.filter((university) => {
        if (type !== "all" && university.type !== type) return false;
        if (state !== "all" && university.state !== state) return false;
        if (query.trim()) {
          const needle = query.trim().toLowerCase();
          return (
            university.name.toLowerCase().includes(needle) ||
            university.abbreviation.toLowerCase().includes(needle) ||
            university.city.toLowerCase().includes(needle) ||
            university.state.toLowerCase().includes(needle) ||
            university.courses.some((course) => course.toLowerCase().includes(needle))
          );
        }
        return true;
      }),
    [query, state, type]
  );

  if (!user) return null;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Institution reference"
        title="Universities"
        description="Subject combinations, faculties and official links for ten Nigerian institutions. Admission requirements change every year, so every record sends you to the source of truth."
      />

      <div className="card flex flex-col gap-3 border-amber-500/20 bg-amber-500/[0.04] p-4 sm:flex-row sm:items-start">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-500/15 text-amber-400">
          <ShieldCheck className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs font-semibold text-ink">No invented cut-off marks</p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
            This platform does not publish guessed cut-off marks or screening dates. Requirements
            differ by course and change yearly — always verify on the official university website
            before making decisions.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {TYPES.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setType(option.value)}
              aria-pressed={type === option.value}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
                type === option.value
                  ? "border-brand-500/50 bg-brand-500/15 text-brand-300"
                  : "border-line/15 text-muted hover:text-ink"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={state}
            onChange={(event) => setState(event.target.value)}
            aria-label="Filter by state"
            className="input h-9 text-xs sm:w-40"
          >
            <option value="all">All states</option>
            {UNIVERSITY_STATES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <div className="relative sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search university or course"
              aria-label="Search universities"
              className="input h-9 pl-8 text-xs"
            />
          </div>
        </div>
      </div>

      {filtered.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((university) => (
            <div key={university.id} className="card card-hover flex flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 text-white">
                    <GraduationCap className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink">{university.abbreviation}</p>
                    <Badge tone={university.type === "Federal" ? "brand" : university.type === "State" ? "cyan" : "neutral"}>
                      {university.type}
                    </Badge>
                  </div>
                </div>
                {plan.targetUniversityId === university.id ? (
                  <Badge tone="gold">Target</Badge>
                ) : null}
              </div>

              <p className="mt-3 text-sm font-semibold leading-snug text-ink">{university.name}</p>
              <p className="mt-1 flex items-center gap-1 text-[11px] text-muted">
                <MapPin className="h-3 w-3" />
                {university.city}, {university.state} State
              </p>
              <p className="mt-2 line-clamp-3 text-[11px] leading-relaxed text-muted">
                {university.overview}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="chip">{university.faculties.length} faculties</span>
                <span className="chip">{university.courses.length} courses</span>
                <span className="chip">Est. {university.established}</span>
              </div>

              <div className="mt-auto flex items-center gap-2 pt-4">
                <Link href={`/universities/${university.id}`} className="btn-primary flex-1 text-xs">
                  View guide
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <a
                  href={university.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Official ${university.abbreviation} website`}
                  className="btn-secondary px-2.5 py-2"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-10 text-center">
          <Building2 className="mx-auto h-8 w-8 text-muted/50" />
          <p className="mt-2 text-sm font-medium text-ink">No universities match your filters</p>
          <p className="mt-1 text-xs text-muted">Try a different state, type or search term.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setState("all");
              setType("all");
            }}
            className="btn-secondary mt-4 text-xs"
          >
            Clear filters
          </button>
        </div>
      )}

      <div className="card p-5">
        <p className="text-sm font-semibold text-ink">How to use this reference</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {[
            {
              title: "Check the combination",
              text: "Confirm the UTME and POST-UTME subjects for your exact course, not just the faculty."
            },
            {
              title: "Verify requirements",
              text: "O'Level credits and departmental rules change. Use the official website every year."
            },
            {
              title: "Set a target",
              text: "Open a university guide and set it as your target to personalise your dashboard."
            }
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-line/10 bg-white/[0.02] p-3">
              <p className="text-xs font-semibold text-ink">{item.title}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
