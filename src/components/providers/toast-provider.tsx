"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, Info, TriangleAlert, X, XCircle } from "lucide-react";
import { cn, uid } from "@/lib/utils";

type ToastTone = "success" | "error" | "info" | "warning";

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
}

interface ToastContextValue {
  toast: (input: { title: string; description?: string; tone?: ToastTone }) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TONE_STYLES: Record<ToastTone, { icon: typeof Info; ring: string; iconColor: string }> = {
  success: {
    icon: CheckCircle2,
    ring: "border-emerald-500/30",
    iconColor: "text-emerald-400"
  },
  error: {
    icon: XCircle,
    ring: "border-rose-500/30",
    iconColor: "text-rose-400"
  },
  info: {
    icon: Info,
    ring: "border-brand-500/30",
    iconColor: "text-brand-400"
  },
  warning: {
    icon: TriangleAlert,
    ring: "border-amber-500/30",
    iconColor: "text-amber-400"
  }
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    setMounted(true);
    const activeTimers = timers.current;
    return () => {
      activeTimers.forEach((timer) => clearTimeout(timer));
      activeTimers.clear();
    };
  }, []);

  const dismiss = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (input: { title: string; description?: string; tone?: ToastTone }) => {
      const item: ToastItem = {
        id: uid("toast"),
        title: input.title,
        description: input.description,
        tone: input.tone ?? "info"
      };
      setItems((current) => [...current.slice(-3), item]);
      const timer = setTimeout(() => {
        setItems((current) => current.filter((entry) => entry.id !== item.id));
        timers.current.delete(item.id);
      }, 4500);
      timers.current.set(item.id, timer);
    },
    []
  );

  const success = useCallback(
    (title: string, description?: string) => toast({ title, description, tone: "success" }),
    [toast]
  );
  const error = useCallback(
    (title: string, description?: string) => toast({ title, description, tone: "error" }),
    [toast]
  );
  const info = useCallback(
    (title: string, description?: string) => toast({ title, description, tone: "info" }),
    [toast]
  );

  const value = useMemo(
    () => ({ toast, success, error, info, dismiss }),
    [toast, success, error, info, dismiss]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted
        ? createPortal(
            <div
              aria-live="polite"
              aria-label="Notifications"
              className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:items-end sm:px-6"
            >
              {items.map((item) => {
                const tone = TONE_STYLES[item.tone];
                const Icon = tone.icon;
                return (
                  <div
                    key={item.id}
                    role="status"
                    className={cn(
                      "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border bg-card/95 p-3.5 shadow-card backdrop-blur-xl animate-fade-up",
                      tone.ring
                    )}
                  >
                    <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", tone.iconColor)} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-ink">{item.title}</p>
                      {item.description ? (
                        <p className="mt-0.5 text-xs leading-relaxed text-muted">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      aria-label="Dismiss notification"
                      onClick={() => dismiss(item.id)}
                      className="rounded-lg p-1 text-muted transition hover:bg-white/10 hover:text-ink"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>,
            document.body
          )
        : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
