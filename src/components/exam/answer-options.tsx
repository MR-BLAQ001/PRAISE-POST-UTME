"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Question } from "@/lib/types";

const LETTERS = ["A", "B", "C", "D"];

export function AnswerOptions({
  question,
  selectedIndex,
  onSelect,
  disabled = false,
  reveal = false
}: {
  question: Question;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  disabled?: boolean;
  reveal?: boolean;
}) {
  return (
    <div className="space-y-2.5" role="radiogroup" aria-label="Answer options">
      {question.options.map((option, index) => {
        const selected = selectedIndex === index;
        const correct = reveal && question.correctIndex === index;
        const wrong = reveal && selected && !correct;
        return (
          <button
            key={`${question.id}-${index}`}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onSelect(index)}
            className={cn(
              "group flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition",
              "border-line/15 bg-white/[0.02] hover:border-brand-500/40 hover:bg-brand-500/[0.06]",
              selected && !reveal && "border-brand-500/60 bg-brand-500/10",
              correct && "border-emerald-500/50 bg-emerald-500/10",
              wrong && "border-rose-500/50 bg-rose-500/10",
              disabled && !reveal && "cursor-default opacity-80",
              disabled && reveal && !correct && !wrong && "opacity-60"
            )}
          >
            <span
              className={cn(
                "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border text-[11px] font-bold",
                selected && !reveal && "border-brand-400 bg-brand-500 text-white",
                !selected && !reveal && "border-line/25 text-muted group-hover:border-brand-500/50",
                correct && "border-emerald-400 bg-emerald-500 text-white",
                wrong && "border-rose-400 bg-rose-500 text-white"
              )}
            >
              {correct ? (
                <Check className="h-3.5 w-3.5" />
              ) : wrong ? (
                <X className="h-3.5 w-3.5" />
              ) : (
                LETTERS[index]
              )}
            </span>
            <span className="text-sm leading-relaxed text-ink">{option}</span>
          </button>
        );
      })}
    </div>
  );
}
