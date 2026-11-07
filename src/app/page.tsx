import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Brain,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  GraduationCap,
  Layers,
  Lock,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  WifiOff,
  Zap
} from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { SubjectIcon } from "@/components/subjects/subject-icon";
import { Badge } from "@/components/ui/badge";
import { bankStats, questionCountsBySubject, questionOfTheDay } from "@/lib/questions";
import { SUBJECTS } from "@/lib/subjects";
import { PRACTICE_MODES } from "@/lib/exam";
import { UNIVERSITIES } from "@/lib/universities";
import { dateKey } from "@/lib/utils";

export const metadata: Metadata = {
  title: "PRAISE POST UTME — Practice like it is exam day",
  description:
    "Realistic Nigerian POST-UTME CBT simulations, 800 original explained questions across 16 subjects, honest analytics, leaderboards and university guidance."
};

const stats = bankStats();
const counts = questionCountsBySubject();
const sample = questionOfTheDay(dateKey());

const FEATURES = [
  {
    icon: ClipboardCheck,
    title: "A real CBT engine",
    description:
      "Timed papers, question palette, mark-for-review, autosave and automatic submission. It feels like the real screen.",
    accent: "from-brand-500 to-cyan-500"
  },
  {
    icon: BookOpenCheck,
    title: "800 original questions",
    description:
      "Fifty questions in every subject, each with a clear explanation. No copied past-paper dumps or placeholder text.",
    accent: "from-emerald-500 to-teal-500"
  },
  {
    icon: BarChart3,
    title: "Honest analytics",
    description:
      "See accuracy by subject and topic, spot weak areas and track improvement across every attempt you complete.",
    accent: "from-violet-500 to-fuchsia-500"
  },
  {
    icon: Target,
    title: "Practice that adapts",
    description:
      "Quick drills, subject and topic practice, daily challenges, weakness training and revision of past mistakes.",
    accent: "from-amber-500 to-orange-500"
  },
  {
    icon: Trophy,
    title: "Clean leaderboards",
    description:
      "Only completed CBTs count. Rankings use average accuracy first, so grinding easy questions cannot buy a top spot.",
    accent: "from-gold to-amber-600"
  },
  {
    icon: GraduationCap,
    title: "University guidance",
    description:
      "Subject combinations, faculties and official links for ten Nigerian universities — with no invented cut-off marks.",
    accent: "from-sky-500 to-blue-600"
  }
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Choose your subjects",
    description:
      "Start with English and your three POST-UTME subjects, or customise any combination you want to drill."
  },
  {
    step: "02",
    title: "Practise under pressure",
    description:
      "The timer runs, the palette tracks every answer, and your progress saves automatically if you refresh."
  },
  {
    step: "03",
    title: "Review and improve",
    description:
      "Every result includes explanations, topic accuracy and a clear next step. Weak topics become your next practice set."
  }
];

const INTEGRITY = [
  "No seeded or fictional leaderboard scores",
  "No invented cut-off marks or admission dates",
  "No hardcoded results or fake progress",
  "No email addresses exposed on public boards",
  "Questions are original practice material, clearly labelled",
  "Your data stays on your device in demo mode"
];

const FAQS = [
  {
    question: "Is this the actual POST-UTME exam?",
    answer:
      "No. PRAISE POST UTME is an independent practice platform. Questions are original study material written for practice. Always confirm admission requirements, screening dates and cut-off marks with your chosen university."
  },
  {
    question: "Do I need an account?",
    answer:
      "You can start a guest session, but a free account keeps your results, bookmarks, notes and streak on this device. Guests are excluded from leaderboards."
  },
  {
    question: "How are leaderboard positions decided?",
    answer:
      "Only completed full CBTs and custom exams count. Average accuracy is the primary criterion, with points and number of exams as tie-breakers. Practice drills never inflate your rank."
  },
  {
    question: "Can I use it on my phone?",
    answer:
      "Yes. The interface is built mobile-first, supports light and dark themes, and can be installed as an app on supported browsers. Core pages also work offline once loaded."
  }
];

export default function HomePage() {
  const grouped = SUBJECTS.reduce<Record<string, number>>((accumulator, subject) => {
    accumulator[subject.group] = (accumulator[subject.group] ?? 0) + 1;
    return accumulator;
  }, {});

  return (
    <PublicShell>
      <section className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0" aria-hidden="true" />
        <div className="container-page relative py-16 sm:py-24 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="animate-fade-up">
              <Badge tone="brand" className="px-3 py-1">
                <Sparkles className="h-3.5 w-3.5" />
                Built for Nigerian POST-UTME candidates
              </Badge>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                Practise like it&apos;s{" "}
                <span className="gradient-text">exam day.</span>
                <br />
                Walk in ready.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                A complete CBT practice platform with {stats.total} original questions across{" "}
                {stats.subjects} subjects, realistic timing, explained answers and analytics that
                tell you the truth about where you stand.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link href="/register" className="btn-primary px-5 py-3 text-sm">
                  Start practising free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/login" className="btn-secondary px-5 py-3 text-sm">
                  Sign in to your dashboard
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  No card required
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-brand-400" />
                  Honest scoring
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Smartphone className="h-4 w-4 text-cyan-400" />
                  Works on your phone
                </span>
              </div>
            </div>

            <div className="relative animate-fade-up animation-delay-200">
              <div className="absolute -inset-6 rounded-[2rem] bg-brand-500/10 blur-3xl" aria-hidden="true" />
              <div className="card relative overflow-hidden p-5 shadow-glow sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-400">
                      Full CBT simulation
                    </p>
                    <p className="mt-1 text-sm font-semibold text-ink">Question 7 of 40</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 font-mono text-sm font-bold text-amber-400">
                    <Clock3 className="h-3.5 w-3.5" />
                    28:14
                  </span>
                </div>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-line/15">
                  <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-brand-500 to-cyan-400" />
                </div>

                <div className="mt-5 rounded-xl border border-line/10 bg-bg/40 p-4">
                  <div className="flex items-center gap-2">
                    <SubjectIcon subject={sample.subject} size="sm" />
                    <span className="text-[11px] font-medium text-muted">{sample.topic}</span>
                    <Badge tone="cyan" className="ml-auto">
                      {sample.difficulty === "hard" ? "Advanced" : sample.difficulty === "medium" ? "Intermediate" : "Easy"}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-ink">{sample.text}</p>
                  <div className="mt-4 space-y-2">
                    {sample.options.map((option, optionIndex) => (
                      <div
                        key={option}
                        className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 text-xs ${
                          optionIndex === 1
                            ? "border-brand-500/50 bg-brand-500/10 text-ink"
                            : "border-line/10 text-muted"
                        }`}
                      >
                        <span
                          className={`grid h-5 w-5 place-items-center rounded text-[10px] font-bold ${
                            optionIndex === 1
                              ? "bg-brand-500 text-white"
                              : "border border-line/20 text-muted"
                          }`}
                        >
                          {["A", "B", "C", "D"][optionIndex]}
                        </span>
                        {option}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: "Answered", value: 24, tone: "text-emerald-400" },
                    { label: "Marked", value: 3, tone: "text-amber-400" },
                    { label: "Left", value: 16, tone: "text-muted" }
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg border border-line/10 bg-white/[0.02] px-2 py-2">
                      <p className={`text-base font-bold ${item.tone}`}>{item.value}</p>
                      <p className="text-[10px] text-muted">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute -bottom-5 -left-4 hidden animate-float rounded-xl border border-emerald-500/25 bg-card/95 px-3.5 py-2.5 shadow-card backdrop-blur-xl sm:block">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <TrendingUp className="h-3.5 w-3.5" />
                  +18% this week
                </p>
                <p className="mt-0.5 text-[10px] text-muted">Based on your real attempts</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line/10 bg-surface/30">
        <div className="container-page grid grid-cols-2 gap-6 py-8 sm:grid-cols-4">
          {[
            { value: stats.total, label: "Original questions", icon: Layers },
            { value: stats.subjects, label: "Subjects covered", icon: BookOpenCheck },
            { value: PRACTICE_MODES.length + 1, label: "Practice & exam modes", icon: Sparkles },
            { value: UNIVERSITIES.length, label: "University guides", icon: GraduationCap }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-brand-500/20 bg-brand-500/10 text-brand-400">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xl font-bold tracking-tight text-ink">{item.value}+</p>
                  <p className="text-[11px] text-muted">{item.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-400">
            Everything in one place
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Built like a serious exam. Designed for real studying.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            No distractions, no fake social proof and no paywall hiding the useful parts. Just the
            tools that help you answer more questions correctly.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="card card-hover p-5">
                <span
                  className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br text-white shadow-soft ${feature.accent}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-ink">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-line/10 bg-surface/30 py-16 sm:py-20">
        <div className="container-page">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-400">
                {stats.subjects} subjects. {stats.topics} topics.
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Cover the full POST-UTME syllabus.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                Fifty original questions per subject, spread across the topics Nigerian
                universities expect you to know.
              </p>
            </div>
            <Link href="/subjects" className="btn-secondary shrink-0">
              Browse all subjects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SUBJECTS.map((subject) => (
              <Link
                key={subject.slug}
                href={`/subjects/${subject.slug}`}
                className="card card-hover group flex items-start gap-3 p-4"
              >
                <SubjectIcon subject={subject.slug} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{subject.name}</p>
                  <p className="mt-0.5 text-[11px] text-muted">
                    {counts[subject.slug] ?? 0} questions · {subject.topics.length} topics
                  </p>
                  <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-brand-400/80">
                    {subject.group}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-[11px] text-muted">
            {Object.entries(grouped).map(([group, count]) => (
              <span key={group} className="chip">
                {group}: {count} subjects
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="lg:sticky lg:top-24">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-400">
              Practice modes
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Study with intention, not just volume.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Different days call for different sessions. Choose a full simulation when you need
              exam stamina, or a focused drill when one topic keeps slipping.
            </p>
            <div className="mt-6 space-y-3">
              {[
                { icon: Zap, text: "Instant explanations in practice modes" },
                { icon: RefreshCw, text: "Autosave and resume on every attempt" },
                { icon: Brain, text: "Weakness training from your own accuracy data" },
                { icon: WifiOff, text: "Core pages available offline" }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <p key={item.text} className="flex items-center gap-2.5 text-sm text-muted">
                    <span className="grid h-8 w-8 place-items-center rounded-lg border border-brand-500/20 bg-brand-500/10 text-brand-400">
                      <Icon className="h-4 w-4" />
                    </span>
                    {item.text}
                  </p>
                );
              })}
            </div>
            <Link href="/practice" className="btn-primary mt-6">
              Explore practice modes
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="card flex flex-col justify-between border-brand-500/25 bg-gradient-to-br from-brand-600/15 to-cyan-500/5 p-5 sm:col-span-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge tone="brand">Flagship</Badge>
                  <h3 className="mt-2 text-lg font-semibold text-ink">Full CBT Simulation</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    A timed paper across four subjects with the complete navigation experience.
                    Practice your pacing, not just your knowledge.
                  </p>
                </div>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 text-white">
                  <ClipboardCheck className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-muted">
                <span className="chip">40 questions</span>
                <span className="chip">40 minutes</span>
                <span className="chip">Counts on leaderboard</span>
              </div>
            </div>

            {PRACTICE_MODES.map((mode) => (
              <div key={mode.mode} className="card card-hover p-4">
                <div className="flex items-start gap-3">
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br text-white ${mode.accent}`}
                  >
                    <Target className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-ink">{mode.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{mode.description}</p>
                    <p className="mt-2 text-[10px] font-medium uppercase tracking-wide text-brand-400">
                      {mode.questions} questions · {mode.duration} min
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line/10 bg-surface/30 py-16 sm:py-20">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-400">
              Analytics that tell the truth
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Know exactly which topics are costing you marks.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Every attempt feeds a private performance profile. See accuracy by subject and
              topic, compare your weekly average and launch weakness training directly from the
              gaps.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Subject and topic accuracy from real answers",
                "Weekly progress with honest comparison to last week",
                "Streaks, achievements and personal bests",
                "Export-ready result summaries for revision"
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-muted">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/register" className="btn-primary mt-6">
              Build your performance profile
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="card p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  Accuracy snapshot
                </p>
                <p className="mt-1 text-sm text-muted">Illustrative subject breakdown</p>
              </div>
              <span className="chip">
                <CalendarCheck className="h-3.5 w-3.5" /> This week
              </span>
            </div>
            <div className="mt-5 space-y-4">
              {[
                { subject: "Biology", value: 82, tone: "from-emerald-500 to-teal-400" },
                { subject: "Chemistry", value: 74, tone: "from-brand-500 to-cyan-400" },
                { subject: "English Language", value: 68, tone: "from-sky-500 to-blue-500" },
                { subject: "Mathematics", value: 57, tone: "from-amber-500 to-orange-500" },
                { subject: "Physics", value: 42, tone: "from-rose-500 to-pink-500" }
              ].map((row) => (
                <div key={row.subject}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-medium text-ink">{row.subject}</span>
                    <span className="tabular-nums text-muted">{row.value}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-line/10">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${row.tone}`}
                      style={{ width: `${row.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-3.5">
              <p className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                <Target className="h-4 w-4" />
                Suggested next step
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Physics accuracy is below your average. A 15-question weakness session is ready
                when you are.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-400">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Three steps from nervous to prepared.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {HOW_IT_WORKS.map((step) => (
            <div key={step.step} className="card relative overflow-hidden p-6">
              <span className="text-4xl font-extrabold tracking-tight text-brand-500/20">
                {step.step}
              </span>
              <h3 className="mt-3 text-base font-semibold text-ink">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-line/10 bg-surface/30 py-16 sm:py-20">
        <div className="container-page">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-400">
                University reference
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Know the requirements before you apply.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                Subject combinations, faculties and official websites for ten institutions.
                Requirements change yearly, so every page links you to the source of truth.
              </p>
            </div>
            <Link href="/universities" className="btn-secondary shrink-0">
              View universities
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {UNIVERSITIES.slice(0, 4).map((university) => (
              <Link
                key={university.id}
                href={`/universities/${university.id}`}
                className="card card-hover p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-lg bg-brand-500/10 px-2 py-1 text-[10px] font-bold text-brand-300">
                    {university.abbreviation}
                  </span>
                  <Badge tone="neutral">{university.type}</Badge>
                </div>
                <p className="mt-3 text-sm font-semibold leading-snug text-ink">
                  {university.name}
                </p>
                <p className="mt-1 text-[11px] text-muted">
                  {university.city} · {university.state} State
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="card border-emerald-500/20 p-6">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              Our integrity promise
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink">
              What this platform will never do.
            </h2>
            <ul className="mt-5 space-y-3">
              {INTEGRITY.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-muted">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-muted">
              This is an independent study tool. It is not affiliated with JAMB or any
              university. Always verify admission information directly with the institution.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq) => (
              <details key={faq.question} className="card group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-ink">
                  {faq.question}
                  <span className="text-brand-400 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="relative overflow-hidden rounded-3xl border border-brand-500/25 bg-gradient-to-br from-brand-600/20 via-card to-cyan-500/10 p-8 sm:p-12">
          <div className="grid-bg absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <Badge tone="brand">
                <Lock className="h-3.5 w-3.5" />
                Free to start
              </Badge>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Your next attempt can be your best one.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
                Create a free account, take a baseline CBT, and let your own accuracy data decide
                what you study next.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/register" className="btn-primary px-5 py-3">
                Create free account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/practice" className="btn-secondary px-5 py-3">
                Try a quick practice
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
