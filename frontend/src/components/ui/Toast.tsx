"use client";
import { create } from "zustand";
import { useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastState {
  toasts: Toast[];
  add: (type: ToastType, message: string) => void;
  remove: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  add: (type, message) => {
    const id = Math.random().toString(36).slice(2);
    set((s) => ({ toasts: [...s.toasts, { id, type, message }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3500);
  },
  remove: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

/** Convenience helpers */
export const toast = {
  success: (msg: string) => useToastStore.getState().add("success", msg),
  error: (msg: string) => useToastStore.getState().add("error", msg),
  warning: (msg: string) => useToastStore.getState().add("warning", msg),
  info: (msg: string) => useToastStore.getState().add("info", msg),
};

const icons = {
  success: <CheckCircle className="h-5 w-5 text-green-500" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
  warning: <AlertCircle className="h-5 w-5 text-amber-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
};

const styles = {
  success: "border-l-4 border-green-500 bg-white dark:bg-gray-800",
  error: "border-l-4 border-red-500 bg-white dark:bg-gray-800",
  warning: "border-l-4 border-amber-500 bg-white dark:bg-gray-800",
  info: "border-l-4 border-blue-500 bg-white dark:bg-gray-800",
};

export function ToastContainer() {
  const { toasts, remove } = useToastStore();
  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="alert"
          className={cn(
            "flex items-start gap-3 rounded-xl p-4 shadow-lg",
            styles[t.type]
          )}
        >
          {icons[t.type]}
          <p className="flex-1 text-sm text-gray-800 dark:text-gray-100">{t.message}</p>
          <button
            onClick={() => remove(t.id)}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
