import { NextRequest, NextResponse } from "next/server";
import { createSessionRollup } from "@/lib/ads/sessionRollup";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      typeof body?.impressions !== "number" ||
      typeof body?.clicks !== "number" ||
      typeof body?.conversions !== "number" ||
      typeof body?.revenue !== "number" ||
      typeof body?.cost !== "number" ||
      typeof body?.sessionMinutes !== "number"
    ) {
      return NextResponse.json(
        { ok: false, error: "missing_session_rollup_fields" },
        { status: 400 }
      );
    }

    const summary = createSessionRollup({
      impressions: body.impressions,
      clicks: body.clicks,
      conversions: body.conversions,
      revenue: body.revenue,
      cost: body.cost,
      sessionMinutes: body.sessionMinutes,
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_session_rollup_v1",
      summary,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "session_rollup_failed" },
      { status: 500 }
    );
  }
}
