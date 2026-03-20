// ─── Domain types ─────────────────────────────────────────────────────────────

export type Priority = "high" | "medium" | "low";

export interface Task {
  title: string;
  priority: Priority;
  estimatedTime: string;
  suggestedTimeSlot: string;
}

export interface DailySummary {
  totalTasks: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  totalMinutes: number;
  formattedTotal: string;
}

export interface PlanResponse {
  tasks: Task[];
  summary: string;
}

export interface PlanExportJSON {
  generatedAt: string;
  summary: string;
  dailySummary: DailySummary;
  tasks: Task[];
}

// ─── API types ────────────────────────────────────────────────────────────────

export interface APIResponse {
  success: boolean;
  plan: PlanResponse;
  error?: string;
}

// ─── History types ────────────────────────────────────────────────────────────

export interface HistoryEntry {
  id: string;
  createdAt: string;
  inputSummary: string;
  plan: PlanResponse;
}

// ─── Error types ──────────────────────────────────────────────────────────────

export type ErrorKind =
  | "network"
  | "api"
  | "parse"
  | "validation"
  | "unknown";

export interface AppError {
  kind: ErrorKind;
  message: string;
  retryable: boolean;
}
