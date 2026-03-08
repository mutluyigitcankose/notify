"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type ToastType = "error" | "success" | "info";

type ToastContextValue = {
  toast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  return ctx?.toast ?? (() => {});
}

export function ToasterProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<ToastType>("info");

  const toast = useCallback((msg: string, t: ToastType = "info") => {
    setMessage(msg);
    setType(t);
    const id = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(id);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {message ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl border border-black/10 bg-[var(--card)] px-4 py-3 shadow-lg dark:border-white/10"
        >
          <p
            className={
              type === "error"
                ? "text-sm font-medium text-red-600 dark:text-red-400"
                : type === "success"
                  ? "text-sm font-medium text-green-700 dark:text-green-400"
                  : "text-sm text-[var(--foreground)]"
            }
          >
            {message}
          </p>
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}
