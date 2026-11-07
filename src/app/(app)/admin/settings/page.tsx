"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  Database,
  Download,
  Gauge,
  HardDrive,
  Loader2,
  Lock,
  Megaphone,
  RefreshCw,
  Save,
  Server,
  Settings,
  ShieldCheck,
  Trash2,
  Users
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { useApp } from "@/components/providers/app-provider";
import { useToast } from "@/components/providers/toast-provider";
import { cn, downloadFile } from "@/lib/utils";

export default function AdminSettingsPage() {
  const router = useRouter();
  const toast = useToast();
  const {
    db,
    questionBank,
    settings,
    updatePlatformSettings,
    resetAllDemoData
  } = useApp();

  const [passMark, setPassMark] = useState(settings?.passMark ?? 50);
  const [siteNotice, setSiteNotice] = useState(settings?.siteNotice ?? "");
  const [maintenance, setMaintenance] = useState(settings?.maintenance ?? false);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const summary = useMemo(
    () => [
      { label: "Accounts", value: db?.users.length ?? 0, icon: Users },
      { label: "Questions", value: questionBank.length, icon: Database },
      { label: "Attempts", value: db?.results.length ?? 0, icon: Gauge },
      { label: "Activities", value: db?.activities.length ?? 0, icon: HardDrive }
    ],
    [db, questionBank]
  );

  if (!db || !settings) return null;

  const markDirty = () => {
    setDirty(true);
    setError(null);
  };

  const save = () => {
    setError(null);
    const mark = Number(passMark);
    if (!Number.isFinite(mark) || mark < 0 || mark > 100) {
      setError("Pass mark must be a number between 0 and 100.");
      return;
    }
    if (siteNotice.trim().length > 280) {
      setError("The site notice must be 280 characters or fewer.");
      return;
    }
    setBusy(true);
    const outcome = updatePlatformSettings({
      passMark: Math.round(mark),
      siteNotice: siteNotice.trim(),
      maintenance
    });
    setBusy(false);
    if (outcome.ok) {
      toast.success("Settings saved", "Changes apply immediately across the platform.");
      setDirty(false);
    } else {
      setError(outcome.error ?? "Could not save settings.");
    }
  };

  const exportBackup = () => {
    const safe = {
      ...db,
      users: db.users.map(({ passwordHash: _hash, passwordSalt: _salt, ...profile }) => profile),
      sessionUserId: null
    };
    downloadFile(
      `praise-backup-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(safe, null, 2),
      "application/json"
    );
    toast.info(
      "Backup downloaded",
      "Password hashes are excluded. Restore support is intentionally not exposed in demo mode."
    );
  };

  const confirmReset = () => {
    resetAllDemoData();
    setResetOpen(false);
    toast.info("Demo data reset", "Seed accounts and a clean question bank were restored.");
    router.push("/login");
  };

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Administration"
        title="Platform settings"
        description="Control the pass mark, site-wide notice and maintenance mode. These settings are stored with the demo database on this device."
        actions={
          <button type="button" onClick={save} className="btn-primary" disabled={busy || !dirty}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {busy ? "Saving…" : dirty ? "Save settings" : "Saved"}
          </button>
        }
      />

      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-xs text-rose-400"
        >
          {error}
        </p>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <div className="card p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Gauge className="h-4 w-4 text-brand-400" />
              Examination rules
            </h2>
            <p className="mt-0.5 text-[11px] text-muted">
              The pass mark is used to label results and compute pass rates. It does not change
              scoring.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="settings-passmark" className="label">
                  Pass mark (%)
                </label>
                <input
                  id="settings-passmark"
                  type="number"
                  min={0}
                  max={100}
                  className="input"
                  value={passMark}
                  onChange={(event) => {
                    setPassMark(Number(event.target.value));
                    markDirty();
                  }}
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={Number.isFinite(passMark) ? Math.min(100, Math.max(0, passMark)) : 50}
                  onChange={(event) => {
                    setPassMark(Number(event.target.value));
                    markDirty();
                  }}
                  aria-label="Pass mark slider"
                  className="mt-2 w-full accent-brand-500"
                />
              </div>
              <div>
                <p className="label">Maintenance mode</p>
                <button
                  type="button"
                  onClick={() => {
                    setMaintenance((value) => !value);
                    markDirty();
                  }}
                  aria-pressed={maintenance}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl border p-3 text-left transition",
                    maintenance
                      ? "border-amber-500/40 bg-amber-500/10"
                      : "border-line/15 bg-white/[0.02]"
                  )}
                >
                  <span>
                    <span className="block text-xs font-semibold text-ink">
                      {maintenance ? "Maintenance is on" : "Platform is open"}
                    </span>
                    <span className="mt-0.5 block text-[10px] leading-relaxed text-muted">
                      {maintenance
                        ? "Students see a maintenance banner across the app."
                        : "Students can use every practice and examination feature."}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "relative h-5 w-9 shrink-0 rounded-full transition",
                      maintenance ? "bg-amber-500" : "bg-line/30"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 h-4 w-4 rounded-full bg-white transition",
                        maintenance ? "left-[18px]" : "left-0.5"
                      )}
                    />
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="card p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Megaphone className="h-4 w-4 text-cyan-400" />
              Site-wide notice
            </h2>
            <p className="mt-0.5 text-[11px] text-muted">
              Shown on the student dashboard. Leave it empty to hide the notice.
            </p>
            <textarea
              value={siteNotice}
              onChange={(event) => {
                setSiteNotice(event.target.value);
                markDirty();
              }}
              maxLength={280}
              className="input mt-3 min-h-[90px] resize-y"
              placeholder="e.g. New chemistry questions added this week."
              aria-label="Site notice"
            />
            <p className="mt-1 text-right text-[10px] text-muted">{siteNotice.length}/280</p>
          </div>

          <div className="card p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Server className="h-4 w-4 text-violet-400" />
              Storage & environment
            </h2>
            <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
              This build runs in demo-first mode. Accounts, results and question overrides are saved
              in this browser&apos;s local storage. Supabase is prepared but not required.
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-line/10 bg-white/[0.02] p-3">
                <div>
                  <p className="text-xs font-semibold text-ink">Demo local store</p>
                  <p className="text-[10px] text-muted">Active · ppu.v1.db</p>
                </div>
                <Badge tone="success">In use</Badge>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-xl border border-line/10 bg-white/[0.02] p-3">
                <div>
                  <p className="text-xs font-semibold text-ink">Supabase</p>
                  <p className="text-[10px] text-muted">
                    {supabaseConfigured
                      ? "Credentials detected · demo store still active"
                      : "No credentials configured"}
                  </p>
                </div>
                <Badge tone="neutral">Prepared</Badge>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-xl border border-line/10 bg-white/[0.02] p-3">
                <div>
                  <p className="text-xs font-semibold text-ink">Server scoring</p>
                  <p className="text-[10px] text-muted">
                    Seed questions are validated by /api/exam/submit
                  </p>
                </div>
                <Badge tone="success">Ready</Badge>
              </div>
            </div>
            <p className="mt-3 flex items-start gap-1.5 text-[10px] leading-relaxed text-muted">
              <Lock className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />
              Service-role keys are never read in the browser. See .env.example and supabase/README.md
              for the production checklist.
            </p>
          </div>

          <div className="card border-rose-500/20 p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
              <AlertTriangle className="h-4 w-4 text-rose-400" />
              Danger zone
            </h2>
            <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
              Resetting removes every account except the two seed accounts, plus all results,
              practice, custom questions, reports, notes, bookmarks and settings on this device.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={exportBackup} className="btn-secondary text-xs">
                <Download className="h-3.5 w-3.5" />
                Download backup
              </button>
              <button
                type="button"
                onClick={() => setResetOpen(true)}
                className="btn-secondary text-xs text-rose-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Reset demo data
              </button>
            </div>
          </div>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
          <div className="card p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Database className="h-4 w-4 text-brand-400" />
              Data summary
            </p>
            <div className="mt-3 space-y-2.5">
              {summary.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center justify-between gap-2 text-xs">
                    <span className="flex items-center gap-1.5 text-muted">
                      <Icon className="h-3 w-3" />
                      {item.label}
                    </span>
                    <span className="font-bold text-ink">{item.value}</span>
                  </div>
                );
              })}
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-muted">Custom questions</span>
                <span className="font-bold text-ink">{db.customQuestions.length}</span>
              </div>
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-muted">Edited seeds</span>
                <span className="font-bold text-ink">{Object.keys(db.overrides).length}</span>
              </div>
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-muted">Open reports</span>
                <span className="font-bold text-ink">
                  {db.reports.filter((report) => report.status === "open").length}
                </span>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Settings className="h-4 w-4 text-cyan-400" />
              Quick links
            </p>
            <div className="mt-3 grid gap-2">
              {[
                { href: "/admin/questions", label: "Question bank" },
                { href: "/admin/import", label: "Bulk import" },
                { href: "/admin/students", label: "Students & access" },
                { href: "/admin/reports", label: "Question reports" }
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg border border-line/10 px-2.5 py-2 text-xs font-medium text-ink transition hover:border-brand-500/30 hover:bg-white/[0.03]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="card border-brand-500/20 p-5">
            <p className="flex items-center gap-2 text-xs font-semibold text-ink">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Configuration guidance
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted">
              Only <span className="font-mono text-[10px]">NEXT_PUBLIC_*</span> values reach the
              browser. Keep the Supabase service role key server-only and rotate it if it is ever
              exposed.
            </p>
            <button
              type="button"
              onClick={() => {
                setPassMark(settings.passMark);
                setSiteNotice(settings.siteNotice);
                setMaintenance(settings.maintenance);
                setDirty(false);
                setError(null);
                toast.info("Form restored", "Your unsaved changes were discarded.");
              }}
              className="btn-ghost mt-2 w-full text-[11px]"
              disabled={!dirty}
            >
              <RefreshCw className="h-3 w-3" />
              Discard unsaved changes
            </button>
          </div>

          <div className="card p-4">
            <p className="flex items-center gap-2 text-[11px] font-semibold text-ink">
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              Honest defaults
            </p>
            <p className="mt-1 text-[10px] leading-relaxed text-muted">
              There are no hidden analytics, seeded leaderboard scores or fake student accounts in
              this build. Every count on this page is derived from the local database.
            </p>
          </div>
        </aside>
      </div>

      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Reset all demo data?"
        description="Every account except the two seed accounts will be removed, along with all activity."
        footer={
          <>
            <button type="button" onClick={() => setResetOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmReset}
              className="btn-primary bg-gradient-to-r from-rose-500 to-rose-700"
            >
              <Trash2 className="h-4 w-4" />
              Reset everything
            </button>
          </>
        }
      >
        <div className="rounded-xl border border-rose-500/25 bg-rose-500/10 p-3 text-xs leading-relaxed text-rose-400">
          Download a backup first if you need to keep any results. This action cannot be undone, and
          you will be signed out.
        </div>
      </Modal>
    </div>
  );
}
