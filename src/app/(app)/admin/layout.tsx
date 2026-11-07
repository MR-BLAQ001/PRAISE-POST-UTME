"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { PageLoader } from "@/components/ui/spinner";
import { useApp } from "@/components/providers/app-provider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { ready, user, isAdmin } = useApp();

  if (!ready) return <PageLoader label="Checking administrator access" />;

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-xl">
        <EmptyState
          icon={ShieldAlert}
          title="Administrator access required"
          description="This area manages the question bank, students, reports and platform settings. Sign in with an administrator account to continue."
          action={
            <Link href="/dashboard" className="btn-primary">
              Return to dashboard
            </Link>
          }
        />
      </div>
    );
  }

  return <>{children}</>;
}
