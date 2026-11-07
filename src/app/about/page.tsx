import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  Database,
  GraduationCap,
  Heart,
  Layers,
  Lock,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users
} from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { Badge } from "@/components/ui/badge";
import { bankStats } from "@/lib/questions";
import { SUBJECTS } from "@/lib/subjects";
import { UNIVERSITIES } from "@/lib/universities";

export const metadata: Metadata = {
  title: "About & disclaimer",
  description:
    "What PRAISE POST UTME is, how the question bank and leaderboard work, and the limits of an independent study platform."
};

const stats = bankStats();

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "Honesty over hype",
    text: "No fake leaderboards, no invented cut-off marks, no seeded students and no hardcoded scores. Every number on the platform comes from real content or real activity."
  },
  {
    icon: BookOpenCheck,
    title: "Explanations, not just answers",
    text: "Every question carries a written explanation. A practice session is only useful if you understand why the correct answer is correct."
  },
  {
    icon: Target,
    title: "Preparation that respects your time",
    text: "Short drills, focused topic practice and full timed simulations. You choose the depth; the platform keeps your history organised."
  },
  {
    icon: Lock,
    title: "Privacy by default",
    text: "Demo mode stores your data in this browser. Your email is never shown on a public leaderboard, and leaderboard visibility is optional."
  }
];

export default function AboutPage() {
  return (
    <PublicShell>
      <div className="container-page py-10 sm:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <Badge tone="brand">About PRAISE POST UTME</Badge>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            A serious practice platform for a serious exam.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
            PRAISE POST UTME is an independent study tool for Nigerian candidates preparing for
            university POST-UTME screening. It combines a realistic computer-based test engine with
            a large bank of original, explained questions and honest performance analytics.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {[
              `${stats.total} original questions`,
              `${SUBJECTS.length} subjects`,
              `${UNIVERSITIES.length} university guides`,
              "No fake rankings"
            ].map((item) => (
              <span key={item} className="chip">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2">
          {PRINCIPLES.map((principle) => {
            const Icon = principle.icon;
            return (
              <div key={principle.title} className="card p-5 sm:p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-brand-500/20 bg-brand-500/10 text-brand-400">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-3 text-base font-semibold text-ink">{principle.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted">{principle.text}</p>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-12 max-w-3xl space-y-8">
          <section className="card p-5 sm:p-7">
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
              <Layers className="h-5 w-5 text-brand-400" />
              How the question bank was built
            </h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
              <p>
                The seed bank contains exactly {stats.total} questions: fifty in each of the{" "}
                {SUBJECTS.length} subjects. Every question is original practice material written for
                this platform. They are mapped to the topics Nigerian candidates are expected to
                study, and each one includes four distinct options and a written explanation.
              </p>
              <p>
                Questions are labelled Easy, Intermediate or Advanced. Full CBT simulations draw from
                a mixed pool by default, so a paper is not artificially easy or repetitive. Practice
                sessions can be filtered by difficulty when you want to work at a specific level.
              </p>
              <p>
                Administrators can add or import their own questions. Custom and edited questions are
                clearly marked in results and are scored locally in demo mode, because the validation
                API only holds the original seed answer keys.
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Questions", value: stats.total, icon: BookOpenCheck },
                { label: "Subjects", value: SUBJECTS.length, icon: GraduationCap },
                { label: "Topics", value: stats.topics, icon: BarChart3 },
                { label: "University guides", value: UNIVERSITIES.length, icon: Layers }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="rounded-xl border border-line/10 bg-white/[0.02] p-3 text-center"
                  >
                    <Icon className="mx-auto h-4 w-4 text-brand-400" />
                    <p className="mt-1 text-lg font-bold text-ink">{item.value}</p>
                    <p className="text-[10px] uppercase tracking-wide text-muted">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="card p-5 sm:p-7">
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
              <Trophy className="h-5 w-5 text-gold" />
              How the leaderboard stays honest
            </h2>
            <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-muted">
              {[
                "Only completed full CBT simulations and custom examinations are ranked. Practice drills never count.",
                "Ranking uses average accuracy first, then points, then the number of ranked examinations. Volume alone cannot buy a top position.",
                "Guest sessions and students who opt out are excluded. No seeded student or artificial score appears anywhere.",
                "Points are simple and visible: 10 per correct answer plus a 50-point bonus for a perfect paper."
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="card p-5 sm:p-7">
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
              <Database className="h-5 w-5 text-cyan-400" />
              University information
            </h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
              <p>
                The university guides provide general reference material: faculties, popular courses,
                typical POST-UTME subject combinations, general requirements and an official website
                link. They are a starting point, not an admission decision.
              </p>
              <p>
                Cut-off marks, screening dates, fees and departmental requirements change every year
                and differ by course. This platform deliberately does not publish guessed cut-off
                marks or screening dates. Always verify details on the official university website or
                portal before you act.
              </p>
            </div>
            <Link href="/universities" className="btn-secondary mt-4 text-xs">
              Browse university guides
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </section>

          <section className="card p-5 sm:p-7">
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
              <ClipboardCheck className="h-5 w-5 text-violet-400" />
              What this platform is not
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {[
                "Not affiliated with JAMB, any university, or any examination body.",
                "Not a source of official cut-off marks, admission lists or screening dates.",
                "Not a guarantee of admission or of a particular score.",
                "Not a replacement for your syllabus, textbooks or teachers."
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-line/10 bg-white/[0.02] p-3 text-xs leading-relaxed text-muted"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="card border-brand-500/20 p-5 sm:p-7">
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
              <Users className="h-5 w-5 text-brand-400" />
              Built for students, with care
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              The platform was designed around the realities of preparing in Nigeria: limited data,
              shared devices and busy school schedules. The interface is responsive, the core
              experience works offline after the first visit, and demo mode requires no account
              provider or payment.
            </p>
            <p className="mt-3 flex items-center gap-2 text-xs text-muted">
              <Heart className="h-3.5 w-3.5 text-rose-400" />
              Questions, corrections and feedback: support@praise.ng
            </p>
          </section>

          <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-brand-500/20 bg-gradient-to-br from-brand-600/10 to-cyan-500/5 p-6 sm:flex-row">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Sparkles className="h-4 w-4 text-brand-400" />
                Ready to practise?
              </p>
              <p className="mt-1 text-xs text-muted">
                Start with a quick drill or sit a full timed simulation.
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/practice" className="btn-secondary text-xs">
                Practice hub
              </Link>
              <Link href="/exam" className="btn-primary text-xs">
                Full CBT
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <p className="text-center text-[11px] text-muted">
            See also:{" "}
            <Link href="/privacy" className="text-brand-400 hover:text-brand-300">
              Privacy
            </Link>{" "}
            ·{" "}
            <Link href="/offline" className="text-brand-400 hover:text-brand-300">
              Offline use
            </Link>
          </p>
        </div>
      </div>
    </PublicShell>
  );
}
