import { NextRequest, NextResponse } from "next/server";
import { getTimerState } from "@/lib/surge/timerService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      typeof body?.startAt !== "number" ||
      typeof body?.durationSeconds !== "number"
    ) {
      return NextResponse.json(
        { ok: false, error: "missing_timer_fields" },
        { status: 400 }
      );
    }

    const timer = getTimerState({
      startAt: body.startAt,
      durationSeconds: body.durationSeconds,
      now: typeof body?.now === "number" ? body.now : undefined,
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_timer_service_v1",
      timer,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "timer_service_failed" },
      { status: 500 }
    );
  }
}
