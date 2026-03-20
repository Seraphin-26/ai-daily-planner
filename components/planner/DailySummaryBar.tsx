"use client";

import { motion } from "framer-motion";
import type { DailySummary } from "@/types";

interface DailySummaryBarProps {
  summary: DailySummary;
  aiSummary: string;
}

// ─── Stat chip configs ────────────────────────────────────────────────────────

interface StatConfig {
  label: string;
  value: string | number;
  textColor: string;
  bgColor: string;
  borderColor: string;
  dotColor?: string;
  icon?: React.ReactNode;
  barWidth: number; // 0–100, used for the mini progress bar
  compact?: boolean; // shrinks font + padding for longer string values like "6h 30m"
}

// ─── Mini progress bar ────────────────────────────────────────────────────────

function MiniBar({ width, color }: { width: number; color: string }) {
  return (
    <div className="mt-2 h-[3px] w-full rounded-full bg-gray-100 dark:bg-white/[0.06] overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(4, width)}%` }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
      />
    </div>
  );
}

// ─── Stat chip ────────────────────────────────────────────────────────────────

function StatChip({
  config,
  delay,
}: {
  config: StatConfig;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      whileHover={{ y: -1 }}
      className={[
        "flex flex-col rounded-xl border transition-colors duration-200",
        "cursor-default select-none",
        config.compact ? "px-3 py-2.5" : "px-4 py-3",
        config.bgColor,
        config.borderColor,
      ].join(" ")}
    >
      {/* Top row: icon/dot + value */}
      <div className={`flex items-center gap-2 ${config.textColor}`}>
        {config.dotColor ? (
          <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-40 ${config.dotColor}`}
            />
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${config.dotColor}`}
            />
          </span>
        ) : (
          config.icon && (
            <span className="flex-shrink-0">{config.icon}</span>
          )
        )}
        <span className={config.compact ? "text-base font-bold tracking-tight leading-none" : "text-2xl font-bold tracking-tight leading-none"}>
          {config.value}
        </span>
      </div>

      {/* Label */}
      <span className="mt-1.5 text-[10px] font-mono font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500 leading-tight">
        {config.label}
      </span>

      {/* Mini bar */}
      <MiniBar width={config.barWidth} color={config.dotColor ?? "bg-indigo-400"} />
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DailySummaryBar({ summary, aiSummary }: DailySummaryBarProps) {
  const total = summary.totalTasks || 1; // avoid division by zero

  const stats: StatConfig[] = [
    {
      label: "Total tâches",
      value: summary.totalTasks,
      textColor: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50/60 dark:bg-indigo-500/[0.07]",
      borderColor: "border-indigo-100 dark:border-indigo-500/20",
      barWidth: 100,
      icon: (
        <svg
          width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      ),
    },
    {
      label: "Haute priorité",
      value: summary.highCount,
      textColor: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50/60 dark:bg-red-500/[0.07]",
      borderColor: "border-red-100 dark:border-red-500/20",
      dotColor: "bg-red-500",
      barWidth: Math.round((summary.highCount / total) * 100),
    },
    {
      label: "Moyenne priorité",
      value: summary.mediumCount,
      textColor: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50/60 dark:bg-amber-500/[0.07]",
      borderColor: "border-amber-100 dark:border-amber-500/20",
      dotColor: "bg-amber-500",
      barWidth: Math.round((summary.mediumCount / total) * 100),
    },
    {
      label: "Basse priorité",
      value: summary.lowCount,
      textColor: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50/60 dark:bg-green-500/[0.07]",
      borderColor: "border-green-100 dark:border-green-500/20",
      dotColor: "bg-green-500",
      barWidth: Math.round((summary.lowCount / total) * 100),
    },
    {
      label: "Temps total",
      value: summary.formattedTotal,
      textColor: "text-violet-600 dark:text-violet-400",
      bgColor: "bg-violet-50/60 dark:bg-violet-500/[0.07]",
      borderColor: "border-violet-100 dark:border-violet-500/20",
      barWidth: Math.min(100, Math.round((summary.totalMinutes / 480) * 100)),
      compact: true,
      icon: (
        <svg
          width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="rounded-2xl border border-gray-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl overflow-hidden shadow-sm dark:shadow-none"
    >
      {/* ── AI summary text ─────────────────────────────────────────────── */}
      <div className="relative flex items-start gap-3 px-5 py-4 border-b border-gray-100 dark:border-white/[0.06] overflow-hidden">
        {/* Subtle left gradient accent */}
        <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-indigo-400 to-violet-500" />

        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-500/20 mt-0.5">
          <svg
            width="13" height="13" viewBox="0 0 24 24"
            fill="none" stroke="#6366f1" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono">
              Résumé du jour
            </p>
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 dark:bg-indigo-500/15 px-2 py-0.5 text-[9px] font-medium text-indigo-600 dark:text-indigo-400">
              IA
            </span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {aiSummary}
          </p>
        </div>
      </div>

      {/* ── Stats grid ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 p-3">
        {stats.map((stat, i) => (
          <StatChip key={stat.label} config={stat} delay={0.05 + i * 0.06} />
        ))}
      </div>

      {/* ── Stacked priority bar (mobile: 2-col grid misses the visual) ── */}
      <div className="mx-3 mb-3 h-1.5 rounded-full overflow-hidden flex">
        {summary.highCount > 0 && (
          <motion.div
            className="bg-red-500 h-full"
            initial={{ width: 0 }}
            animate={{ width: `${(summary.highCount / total) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          />
        )}
        {summary.mediumCount > 0 && (
          <motion.div
            className="bg-amber-500 h-full"
            initial={{ width: 0 }}
            animate={{ width: `${(summary.mediumCount / total) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
          />
        )}
        {summary.lowCount > 0 && (
          <motion.div
            className="bg-green-500 h-full"
            initial={{ width: 0 }}
            animate={{ width: `${(summary.lowCount / total) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
          />
        )}
      </div>
    </motion.div>
  );
}