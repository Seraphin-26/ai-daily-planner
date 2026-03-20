"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { PlanResponse, AppError } from "@/types";
import { computeDailySummary } from "@/lib/planUtils";
import { TaskCard } from "@/components/planner/TaskCard";
import { ResultSkeleton } from "@/components/planner/ResultSkeleton";
import { EmptyState } from "@/components/planner/States";
import { ErrorDisplay } from "@/components/planner/ErrorDisplay";
import { ExportBar } from "@/components/planner/ExportBar";
import { DailySummaryBar } from "@/components/planner/DailySummaryBar";
import { PRIORITY_CONFIG } from "@/components/ui/Badge";

interface ResultPanelProps {
  plan: PlanResponse | null;
  isLoading: boolean;
  error: AppError | null;
  onClear: () => void;
  onRetry: () => void;
  onDismissError: () => void;
  generatedAt?: string;
}

export function ResultPanel({
  plan,
  isLoading,
  error,
  onClear,
  onRetry,
  onDismissError,
  generatedAt,
}: ResultPanelProps) {
  const dailySummary = plan ? computeDailySummary(plan) : null;

  const generatedTime = generatedAt
    ? new Date(generatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      className="flex flex-col gap-4"
    >
      {/* Panel header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Plan généré
          </h2>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            {plan
              ? `${plan.tasks.length} tâches · organisées par IA`
              : "En attente de vos tâches"}
          </p>
        </div>
      </div>

      {/* Export bar */}
      <AnimatePresence>
        {plan && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <ExportBar plan={plan} generatedAt={generatedAt} onClear={onClear} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Body */}
      <div className="flex flex-col gap-3">
        {isLoading && <ResultSkeleton />}

        <AnimatePresence>
          {!isLoading && error && (
            <ErrorDisplay
              error={error}
              onRetry={error.retryable ? onRetry : undefined}
              onDismiss={onDismissError}
            />
          )}
        </AnimatePresence>

        {!isLoading && !plan && !error && <EmptyState />}

        <AnimatePresence>
          {!isLoading && plan && dailySummary && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-3"
            >
              {/* Daily summary bar */}
              <DailySummaryBar summary={dailySummary} aiSummary={plan.summary} />

              {/* Priority strip */}
              <div className="flex flex-wrap gap-2">
                {(["high", "medium", "low"] as const).map((p) => (
                  <div
                    key={p}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium ${PRIORITY_CONFIG[p].classes}`}
                  >
                    <div className={`h-1.5 w-1.5 rounded-full ${PRIORITY_CONFIG[p].dot}`} />
                    {dailySummary[p === "high" ? "highCount" : p === "medium" ? "mediumCount" : "lowCount"]}{" "}
                    {PRIORITY_CONFIG[p].labelFr}
                  </div>
                ))}
              </div>

              {/* Task list */}
              <div className="flex flex-col gap-2">
                {plan.tasks.map((task, i) => (
                  <TaskCard key={i} task={task} index={i} />
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-white/[0.02] px-4 py-2.5">
                <span className="font-mono text-[10px] text-gray-400 dark:text-gray-600">
                  {generatedTime ? `Généré à ${generatedTime}` : "Vient d'être généré"}
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="font-mono text-[10px] text-gray-400 dark:text-gray-600">
                    llama-3.3-70b
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
