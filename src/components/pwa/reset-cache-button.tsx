"use client";

import { RefreshCw } from "lucide-react";

export function ResetCacheButton() {
  return (
    <button
      type="button"
      onClick={() => {
        if ("serviceWorker" in navigator) {
          void navigator.serviceWorker
            .getRegistrations()
            .then((registrations) =>
              Promise.all(registrations.map((registration) => registration.unregister()))
            )
            .then(() => window.location.reload());
        } else {
          window.location.reload();
        }
      }}
      className="btn-ghost text-xs"
    >
      <RefreshCw className="h-3.5 w-3.5" />
      Reset offline cache
    </button>
  );
}
