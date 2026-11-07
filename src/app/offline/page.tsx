import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  CloudOff,
  Download,
  ShieldCheck,
  Smartphone,
  WifiOff
} from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { OfflineActions } from "@/components/pwa/offline-actions";
import { ResetCacheButton } from "@/components/pwa/reset-cache-button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Offline use",
  description:
    "How PRAISE POST UTME behaves without a connection, what is cached, and what still needs the network."
};

const WORKS = [
  "The application shell, navigation and public pages you have already visited.",
  "Reading cached subject and university reference pages.",
  "Resuming an examination that was already started on this device.",
  "Completing practice with local demo scoring and saving the result.",
  "Reviewing saved results, bookmarks, notes and analytics stored locally."
];

const NEEDS_NETWORK = [
  "The first visit to the site, which installs the application shell.",
  "Server-verified scoring through /api/exam/submit.",
  "Any Supabase-backed production authentication or sync.",
  "Loading a page that has never been opened on this device before."
];

export default function OfflinePage() {
  return (
    <PublicShell>
      <div className="container-page py-10 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-br from-brand-600/20 via-card to-cyan-500/10 p-6 text-center sm:p-10">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-brand-500/25 bg-brand-500/10 text-brand-400">
                <CloudOff className="h-8 w-8" />
              </span>
              <Badge tone="warning" className="mt-4">
                You are offline
              </Badge>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                This page needs a connection — but your work is safe.
              </h1>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted">
                PRAISE POST UTME keeps your results, notes and in-progress examination in this
                browser. Reconnect and retry, or open a page that was cached during an earlier visit.
              </p>
              <div className="mt-5">
                <OfflineActions />
              </div>
            </div>

            <div className="grid gap-px border-t border-line/10 bg-line/10 sm:grid-cols-2">
              <div className="bg-card p-5">
                <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Usually available offline
                </p>
                <ul className="mt-3 space-y-2">
                  {WORKS.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[11px] leading-relaxed text-muted">
                      <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-card p-5">
                <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <WifiOff className="h-4 w-4 text-amber-400" />
                  Still needs the network
                </p>
                <ul className="mt-3 space-y-2">
                  {NEEDS_NETWORK.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[11px] leading-relaxed text-muted">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              {
                icon: Smartphone,
                title: "Install the app",
                text: "On a supported browser, use “Add to Home Screen” to launch the platform like an app."
              },
              {
                icon: ShieldCheck,
                title: "Safe caching",
                text: "The service worker caches the shell and static assets. It never caches API, auth or admin responses."
              },
              {
                icon: Download,
                title: "Keep a backup",
                text: "Administrators can download a JSON backup from settings before clearing browser storage."
              }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="card p-4">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500/10 text-brand-400">
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="mt-2 text-xs font-semibold text-ink">{item.title}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted">{item.text}</p>
                </div>
              );
            })}
          </div>

          <div className="card mt-4 border-brand-500/20 p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink">
              <BookOpenCheck className="h-4 w-4 text-brand-400" />
              If a page will not load
            </p>
            <ol className="mt-2 space-y-1.5 text-[11px] leading-relaxed text-muted">
              <li>1. Check your connection and try again.</li>
              <li>2. Open the dashboard, which is cached after your first visit.</li>
              <li>3. If the app still fails, clear the site data and reload while online.</li>
              <li>
                4. Clearing data removes local demo accounts and results, so export a backup first if
                you need one.
              </li>
            </ol>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/" className="btn-secondary text-xs">
                Back home
              </Link>
              <Link href="/practice" className="btn-primary text-xs">
                Practice hub
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <ResetCacheButton />
            </div>
          </div>

          <p className="mt-5 text-center text-[11px] text-muted">
            Read more about{" "}
            <Link href="/about" className="text-brand-400 hover:text-brand-300">
              the platform
            </Link>{" "}
            or{" "}
            <Link href="/privacy" className="text-brand-400 hover:text-brand-300">
              privacy
            </Link>
            .
          </p>
        </div>
      </div>
    </PublicShell>
  );
}
