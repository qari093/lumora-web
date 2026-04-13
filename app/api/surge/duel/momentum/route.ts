import { NextRequest, NextResponse } from "next/server";
import { calculateMomentum } from "@/lib/surge/momentumMeter";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      typeof body?.leftVotes !== "number" ||
      typeof body?.rightVotes !== "number"
    ) {
      return NextResponse.json(
        { ok: false, error: "missing_momentum_fields" },
        { status: 400 }
      );
    }

    const result = calculateMomentum({
      leftVotes: body.leftVotes,
      rightVotes: body.rightVotes,
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_momentum_meter_v1",
      ...result,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "momentum_failed" },
      { status: 500 }
    );
  }
}
