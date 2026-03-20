"use client";

import { motion } from "framer-motion";
import type { AppError } from "@/types";

interface ErrorDisplayProps {
  error: AppError;
  onRetry?: () => void;
  onDismiss?: () => void;
}

const KIND_CONFIG: Record<
  AppError["kind"],
  { label: string; colorClass: string; icon: React.ReactNode }
> = {
  network: {
    label: "Erreur de connexion",
    colorClass:
      "border-orange-200 dark:border-orange-500/20 bg-orange-50 dark:bg-orange-500/[0.05]",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="1" y1="1" x2="23" y2="23" />
        <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.56 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
      </svg>
    ),
  },
  api: {
    label: "Erreur du service",
    colorClass:
      "border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/[0.05]",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  parse: {
    label: "Erreur de réponse",
    colorClass:
      "border-yellow-200 dark:border-yellow-500/20 bg-yellow-50 dark:bg-yellow-500/[0.05]",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  validation: {
    label: "Entrée invalide",
    colorClass:
      "border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/[0.05]",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  unknown: {
    label: "Erreur inattendue",
    colorClass:
      "border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/[0.05]",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
};

export function ErrorDisplay({ error, onRetry, onDismiss }: ErrorDisplayProps) {
  const cfg = KIND_CONFIG[error.kind];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.25 }}
      className={`flex items-start gap-3.5 rounded-xl border px-4 py-4 ${cfg.colorClass}`}
    >
      <div className="mt-0.5 flex-shrink-0">{cfg.icon}</div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-0.5">
          {cfg.label}
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {error.message}
        </p>

        {(error.retryable || onDismiss) && (
          <div className="flex items-center gap-3 mt-3">
            {error.retryable && onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center gap-1.5 rounded-lg border border-current/20 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <RetryIcon />
                Réessayer
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                Ignorer
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function RetryIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4.43" />
    </svg>
  );
}
