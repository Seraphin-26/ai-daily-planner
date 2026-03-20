import { cn } from "@/lib/utils";
import type { Priority } from "@/types";

interface BadgeProps {
  priority: Priority;
  className?: string;
}

export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; labelFr: string; classes: string; dot: string; icon: string; bg: string; border: string }
> = {
  high: {
    label: "High",
    labelFr: "Haute",
    icon: "↑↑",
    dot: "bg-red-500",
    bg: "bg-red-500",
    border: "border-red-500/30",
    classes:
      "bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-400 ring-1 ring-red-500/25",
  },
  medium: {
    label: "Medium",
    labelFr: "Moyenne",
    icon: "↑",
    dot: "bg-amber-500",
    bg: "bg-amber-500",
    border: "border-amber-500/30",
    classes:
      "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400 ring-1 ring-amber-500/25",
  },
  low: {
    label: "Low",
    labelFr: "Basse",
    icon: "→",
    dot: "bg-green-500",
    bg: "bg-green-500",
    border: "border-green-500/30",
    classes:
      "bg-green-500/10 text-green-600 dark:bg-green-500/15 dark:text-green-400 ring-1 ring-green-500/25",
  },
};

export function Badge({ priority, className }: BadgeProps) {
  const { labelFr, icon, classes } = PRIORITY_CONFIG[priority];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider",
        classes,
        className
      )}
    >
      <span>{icon}</span>
      {labelFr}
    </span>
  );
}
