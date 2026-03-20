import { NextRequest, NextResponse } from "next/server";
import { generatePlanFromGroq } from "@/lib/ai";
import type { APIResponse } from "@/types";

// ─── POST /api/plan ───────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse<APIResponse | { error: string }>> {
  // 1. Parse body
  let body: { tasks?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { tasks } = body;

  // 2. Validate input
  if (!tasks || typeof tasks !== "string") {
    return NextResponse.json(
      { error: "Missing required field: `tasks` (string)." },
      { status: 400 }
    );
  }

  if (tasks.trim().length === 0) {
    return NextResponse.json(
      { error: "`tasks` must not be empty." },
      { status: 400 }
    );
  }

  if (tasks.length > 4000) {
    return NextResponse.json(
      { error: "`tasks` exceeds maximum length of 4000 characters." },
      { status: 400 }
    );
  }

  // 3. Call AI
  try {
    const plan = await generatePlanFromGroq(tasks);
    return NextResponse.json({ success: true, plan }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";

    if (message.includes("AI_API_KEY")) {
      console.error("[/api/plan] Missing API key.");
      return NextResponse.json(
        { error: "Server configuration error. Please contact support." },
        { status: 500 }
      );
    }

    if (message.startsWith("Groq API error")) {
      console.error("[/api/plan] Groq upstream error:", message);
      return NextResponse.json(
        { error: "AI service temporarily unavailable. Please try again." },
        { status: 502 }
      );
    }

    if (message.includes("schema") || message.includes("valid JSON")) {
      console.error("[/api/plan] Bad Groq response:", message);
      return NextResponse.json(
        { error: "AI returned an unexpected response. Please try again." },
        { status: 502 }
      );
    }

    console.error("[/api/plan] Unexpected error:", message);
    return NextResponse.json(
      { error: "Failed to generate plan. Please try again." },
      { status: 500 }
    );
  }
}

// ─── Block other methods ──────────────────────────────────────────────────────

export function GET(): NextResponse {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    { status: 405, headers: { Allow: "POST" } }
  );
}
