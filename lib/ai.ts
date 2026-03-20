import type { PlanResponse } from "@/types";

// ─── Groq wire types ──────────────────────────────────────────────────────────

interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GroqRequestBody {
  model: string;
  messages: GroqMessage[];
  temperature: number;
  max_tokens: number;
  // NOTE: No response_format here — Groq's strict JSON validator rejects
  // otherwise-valid JSON when the model embeds a newline inside a string
  // value (e.g. "summary": "text\n}"). We parse JSON ourselves instead.
}

interface GroqChoice {
  message: { role: string; content: string };
  finish_reason: string;
}

interface GroqResponse {
  choices: GroqChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// ─── Prompt ───────────────────────────────────────────────────────────────────

export function buildPrompt(tasks: string): string {
  return `You are a senior productivity coach and daily planning expert.
Analyze the following tasks and produce a clean, professional daily schedule.

Return ONLY a valid JSON object. No markdown, no code fences, no extra text.
Use exactly this structure:

{
  "tasks": [
    {
      "title": "...",
      "priority": "high",
      "estimatedTime": "...",
      "suggestedTimeSlot": "..."
    }
  ],
  "summary": "..."
}

Rules:
- priority must be exactly one of: "high", "medium", "low"
- Correct spelling and grammar mistakes in task titles
- Write every task title as a clean infinitive verb phrase (e.g. "Déployer le correctif en production")
- Assign priorities: critical/urgent = high, important = medium, routine = low
- Estimate realistic durations: "30 minutes", "1 heure", "2 heures"
- Use precise time slots: "09:00 – 10:30"
- Schedule from 08:00, leave short breaks between blocks
- Order tasks: urgency first, high-focus work in the morning
- The "summary" value must be a single short sentence with NO newlines inside it
- Do not include any text outside the JSON object

Tasks:
${tasks}`;
}

// ─── JSON repair helpers ──────────────────────────────────────────────────────

/**
 * Attempt to extract and repair the JSON from the raw model output.
 * Handles: markdown fences, trailing content after closing brace,
 * newlines inside string values that break strict parsers.
 */
function extractJSON(raw: string): string {
  // 1. Strip markdown code fences
  let text = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();

  // 2. Find the outermost { ... } block
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    text = text.slice(start, end + 1);
  }

  // 3. Replace literal newlines inside JSON string values with a space.
  //    This fixes the Groq bug where "summary": "text\n}" breaks the object.
  //    We do this carefully: only replace \n that appear between a pair of
  //    double-quotes that are NOT already escaped.
  text = text.replace(
    /"((?:[^"\\]|\\.)*)"/g,
    (_match, inner: string) => `"${inner.replace(/\n/g, " ").replace(/\r/g, "")}"`,
  );

  return text;
}

// ─── Validator ────────────────────────────────────────────────────────────────

function validatePlanResponse(data: unknown): data is PlanResponse {
  if (typeof data !== "object" || data === null) return false;
  const obj = data as Record<string, unknown>;
  if (typeof obj.summary !== "string") return false;
  if (!Array.isArray(obj.tasks) || obj.tasks.length === 0) return false;
  const validPriorities = new Set(["high", "medium", "low"]);
  for (const item of obj.tasks) {
    if (typeof item !== "object" || item === null) return false;
    const t = item as Record<string, unknown>;
    if (typeof t.title !== "string" || t.title.trim() === "") return false;
    if (!validPriorities.has(t.priority as string)) return false;
    if (typeof t.estimatedTime !== "string") return false;
    if (typeof t.suggestedTimeSlot !== "string") return false;
  }
  return true;
}

// ─── Groq caller ─────────────────────────────────────────────────────────────

export async function generatePlanFromGroq(
  tasks: string
): Promise<PlanResponse> {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) throw new Error("AI_API_KEY environment variable is not set.");

  const body: GroqRequestBody = {
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        // System message enforces JSON-only output at the model level
        role: "system",
        content:
          "You are a JSON API. You output only raw valid JSON objects — no markdown, no explanations, no code fences. Never include newlines inside string values.",
      },
      {
        role: "user",
        content: buildPrompt(tasks),
      },
    ],
    temperature: 0.3,
    max_tokens: 1500,
  };

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Groq API error ${res.status}: ${errorText}`);
  }

  const groqData: GroqResponse = await res.json();
  const rawContent = groqData.choices?.[0]?.message?.content;
  if (!rawContent) throw new Error("Groq returned an empty response.");

  const cleaned = extractJSON(rawContent);

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    console.error("[ai.ts] JSON.parse failed on cleaned output:", cleaned);
    throw new Error("Groq response was not valid JSON.");
  }

  if (!validatePlanResponse(parsed)) {
    console.error("[ai.ts] Schema validation failed:", JSON.stringify(parsed));
    throw new Error("Groq response did not match the expected schema.");
  }

  return parsed;
}