"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  LogOut,
  Mail,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  Trophy,
  UserRound
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { useApp } from "@/components/providers/app-provider";
import { useToast } from "@/components/providers/toast-provider";
import { RANKED_MODES } from "@/lib/exam";
import { buildLeaderboard } from "@/lib/leaderboard";
import { UNIVERSITIES } from "@/lib/universities";
import { SUBJECTS } from "@/lib/subjects";
import { cn, formatDate } from "@/lib/utils";
import { validateUsername } from "@/lib/auth-copy";

export default function ProfilePage() {
  const router = useRouter();
  const toast = useToast();
  const {
    user,
    db,
    userResults,
    isAdmin,
    updateProfile,
    logout,
    resetAllDemoData
  } = useApp();

  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [username, setUsername] = useState(user?.username ?? "");
  const [school, setSchool] = useState(user?.school ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [avatar, setAvatar] = useState(user?.avatar ?? "");
  const [universityId, setUniversityId] = useState(user?.universityId ?? "");
  const [preferredSubjects, setPreferredSubjects] = useState<string[]>(
    user?.preferredSubjects ?? []
  );
  const [optOut, setOptOut] = useState(user?.leaderboardOptOut ?? false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const board = useMemo(() => {
    if (!db || !user) return null;
    return buildLeaderboard({
      results: db.results,
      users: db.users.map(({ passwordHash: _hash, passwordSalt: _salt, ...profile }) => profile),
      currentUserId: user.id,
      limit: 1
    });
  }, [db, user]);

  if (!user) return null;

  const toggleSubject = (slug: string) => {
    setPreferredSubjects((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]
    );
    setSaved(false);
  };

  const handleSave = () => {
    setError(null);
    if (displayName.trim().length < 2) {
      setError("Your display name must be at least two characters.");
      return;
    }
    const usernameError = validateUsername(username);
    if (usernameError) {
      setError(usernameError);
      return;
    }
    if (!preferredSubjects.length) {
      setError("Choose at least one preferred subject.");
      return;
    }
    setBusy(true);
    const outcome = updateProfile({
      displayName: displayName.trim(),
      username: username.trim(),
      school: school.trim(),
      bio: bio.trim(),
      avatar: avatar.trim() || null,
      universityId: universityId || null,
      preferredSubjects,
      leaderboardOptOut: optOut
    });
    setBusy(false);
    if (outcome.ok) {
      toast.success("Profile updated", "Your changes are saved on this device.");
      setSaved(true);
    } else {
      setError(outcome.error ?? "Unable to save your profile.");
    }
  };

  const rankedCount = userResults.filter((result) => RANKED_MODES.includes(result.mode)).length;
  const average = userResults.length
    ? Math.round(userResults.reduce((sum, result) => sum + result.percentage, 0) / userResults.length)
    : 0;
  const university = UNIVERSITIES.find((item) => item.id === user.universityId);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Your account"
        title="Profile & preferences"
        description="Keep your details current. Your preferred subjects power personalisation across practice and analytics."
        actions={
          <button type="button" onClick={handleSave} className="btn-primary" disabled={busy}>
            <Save className="h-4 w-4" />
            {busy ? "Saving…" : saved ? "Saved" : "Save changes"}
          </button>
        }
      />

      {user.isGuest ? (
        <div className="card border-amber-500/25 bg-amber-500/[0.05] p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-amber-400">
            <AlertTriangle className="h-4 w-4" />
            You are using a guest session
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            Guest progress stays on this device and is excluded from leaderboards. Create a free
            account to keep your results when you return.
          </p>
          <Link href="/register" className="btn-primary mt-3 text-xs">
            Create free account
          </Link>
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <div className="card p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Avatar name={displayName || user.displayName} src={avatar || user.avatar} size="xl" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h2 className="text-lg font-bold text-ink">{displayName || user.displayName}</h2>
                  <Badge tone={isAdmin ? "gold" : "brand"}>{isAdmin ? "Administrator" : "Student"}</Badge>
                  {user.isGuest ? <Badge tone="warning">Guest</Badge> : null}
                </div>
                <p className="mt-0.5 text-xs text-muted">@{username || user.username}</p>
                <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted">
                  <Mail className="h-3 w-3" />
                  {user.email}
                </p>
                <p className="mt-0.5 text-[11px] text-muted">
                  Joined {formatDate(user.createdAt, { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="profile-name" className="label">
                  Display name
                </label>
                <input
                  id="profile-name"
                  className="input"
                  value={displayName}
                  onChange={(event) => {
                    setDisplayName(event.target.value);
                    setSaved(false);
                  }}
                  autoComplete="name"
                />
              </div>
              <div>
                <label htmlFor="profile-username" className="label">
                  Username
                </label>
                <input
                  id="profile-username"
                  className="input"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value);
                    setSaved(false);
                  }}
                  autoComplete="username"
                />
              </div>
              <div>
                <label htmlFor="profile-school" className="label">
                  School
                </label>
                <input
                  id="profile-school"
                  className="input"
                  value={school}
                  onChange={(event) => {
                    setSchool(event.target.value);
                    setSaved(false);
                  }}
                  placeholder="Your secondary school"
                />
              </div>
              <div>
                <label htmlFor="profile-avatar" className="label">
                  Avatar URL (optional)
                </label>
                <input
                  id="profile-avatar"
                  className="input"
                  value={avatar}
                  onChange={(event) => {
                    setAvatar(event.target.value);
                    setSaved(false);
                  }}
                  placeholder="https://…"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="profile-university" className="label">
                  Target university
                </label>
                <select
                  id="profile-university"
                  className="input"
                  value={universityId}
                  onChange={(event) => {
                    setUniversityId(event.target.value);
                    setSaved(false);
                  }}
                >
                  <option value="">No target yet</option>
                  {UNIVERSITIES.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.state})
                    </option>
                  ))}
                </select>
                {university ? (
                  <p className="mt-1.5 text-[11px] text-muted">
                    Your dashboard will feature {university.abbreviation}. Requirements change yearly —
                    verify on the official website.
                  </p>
                ) : null}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="profile-bio" className="label">
                  Short bio (optional)
                </label>
                <textarea
                  id="profile-bio"
                  className="input min-h-[90px] resize-y"
                  value={bio}
                  onChange={(event) => {
                    setBio(event.target.value);
                    setSaved(false);
                  }}
                  placeholder="What are you working towards?"
                  maxLength={240}
                />
                <p className="mt-1 text-right text-[10px] text-muted">{bio.length}/240</p>
              </div>
            </div>

            {error ? (
              <p role="alert" className="mt-3 rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-xs text-rose-400">
                {error}
              </p>
            ) : null}
          </div>

          <div className="card p-5 sm:p-6">
            <h2 className="text-sm font-semibold text-ink">Preferred subjects</h2>
            <p className="mt-0.5 text-[11px] text-muted">
              These subjects power quick practice, random challenges and your dashboard focus.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {SUBJECTS.map((subject) => {
                const selected = preferredSubjects.includes(subject.slug);
                return (
                  <button
                    key={subject.slug}
                    type="button"
                    onClick={() => toggleSubject(subject.slug)}
                    aria-pressed={selected}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[11px] font-medium transition",
                      selected
                        ? "border-brand-500/50 bg-brand-500/15 text-brand-300"
                        : "border-line/15 text-muted hover:border-line/30 hover:text-ink"
                    )}
                  >
                    {subject.shortName}
                  </button>
                );
              })}
            </div>

            <label className="mt-5 flex cursor-pointer items-start gap-2.5 rounded-xl border border-line/10 bg-white/[0.02] p-3">
              <input
                type="checkbox"
                checked={optOut}
                onChange={(event) => {
                  setOptOut(event.target.checked);
                  setSaved(false);
                }}
                className="mt-0.5 h-4 w-4 rounded border-line/30 bg-bg accent-brand-500"
              />
              <span className="text-[11px] leading-relaxed text-muted">
                Hide me from the public leaderboard. Your results and analytics remain available only
                to you.
              </span>
            </label>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="card p-5">
            <p className="text-sm font-semibold text-ink">At a glance</p>
            <div className="mt-3 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Average score</span>
                <span className="font-bold text-ink">{average}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Ranked CBTs</span>
                <span className="font-bold text-ink">{rankedCount}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Total attempts</span>
                <span className="font-bold text-ink">{userResults.length}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Leaderboard</span>
                <span className="font-bold text-ink">
                  {user.isGuest || optOut
                    ? "Hidden"
                    : board?.personal
                      ? `#${board.personal.rank}`
                      : "Unranked"}
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <Link href="/results" className="btn-secondary w-full text-xs">
                View my results
              </Link>
              <Link href="/achievements" className="btn-secondary w-full text-xs">
                <Trophy className="h-3.5 w-3.5" />
                My achievements
              </Link>
              {isAdmin ? (
                <Link href="/admin" className="btn-secondary w-full text-xs">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Admin dashboard
                </Link>
              ) : null}
            </div>
          </div>

          <div className="card p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Sparkles className="h-4 w-4 text-brand-400" />
              Personalisation
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted">
              Your preferred subjects ({preferredSubjects.length}) and target university shape the
              practice suggestions you see. Leaderboard opt-out is respected immediately.
            </p>
          </div>

          <div className="card border-rose-500/20 p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink">
              <AlertTriangle className="h-4 w-4 text-rose-400" />
              Account & data
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted">
              In demo mode, all data lives in this browser. Resetting removes every account, result,
              note and setting on this device.
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="btn-secondary w-full text-xs"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
              <button
                type="button"
                onClick={() => setResetOpen(true)}
                className="btn-ghost w-full text-xs text-rose-400 hover:text-rose-300"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Reset all demo data
              </button>
            </div>
          </div>
        </aside>
      </div>

      <div className="flex justify-end">
        <button type="button" onClick={handleSave} className="btn-primary" disabled={busy}>
          {busy ? null : saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {busy ? "Saving…" : saved ? "Changes saved" : "Save changes"}
        </button>
      </div>

      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Reset all demo data?"
        description="Every account, result, note, bookmark and setting on this device will be erased and the demo accounts restored."
        footer={
          <>
            <button type="button" onClick={() => setResetOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button
              type="button"
              className="btn-primary bg-gradient-to-r from-rose-500 to-rose-700"
              onClick={() => {
                resetAllDemoData();
                setResetOpen(false);
                toast.info("Demo reset", "The demo accounts and fresh data are ready.");
                router.push("/login");
              }}
            >
              <Trash2 className="h-4 w-4" />
              Reset everything
            </button>
          </>
        }
      >
        <p className="flex items-start gap-2 rounded-xl border border-rose-500/25 bg-rose-500/10 p-3 text-xs leading-relaxed text-rose-400">
          <UserRound className="mt-0.5 h-4 w-4 shrink-0" />
          This action cannot be undone. Export any results you want to keep first.
        </p>
      </Modal>
    </div>
  );
}
