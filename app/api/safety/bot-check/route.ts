import { NextRequest, NextResponse } from "next/server";
import { botCheck } from "@/lib/safety/botCheck";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = botCheck({
      actionsPerMinute:
        typeof body?.actionsPerMinute === "number" ? body.actionsPerMinute : 0,
      repeatedClicks:
        typeof body?.repeatedClicks === "number" ? body.repeatedClicks : 0,
      identicalIntervals:
        typeof body?.identicalIntervals === "number" ? body.identicalIntervals : 0,
      sessionMinutes:
        typeof body?.sessionMinutes === "number" ? body.sessionMinutes : 0,
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_bot_check_v1",
      ...result,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "bot_check_failed" },
      { status: 500 }
    );
  }
}
