import { NextRequest, NextResponse } from "next/server";
import { detectFatigue } from "@/lib/safety/fatigue";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = detectFatigue({
      sessionMinutes:
        typeof body?.sessionMinutes === "number" ? body.sessionMinutes : 0,
      duelsPlayed:
        typeof body?.duelsPlayed === "number" ? body.duelsPlayed : 0,
      rapidActions:
        typeof body?.rapidActions === "number" ? body.rapidActions : 0,
      lateNightUsage: Boolean(body?.lateNightUsage),
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_fatigue_v1",
      ...result,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "fatigue_detection_failed" },
      { status: 500 }
    );
  }
}
