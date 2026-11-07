"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogIn,
  ShieldCheck,
  Sparkles,
  UserRound
} from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { useApp } from "@/components/providers/app-provider";
import { useToast } from "@/components/providers/toast-provider";
import { DEMO_CREDENTIALS } from "@/lib/auth-copy";

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const { ready, user, login, loginAsDemo, enterGuest } = useApp();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState<"form" | "student" | "admin" | "guest" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [next, setNext] = useState("/dashboard");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("next");
    if (requested && requested.startsWith("/") && !requested.startsWith("//")) {
      setNext(requested);
    }
  }, []);

  useEffect(() => {
    if (ready && user) router.replace(next);
  }, [ready, user, next, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!identifier.trim() || !password) {
      setError("Enter your email or username and your password.");
      return;
    }
    setBusy("form");
    const result = await login(identifier, password);
    if (!result.ok) {
      setError(result.error ?? "Unable to sign in.");
      setBusy(null);
      return;
    }
    toast.success("Welcome back", "Your dashboard is ready.");
    router.replace(next);
  };

  const handleDemo = async (kind: "student" | "admin") => {
    setError(null);
    setBusy(kind);
    const result = await loginAsDemo(kind);
    if (!result.ok) {
      setError(result.error ?? "Demo sign-in failed.");
      setBusy(null);
      return;
    }
    toast.success(
      kind === "admin" ? "Administrator demo" : "Student demo",
      "Explore every feature with sample access."
    );
    router.replace(kind === "admin" ? "/admin" : "/dashboard");
  };

  const handleGuest = async () => {
    setError(null);
    setBusy("guest");
    const result = await enterGuest();
    if (!result.ok) {
      setError(result.error ?? "Guest session failed.");
      setBusy(null);
      return;
    }
    toast.info("Guest session started", "Your results stay on this device only.");
    router.replace("/dashboard");
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to continue"
      description="Pick up your practice streak, review your last attempt or start a fresh simulation."
      footer={
        <>
          New here?{" "}
          <Link href="/register" className="font-semibold text-brand-400 hover:text-brand-300">
            Create a free account
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

        <div>
          <label htmlFor="identifier" className="label">
            Email or username
          </label>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="identifier"
              name="identifier"
              type="text"
              autoComplete="username"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              className="input pl-9"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="label">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="mb-1.5 text-[11px] font-medium text-brand-400 hover:text-brand-300"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="input pl-9 pr-10"
              placeholder="Your password"
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

        <button type="submit" className="btn-primary w-full" disabled={busy !== null}>
          {busy === "form" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" /> Sign in
            </>
          )}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-line/15" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
          Or try the demo
        </span>
        <span className="h-px flex-1 bg-line/15" />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => void handleDemo("student")}
          disabled={busy !== null}
          className="btn-secondary text-xs"
        >
          {busy === "student" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 text-brand-400" />
          )}
          Student demo
        </button>
        <button
          type="button"
          onClick={() => void handleDemo("admin")}
          disabled={busy !== null}
          className="btn-secondary text-xs"
        >
          {busy === "admin" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          )}
          Admin demo
        </button>
      </div>

      <details className="mt-3 rounded-xl border border-line/10 bg-white/[0.02] px-3.5 py-2.5 text-[11px] text-muted">
        <summary className="cursor-pointer font-medium text-ink">Demo account details</summary>
        <div className="mt-2 space-y-1 font-mono text-[11px]">
          <p>Student: {DEMO_CREDENTIALS.student.email} / {DEMO_CREDENTIALS.student.password}</p>
          <p>Admin: {DEMO_CREDENTIALS.admin.email} / {DEMO_CREDENTIALS.admin.password}</p>
        </div>
      </details>

      <button
        type="button"
        onClick={() => void handleGuest()}
        disabled={busy !== null}
        className="mt-3 flex w-full items-center justify-center gap-1.5 text-xs font-medium text-muted transition hover:text-ink"
      >
        {busy === "guest" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
        Continue as a guest
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </AuthLayout>
  );
}
