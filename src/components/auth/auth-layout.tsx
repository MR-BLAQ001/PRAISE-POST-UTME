import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  ShieldCheck,
  Sparkles,
  Target
} from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { Logo } from "@/components/brand/logo";
import { badgeText } from "@/lib/auth-copy";

export function AuthLayout({
  eyebrow,
  title,
  description,
  children,
  footer
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <PublicShell>
      <div className="container-page grid min-h-[calc(100vh-4rem)] items-center gap-12 py-10 lg:grid-cols-[1fr_minmax(0,460px)] lg:py-16">
        <div className="hidden lg:block">
          <Logo size="lg" />
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-500/25 bg-brand-500/10 px-3 py-1 text-[11px] font-semibold text-brand-300">
            <Sparkles className="h-3.5 w-3.5" />
            {badgeText}
          </p>
          <h2 className="mt-5 max-w-lg text-4xl font-extrabold leading-[1.08] tracking-tight text-ink">
            Your POST-UTME preparation, finally organised.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            Realistic CBT simulations, 800 original explained questions and analytics built from
            your actual answers. No noise, no invented scores.
          </p>

          <div className="mt-8 space-y-4">
            {[
              { icon: ClipboardCheck, title: "Realistic CBT engine", text: "Timer, palette, autosave and automatic submission." },
              { icon: BarChart3, title: "Honest performance data", text: "Subject and topic accuracy from every attempt." },
              { icon: Target, title: "Practice that adapts", text: "Weakness training drawn from your own results." },
              { icon: ShieldCheck, title: "Integrity by default", text: "No fake leaderboards or invented cut-off marks." }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-brand-500/20 bg-brand-500/10 text-brand-400">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{item.title}</p>
                    <p className="text-xs leading-relaxed text-muted">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {["800 questions", "16 subjects", "10 university guides"].map((item) => (
              <span key={item} className="chip">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="card p-6 shadow-card sm:p-8">
            <div className="lg:hidden">
              <Logo />
            </div>
            <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-400 lg:mt-0">
              {eyebrow}
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink">{title}</h1>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{description}</p>
            <div className="mt-6">{children}</div>
          </div>
          {footer ? <div className="mt-5 text-center text-sm text-muted">{footer}</div> : null}
          <p className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-muted">
            <Link href="/about" className="hover:text-ink">
              About & disclaimer
            </Link>
            <Link href="/privacy" className="hover:text-ink">
              Privacy
            </Link>
            <Link href="/" className="inline-flex items-center gap-1 hover:text-ink">
              Back home <ArrowRight className="h-3 w-3" />
            </Link>
          </p>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-muted">
            <BookOpenCheck className="h-3.5 w-3.5" />
            Independent study tool — not affiliated with JAMB or any university.
          </p>
        </div>
      </div>
    </PublicShell>
  );
}
