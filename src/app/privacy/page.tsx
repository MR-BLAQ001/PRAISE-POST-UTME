import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Cookie,
  Database,
  EyeOff,
  Lock,
  Mail,
  RefreshCw,
  Share2,
  ShieldCheck,
  Trash2,
  UserRound
} from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How PRAISE POST UTME handles your data in local demo mode and what changes when Supabase is enabled."
};

const SECTIONS = [
  {
    icon: Database,
    title: "What is stored",
    body: [
      "In demo mode, everything you create is stored in this browser's local storage: your account profile, results, practice answers, bookmarks, notes, study plan, notifications, reports and platform settings.",
      "Passwords are salted and hashed before they are stored. Your plain-text password is never saved. Despite this, local demo accounts are not a substitute for production authentication.",
      "The demo storage key is ppu.v1.db. Your theme preference is stored separately under ppu.v1.theme, and an in-progress examination is stored under ppu.v1.exam-session."
    ]
  },
  {
    icon: EyeOff,
    title: "What is not collected",
    body: [
      "There is no advertising network, no third-party analytics script and no cross-site tracking pixel in this build. Your activity is not sold or shared with advertisers.",
      "Your email address is never displayed on a public leaderboard. Only your display name, username, avatar (if you set one) and performance summary can appear there.",
      "Guest sessions are not ranked and are not listed among registered students in the admin view."
    ]
  },
  {
    icon: UserRound,
    title: "Leaderboard visibility",
    body: [
      "You can hide yourself from the leaderboard at any time from Profile & preferences. The setting takes effect immediately and is respected by the ranking logic.",
      "Only full CBT simulations and custom examinations contribute to ranking. Practice drills are visible only to you in your analytics.",
      "Administrators can also update a student's leaderboard preference. This is logged as an account-level administrative action."
    ]
  },
  {
    icon: Cookie,
    title: "Cookies and local storage",
    body: [
      "The platform does not use advertising cookies. Theme preference and demo data use browser local storage so the app can work without an account server.",
      "Clearing your browser storage removes your demo account, results, notes and settings. Download a backup from admin settings first if you need to keep a copy.",
      "The service worker caches the application shell and static assets for offline use. It never caches API responses or requests to /api/."
    ]
  },
  {
    icon: Share2,
    title: "When Supabase is enabled",
    body: [
      "The repository includes a production path for Supabase. If the site operator enables it, account and result data is stored in the operator's Supabase project instead of this browser.",
      "The service role key is server-only and must never be exposed in a NEXT_PUBLIC_* variable. Row-level security policies are provided in supabase/schema.sql so students can read and write only their own records.",
      "This build does not automatically upload local demo data to Supabase. Moving from demo mode to production requires an intentional migration."
    ]
  },
  {
    icon: Lock,
    title: "Security limits of demo mode",
    body: [
      "Demo authentication is designed for learning and evaluation. Because the entire database lives in the browser, a determined user can inspect or modify it.",
      "Do not use a real, reused password in demo mode. Use the provided demo accounts or a throwaway password.",
      "Production deployments should use Supabase Auth or another trusted identity provider, server-side authorization checks and the included row-level security policies."
    ]
  }
];

export default function PrivacyPage() {
  return (
    <PublicShell>
      <div className="container-page py-10 sm:py-14">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back home
        </Link>

        <div className="mx-auto mt-6 max-w-3xl">
          <Badge tone="brand">Privacy</Badge>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Your data, clearly explained.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
            This page describes how PRAISE POST UTME handles information in the default demo mode and
            what changes if a site operator enables the Supabase production path. It is written to be
            read, not to hide behind legal language.
          </p>
          <p className="mt-3 text-[11px] text-muted">Last updated: 6 November 2026</p>

          <div className="mt-5 card flex items-start gap-3 border-emerald-500/20 bg-emerald-500/[0.04] p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
            <div>
              <p className="text-xs font-semibold text-ink">The short version</p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted">
                Demo mode keeps your data in this browser. There are no ads, no third-party
                analytics and no sale of personal data. You can hide from the leaderboard, and you can
                erase everything by resetting demo data.
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <section key={section.title} className="card p-5 sm:p-6">
                  <h2 className="flex items-center gap-2 text-base font-bold text-ink">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-500/10 text-brand-400">
                      <Icon className="h-4 w-4" />
                    </span>
                    {section.title}
                  </h2>
                  <div className="mt-3 space-y-2.5">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="text-sm leading-relaxed text-muted">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          <section className="card mt-4 border-brand-500/20 p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-base font-bold text-ink">
              <Trash2 className="h-4 w-4 text-rose-400" />
              Erasing your data
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Signed-in students can reset all demo data from Profile & preferences. Administrators
              can do the same from Platform settings. Either action removes accounts (except the two
              seed accounts), results, practice, notes, bookmarks, custom questions and settings from
              this browser.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/profile" className="btn-secondary text-xs">
                Profile & preferences
              </Link>
              <Link href="/admin/settings" className="btn-secondary text-xs">
                Admin settings
              </Link>
            </div>
          </section>

          <section className="card mt-4 p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-base font-bold text-ink">
              <Mail className="h-4 w-4 text-cyan-400" />
              Contact
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Questions about privacy, a correction to a question, or a request related to a
              production deployment can be sent to{" "}
              <span className="font-medium text-ink">support@praise.ng</span>.
            </p>
            <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-muted">
              <RefreshCw className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              This policy may be updated as the platform adds production features. Material changes
              should be announced in the site notice before they take effect.
            </p>
          </section>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <Link href="/about" className="btn-secondary text-xs">
              About & disclaimer
            </Link>
            <Link href="/offline" className="btn-ghost text-xs">
              Offline use
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
