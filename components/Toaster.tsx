import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

// Simple, dependency-free toaster for React + TypeScript + Tailwind
// Exports:
// - default: ToasterProvider (wrap your app)
// - useToaster() hook to toast toasts

export type ToastVariant = "info" | "success" | "error" | "warning";

export type Toast = {
  id: string;
  title?: string;
  message: string;
  variant?: ToastVariant;
  duration?: number; // ms
};

export enum TOASTER_VARIANTS {
    SUCCESS = "success",
    INFO = "info",
    ERROR = "error",
    WARNING = "warning"
}

type ContextApi = {
  toast: (t: Omit<Toast, "id">) => string;
  remove: (id: string) => void;
};

const ToasterContext = createContext<ContextApi | null>(null);

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

// small helpers for styling based on variant
const variantClasses: Record<ToastVariant, string> = {
  info: "bg-blue-50 border-blue-200 text-blue-800",
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
};

export const ToasterProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((t: Omit<Toast, "id">) => {
    const id = genId();
    const toast: Toast = { id, ...t };
    setToasts((s) => [toast, ...s]); // newest on top
    return id;
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((s) => s.filter((x) => x.id !== id));
  }, []);

  return (
    <ToasterContext.Provider value={{ toast, remove }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={remove} />
    </ToasterContext.Provider>
  );
};

export default ToasterProvider;

export const useToaster = () => {
  const ctx = useContext(ToasterContext);
  if (!ctx) throw new Error("useToaster must be used within ToasterProvider");
  return ctx;
};

// ToastContainer: positioned top-right
const ToastContainer: React.FC<{ toasts: Toast[]; onRemove: (id: string) => void }> = ({ toasts, onRemove }) => {
  return (
    <div
      aria-live="polite"
      className="fixed top-4 right-4 z-50 flex w-auto max-w-xs flex-col gap-3 p-2 sm:top-6 sm:right-6"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  const { id, title, message, variant = "info", duration = 4000 } = toast;
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<number | null>(null);
  const hoverRef = useRef(false);

  useEffect(() => {
    // auto-dismiss
    if (duration > 0) {
      timerRef.current = window.setTimeout(() => {
        setVisible(false);
        // delay removal until animation finished
        window.setTimeout(() => onRemove(id), 300);
      }, duration);
    }

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [duration, id, onRemove]);

  const handleMouseEnter = () => {
    hoverRef.current = true;
    if (timerRef.current) window.clearTimeout(timerRef.current);
  };
  const handleMouseLeave = () => {
    hoverRef.current = false;
    if (duration > 0) {
      timerRef.current = window.setTimeout(() => {
        setVisible(false);
        window.setTimeout(() => onRemove(id), 300);
      }, 1200); // short after leaving
    }
  };

  const handleClose = () => {
    setVisible(false);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    window.setTimeout(() => onRemove(id), 300);
  };

  return (
    <div
      role="status"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`transform transition-all duration-300 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      <div
        className={`w-80 rounded-lg border p-3 shadow-sm ${variantClasses[variant as ToastVariant]} flex items-start gap-3`}
      >
        <div className="flex-1">
          {title && <div className="font-semibold text-sm">{title}</div>}
          <div className="text-sm leading-tight">{message}</div>
        </div>

        <button
          aria-label="Close notification"
          onClick={handleClose}
          className="ml-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-transparent bg-white/30 text-sm backdrop-blur-sm hover:bg-white/40"
        >
          ×
        </button>
      </div>
    </div>
  );
};
