"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import type { Task, Priority } from "@/types";

interface TaskCardProps {
  task: Task;
  index: number;
}

// ─── Per-priority visual tokens ───────────────────────────────────────────────

const PRIORITY_TOKENS: Record<
  Priority,
  {
    bar: string;
    glow: string;
    hoverBorder: string;
    indexBg: string;
    indexText: string;
    badgeBg: string;
    dotPulse: string;
    timeSlotColor: string;
  }
> = {
  high: {
    bar:            "bg-gradient-to-b from-red-400 to-red-600",
    glow:           "hover:shadow-[0_4px_24px_rgba(239,68,68,0.18)] dark:hover:shadow-[0_4px_24px_rgba(239,68,68,0.12)]",
    hoverBorder:    "hover:border-red-200 dark:hover:border-red-500/30",
    indexBg:        "bg-red-50 dark:bg-red-500/10",
    indexText:      "text-red-500 dark:text-red-400",
    badgeBg:        "bg-red-500/[0.06] dark:bg-red-500/[0.10]",
    dotPulse:       "bg-red-500",
    timeSlotColor:  "text-red-600 dark:text-red-400",
  },
  medium: {
    bar:            "bg-gradient-to-b from-amber-400 to-amber-500",
    glow:           "hover:shadow-[0_4px_24px_rgba(245,158,11,0.18)] dark:hover:shadow-[0_4px_24px_rgba(245,158,11,0.10)]",
    hoverBorder:    "hover:border-amber-200 dark:hover:border-amber-500/30",
    indexBg:        "bg-amber-50 dark:bg-amber-500/10",
    indexText:      "text-amber-600 dark:text-amber-400",
    badgeBg:        "bg-amber-500/[0.06] dark:bg-amber-500/[0.10]",
    dotPulse:       "bg-amber-500",
    timeSlotColor:  "text-amber-600 dark:text-amber-400",
  },
  low: {
    bar:            "bg-gradient-to-b from-green-400 to-green-600",
    glow:           "hover:shadow-[0_4px_24px_rgba(34,197,94,0.15)] dark:hover:shadow-[0_4px_24px_rgba(34,197,94,0.10)]",
    hoverBorder:    "hover:border-green-200 dark:hover:border-green-500/30",
    indexBg:        "bg-green-50 dark:bg-green-500/10",
    indexText:      "text-green-600 dark:text-green-400",
    badgeBg:        "bg-green-500/[0.06] dark:bg-green-500/[0.10]",
    dotPulse:       "bg-green-500",
    timeSlotColor:  "text-green-600 dark:text-green-400",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function TaskCard({ task, index }: TaskCardProps) {
  const [hovered, setHovered] = useState(false);
  const t = PRIORITY_TOKENS[task.priority];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.055,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{ y: -2 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={[
        "group relative overflow-hidden rounded-xl border border-gray-200/80 dark:border-white/[0.08]",
        "bg-white dark:bg-white/[0.03] cursor-default",
        "transition-all duration-200",
        t.glow,
        t.hoverBorder,
        "shadow-sm",
      ].join(" ")}
    >
      {/* ── Animated priority bar (left edge) ─────────────────────────── */}
      <motion.div
        className={`absolute left-0 top-0 w-[3px] rounded-l-xl ${t.bar}`}
        initial={{ height: "40%" }}
        animate={{ height: hovered ? "100%" : "40%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />

      {/* ── Subtle background wash on hover ───────────────────────────── */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className={`absolute inset-0 ${t.badgeBg} pointer-events-none`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* ── Card content ──────────────────────────────────────────────── */}
      <div className="relative pl-5 pr-4 py-3.5">
        <div className="flex items-start gap-3">

          {/* Step number */}
          <motion.span
            animate={hovered ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
            className={[
              "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md",
              "font-mono text-[10px] font-semibold transition-colors duration-200",
              hovered ? `${t.indexBg} ${t.indexText}` : "bg-gray-100 dark:bg-white/[0.06] text-gray-400 dark:text-gray-500",
            ].join(" ")}
          >
            {index + 1}
          </motion.span>

          <div className="flex flex-1 flex-col gap-1.5 min-w-0">

            {/* Title + Badge row */}
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white leading-snug flex-1 min-w-0 transition-colors duration-200">
                {task.title}
              </h3>
              <Badge priority={task.priority} />
            </div>

            {/* Time chips */}
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              <TimeChip
                icon={<ClockIcon />}
                label={task.suggestedTimeSlot}
                highlight={hovered}
                highlightClass={t.timeSlotColor}
              />
              <TimeChip
                icon={<TimerIcon />}
                label={task.estimatedTime}
                highlight={false}
                highlightClass=""
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TimeChip({
  icon,
  label,
  highlight,
  highlightClass,
}: {
  icon: React.ReactNode;
  label: string;
  highlight: boolean;
  highlightClass: string;
}) {
  return (
    <div
      className={[
        "flex items-center gap-1.5 font-mono text-[11px] transition-colors duration-200",
        highlight && highlightClass
          ? highlightClass
          : "text-gray-400 dark:text-gray-500",
      ].join(" ")}
    >
      <span>{icon}</span>
      {label}
    </div>
  );
}

function ClockIcon() {
  return (
    <svg
      width="11" height="11" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function TimerIcon() {
  return (
    <svg
      width="11" height="11" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}