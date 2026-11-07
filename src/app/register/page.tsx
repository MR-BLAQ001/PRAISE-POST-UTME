"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, Eye, EyeOff, Loader2, Lock, Mail, School, UserRound } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { useApp } from "@/components/providers/app-provider";
import { useToast } from "@/components/providers/toast-provider";
import { SUBJECTS } from "@/lib/subjects";
import { PASSWORD_RULES, validateEmail, validatePassword, validateUsername } from "@/lib/auth-copy";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const toast = useToast();
  const { ready, user, register } = useApp();

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [preferredSubjects, setPreferredSubjects] = useState<string[]>([
    "english-language",
    "mathematics",
    "biology"
  ]);
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ready && user) router.replace("/dashboard");
  }, [ready, user, router]);

  const toggleSubject = (slug: string) => {
    setPreferredSubjects((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (displayName.trim().length < 2) {
      setError("Enter your full name (at least two characters).");
      return;
    }
    const usernameError = validateUsername(username);
    if (usernameError) {
      setError(usernameError);
      return;
    }
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (password !== confirm) {
      setError("The two passwords do not match.");
      return;
    }
    if (!preferredSubjects.length) {
      setError("Choose at least one preferred subject.");
      return;
    }
    if (!accepted) {
      setError("Please confirm that you understand this is an independent practice platform.");
      return;
    }

    setBusy(true);
    const result = await register({
      displayName: displayName.trim(),
      username: username.trim(),
      email: email.trim(),
      password,
      school: school.trim(),
      preferredSubjects
    });
    if (!result.ok) {
      setError(result.error ?? "Unable to create your account.");
      setBusy(false);
      return;
    }
    toast.success("Account created", "Your dashboard is ready. Start with a quick practice.");
    router.replace("/dashboard");
  };

  return (
    <AuthLayout
      eyebrow="Create your account"
      title="Start your preparation properly"
      description="Free, local and private. Your results and notes stay on this device in demo mode."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-400 hover:text-brand-300">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error ? (
          <p
            role="alert"
            className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-3.5 py-2.5 text-xs leading-relaxed text-rose-400"
          >
            {error}
          </p>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="displayName" className="label">
              Full name
            </label>
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                id="displayName"
                className="input pl-9"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Chidera Okonkwo"
                autoComplete="name"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="username" className="label">
              Username
            </label>
            <input
              id="username"
              className="input"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="chidera_2026"
              autoComplete="username"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="label">
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="email"
              type="email"
              className="input pl-9"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="school" className="label">
            School (optional)
          </label>
          <div className="relative">
            <School className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="school"
              className="input pl-9"
              value={school}
              onChange={(event) => setSchool(event.target.value)}
              placeholder="Your secondary school"
              autoComplete="organization"
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="password" className="label">
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="input pl-9 pr-10"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted hover:text-ink"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="confirm" className="label">
              Confirm password
            </label>
            <input
              id="confirm"
              type={showPassword ? "text" : "password"}
              className="input"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              placeholder="Repeat password"
              autoComplete="new-password"
              required
            />
          </div>
        </div>

        <div className="rounded-xl border border-line/10 bg-white/[0.02] p-3">
          <p className="text-[11px] font-medium text-muted">Password must include:</p>
          <ul className="mt-2 grid gap-1 sm:grid-cols-3">
            {PASSWORD_RULES.map((rule) => {
              const satisfied =
                rule.startsWith("At least 8")
                  ? password.length >= 8
                  : rule.includes("letter")
                    ? /[A-Za-z]/.test(password)
                    : /[0-9]/.test(password);
              return (
                <li
                  key={rule}
                  className={cn(
                    "flex items-center gap-1.5 text-[11px]",
                    satisfied ? "text-emerald-400" : "text-muted"
                  )}
                >
                  <Check className={cn("h-3 w-3", satisfied ? "opacity-100" : "opacity-30")} />
                  {rule}
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <p className="label">Preferred subjects</p>
          <p className="-mt-1 mb-2 text-[11px] text-muted">
            Choose English plus the subjects you plan to write. You can change this later.
          </p>
          <div className="flex flex-wrap gap-1.5">
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
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-line/10 bg-white/[0.02] p-3">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-line/30 bg-bg accent-brand-500"
          />
          <span className="text-[11px] leading-relaxed text-muted">
            I understand this is an independent practice platform, not the official POST-UTME, and
            that I should verify admission details with my university.
          </span>
        </label>

        <button type="submit" className="btn-primary w-full" disabled={busy}>
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Creating your account…
            </>
          ) : (
            "Create free account"
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
