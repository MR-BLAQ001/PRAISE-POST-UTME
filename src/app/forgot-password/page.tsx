"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, Mail } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { useApp } from "@/components/providers/app-provider";
import { validateEmail } from "@/lib/auth-copy";

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useApp();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }
    setBusy(true);
    const result = await requestPasswordReset(email);
    setBusy(false);
    if (!result.ok) {
      setError(result.error ?? "Unable to find that account.");
      return;
    }
    setSent(true);
  };

  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Reset your password"
      description="Enter the email on your account and we will start the reset process."
      footer={
        <>
          Remembered it?{" "}
          <Link href="/login" className="font-semibold text-brand-400 hover:text-brand-300">
            Back to sign in
          </Link>
        </>
      }
    >
      {sent ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              Account found
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">
              In this demo, password resets happen locally — no email is sent. Continue to set a
              new password for <span className="font-medium text-ink">{email}</span>.
            </p>
          </div>
          <Link
            href={`/reset-password?email=${encodeURIComponent(email)}`}
            className="btn-primary w-full"
          >
            Set a new password
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="rounded-xl border border-line/10 bg-white/[0.02] p-3 text-[11px] leading-relaxed text-muted">
            In a production Supabase deployment, this step sends a secure, time-limited recovery
            link to the student&apos;s inbox instead.
          </p>
        </div>
      ) : (
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
          <button type="submit" className="btn-primary w-full" disabled={busy}>
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Checking…
              </>
            ) : (
              "Continue"
            )}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
