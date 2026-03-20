import type { PlanResponse, DailySummary, PlanExportJSON } from "@/types";

// ─── Parse duration string to minutes ────────────────────────────────────────

function parseDurationToMinutes(duration: string): number {
  const lower = duration.toLowerCase();
  let total = 0;
  const hoursMatch = lower.match(/(\d+(?:\.\d+)?)\s*h(?:eure|eures|r|rs)?/);
  const minsMatch = lower.match(/(\d+)\s*m(?:in|ins|inute|inutes)?/);
  if (hoursMatch) total += parseFloat(hoursMatch[1]) * 60;
  if (minsMatch) total += parseInt(minsMatch[1]);
  if (total === 0) {
    const soloNumber = lower.match(/^(\d+)$/);
    if (soloNumber) total = parseInt(soloNumber[1]);
  }
  return total;
}

function formatMinutes(mins: number): string {
  if (mins <= 0) return "—";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

// ─── Compute daily summary ────────────────────────────────────────────────────

export function computeDailySummary(plan: PlanResponse): DailySummary {
  const highCount = plan.tasks.filter((t) => t.priority === "high").length;
  const mediumCount = plan.tasks.filter((t) => t.priority === "medium").length;
  const lowCount = plan.tasks.filter((t) => t.priority === "low").length;
  const totalMinutes = plan.tasks.reduce(
    (acc, t) => acc + parseDurationToMinutes(t.estimatedTime),
    0
  );
  return {
    totalTasks: plan.tasks.length,
    highCount,
    mediumCount,
    lowCount,
    totalMinutes,
    formattedTotal: formatMinutes(totalMinutes),
  };
}

// ─── Format as plain text ─────────────────────────────────────────────────────

export function formatPlanAsText(
  plan: PlanResponse,
  generatedAt?: string
): string {
  const date = generatedAt
    ? new Date(generatedAt).toLocaleString()
    : new Date().toLocaleString();
  const divider = "─".repeat(40);
  const taskLines = plan.tasks
    .map(
      (t, i) =>
        `${i + 1}. [${t.priority.toUpperCase().padEnd(6)}] ${t.title}\n` +
        `   🕐 ${t.suggestedTimeSlot}   ⏱ ${t.estimatedTime}`
    )
    .join("\n\n");

  return [
    "DAYFLOW · DAILY PLAN",
    divider,
    `Generated: ${date}`,
    "",
    "TASKS",
    divider,
    taskLines,
    "",
    "SUMMARY",
    divider,
    plan.summary,
    "",
    divider,
    "Made with DayFlow AI Planner",
  ].join("\n");
}

// ─── Export as JSON ───────────────────────────────────────────────────────────

export function exportPlanAsJSON(
  plan: PlanResponse,
  generatedAt?: string
): void {
  const summary = computeDailySummary(plan);
  const payload: PlanExportJSON = {
    generatedAt: generatedAt ?? new Date().toISOString(),
    summary: plan.summary,
    dailySummary: summary,
    tasks: plan.tasks,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `dayflow-plan-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Export as PDF (print-to-PDF via browser) ────────────────────────────────

export function exportPlanAsPDF(
  plan: PlanResponse,
  generatedAt?: string
): void {
  const date = generatedAt
    ? new Date(generatedAt).toLocaleString()
    : new Date().toLocaleString();
  const summary = computeDailySummary(plan);

  const priorityColor: Record<string, string> = {
    high: "#ef4444",
    medium: "#f59e0b",
    low: "#22c55e",
  };

  const priorityLabel: Record<string, string> = {
    high: "Haute",
    medium: "Moyenne",
    low: "Basse",
  };

  const taskRows = plan.tasks
    .map(
      (t, i) => `
      <tr style="border-bottom:1px solid #e5e7eb">
        <td style="padding:10px 8px;color:#6b7280;font-size:13px">${i + 1}</td>
        <td style="padding:10px 8px;font-size:14px;font-weight:500">${t.title}</td>
        <td style="padding:10px 8px">
          <span style="display:inline-flex;align-items:center;gap:4px;padding:2px 10px;border-radius:9999px;font-size:11px;font-weight:600;background:${priorityColor[t.priority]}18;color:${priorityColor[t.priority]}">
            ${priorityLabel[t.priority]}
          </span>
        </td>
        <td style="padding:10px 8px;font-size:13px;color:#374151">${t.suggestedTimeSlot}</td>
        <td style="padding:10px 8px;font-size:13px;color:#374151">${t.estimatedTime}</td>
      </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <title>DayFlow — Plan du jour</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111827; padding: 40px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;padding-bottom:24px;border-bottom:2px solid #4f46e5">
    <div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
        <div style="width:28px;height:28px;background:#4f46e5;border-radius:8px;display:flex;align-items:center;justify-content:center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        </div>
        <span style="font-size:18px;font-weight:700;color:#4f46e5">DayFlow</span>
      </div>
      <h1 style="font-size:24px;font-weight:700;color:#111827">Plan du jour</h1>
    </div>
    <div style="text-align:right;font-size:12px;color:#6b7280">
      <div>${date}</div>
      <div style="margin-top:4px">${plan.tasks.length} tâches · ${summary.formattedTotal} de travail</div>
    </div>
  </div>

  <div style="background:#f9fafb;border-radius:12px;padding:16px 20px;margin-bottom:28px;border:1px solid #e5e7eb">
    <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#6b7280;margin-bottom:6px">Résumé</div>
    <p style="font-size:14px;color:#374151;line-height:1.6">${plan.summary}</p>
    <div style="display:flex;gap:16px;margin-top:12px">
      <span style="display:flex;align-items:center;gap:4px;font-size:12px;color:#ef4444;font-weight:600">
        <span style="width:8px;height:8px;border-radius:50%;background:#ef4444;display:inline-block"></span>
        ${summary.highCount} Haute
      </span>
      <span style="display:flex;align-items:center;gap:4px;font-size:12px;color:#f59e0b;font-weight:600">
        <span style="width:8px;height:8px;border-radius:50%;background:#f59e0b;display:inline-block"></span>
        ${summary.mediumCount} Moyenne
      </span>
      <span style="display:flex;align-items:center;gap:4px;font-size:12px;color:#22c55e;font-weight:600">
        <span style="width:8px;height:8px;border-radius:50%;background:#22c55e;display:inline-block"></span>
        ${summary.lowCount} Basse
      </span>
    </div>
  </div>

  <table style="width:100%;border-collapse:collapse">
    <thead>
      <tr style="background:#f9fafb;border-bottom:2px solid #e5e7eb">
        <th style="padding:10px 8px;text-align:left;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#6b7280">#</th>
        <th style="padding:10px 8px;text-align:left;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#6b7280">Tâche</th>
        <th style="padding:10px 8px;text-align:left;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#6b7280">Priorité</th>
        <th style="padding:10px 8px;text-align:left;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#6b7280">Horaire</th>
        <th style="padding:10px 8px;text-align:left;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#6b7280">Durée</th>
      </tr>
    </thead>
    <tbody>${taskRows}</tbody>
  </table>

  <div style="margin-top:40px;padding-top:16px;border-top:1px solid #e5e7eb;text-align:center;font-size:11px;color:#9ca3af">
    Généré avec DayFlow AI Planner
  </div>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => {
    win.print();
    win.close();
  }, 500);
}

// ─── Copy to clipboard ────────────────────────────────────────────────────────

export async function copyPlanToClipboard(plan: PlanResponse): Promise<void> {
  const text = formatPlanAsText(plan);
  await navigator.clipboard.writeText(text);
}

// ─── Download as .txt ─────────────────────────────────────────────────────────

export function downloadPlanAsTxt(plan: PlanResponse, filename?: string): void {
  const text = formatPlanAsText(plan);
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download =
    filename ?? `dayflow-plan-${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
