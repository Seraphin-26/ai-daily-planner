"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import type { HistoryEntry, PlanResponse } from "@/types";

interface HistoryPanelProps {
  entries: HistoryEntry[];
  onRestore: (plan: PlanResponse) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

export function HistoryPanel({
  entries,
  onRestore,
  onRemove,
  onClearAll,
}: HistoryPanelProps) {
  const [open, setOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  function handleClearAll() {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
      return;
    }
    onClearAll();
    setConfirmClear(false);
    setOpen(false);
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen((v) => !v)}
        leftIcon={<HistoryIcon />}
        rightIcon={
          entries.length > 0 ? (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
              {entries.length}
            </span>
          ) : undefined
        }
      >
        Historique
      </Button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute right-0 top-full z-40 mt-2 w-80 sm:w-96 rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl shadow-xl dark:shadow-black/40 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/[0.06] px-4 py-3">
                <div className="flex items-center gap-2">
                  <HistoryIcon className="text-indigo-500" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    Historique des plans
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {entries.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                        confirmClear
                          ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
                          : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      }`}
                    >
                      {confirmClear ? "Confirmer" : "Tout effacer"}
                    </button>
                  )}
                  <button
                    onClick={() => setOpen(false)}
                    className="flex h-6 w-6 items-center justify-center rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors"
                  >
                    <CloseIcon />
                  </button>
                </div>
              </div>

              {/* List */}
              <div className="max-h-[400px] overflow-y-auto overscroll-contain">
                {entries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                    <EmptyHistoryIcon />
                    <p className="text-sm text-gray-400 dark:text-gray-600">
                      Aucun plan sauvegardé
                    </p>
                    <p className="text-xs text-gray-300 dark:text-gray-700">
                      Les plans générés sont sauvegardés automatiquement
                    </p>
                  </div>
                ) : (
                  <ul className="p-2 space-y-1">
                    <AnimatePresence initial={false}>
                      {entries.map((entry) => (
                        <motion.li
                          key={entry.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <HistoryRow
                            entry={entry}
                            onRestore={() => {
                              onRestore(entry.plan);
                              setOpen(false);
                            }}
                            onRemove={() => onRemove(entry.id)}
                          />
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── History row ──────────────────────────────────────────────────────────────

function HistoryRow({
  entry,
  onRestore,
  onRemove,
}: {
  entry: HistoryEntry;
  onRestore: () => void;
  onRemove: () => void;
}) {
  const date = new Date(entry.createdAt);
  const timeLabel = date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateLabel = date.toLocaleDateString("fr-FR", {
    month: "short",
    day: "numeric",
  });

  const dots = {
    high: entry.plan.tasks.filter((t) => t.priority === "high").length,
    medium: entry.plan.tasks.filter((t) => t.priority === "medium").length,
    low: entry.plan.tasks.filter((t) => t.priority === "low").length,
  };

  return (
    <div className="group flex items-start gap-3 rounded-xl px-3 py-3 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors">
      {/* Timestamp */}
      <div className="flex flex-col items-center justify-center rounded-lg border border-gray-100 dark:border-white/[0.07] bg-gray-50 dark:bg-white/[0.03] px-2.5 py-1.5 min-w-[46px]">
        <span className="font-mono text-[10px] font-medium text-gray-500 dark:text-gray-400 leading-none">
          {timeLabel}
        </span>
        <span className="font-mono text-[9px] text-gray-300 dark:text-gray-600 mt-0.5">
          {dateLabel}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate leading-snug">
          {entry.inputSummary}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400 dark:text-gray-600">
            {entry.plan.tasks.length} tâche{entry.plan.tasks.length !== 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-1">
            {dots.high > 0 && (
              <span className="flex items-center gap-0.5 text-[10px] text-red-500">
                <div className="h-1.5 w-1.5 rounded-full bg-red-500" />{dots.high}
              </span>
            )}
            {dots.medium > 0 && (
              <span className="flex items-center gap-0.5 text-[10px] text-amber-500">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />{dots.medium}
              </span>
            )}
            {dots.low > 0 && (
              <span className="flex items-center gap-0.5 text-[10px] text-green-500">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500" />{dots.low}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onRestore}
          title="Restaurer ce plan"
          className="flex h-6 w-6 items-center justify-center rounded-md text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
        >
          <RestoreIcon />
        </button>
        <button
          onClick={onRemove}
          title="Supprimer cette entrée"
          className="flex h-6 w-6 items-center justify-center rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-4.43" />
      <polyline points="12 7 12 12 16 14" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function RestoreIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4.43" />
    </svg>
  );
}
function DeleteIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    </svg>
  );
}
function EmptyHistoryIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-200 dark:text-gray-800">
      <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4.43" /><polyline points="12 7 12 12 16 14" />
    </svg>
  );
}
