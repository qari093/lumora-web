import { NextRequest, NextResponse } from "next/server";
import { getSessionBreak } from "@/lib/safety/sessionBreak";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = getSessionBreak({
      surgeSessions:
        typeof body?.surgeSessions === "number" ? body.surgeSessions : 0,
      fatigueScore:
        typeof body?.fatigueScore === "number" ? body.fatigueScore : 0,
      cooldownMinutes:
        typeof body?.cooldownMinutes === "number" ? body.cooldownMinutes : 5,
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_session_break_v1",
      ...result,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "session_break_failed" },
      { status: 500 }
    );
  }
}
