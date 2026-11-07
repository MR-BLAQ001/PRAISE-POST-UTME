"use client";

import { RefreshCw, Wifi } from "lucide-react";

export function OfflineActions() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="btn-primary text-xs"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Try again
      </button>
      <button
        type="button"
        onClick={() => {
          window.location.href = "/dashboard";
        }}
        className="btn-secondary text-xs"
      >
        <Wifi className="h-3.5 w-3.5" />
        Open dashboard
      </button>
    </div>
  );
}
