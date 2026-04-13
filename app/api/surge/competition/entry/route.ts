import { NextRequest, NextResponse } from "next/server";
import { createEntryCompetition } from "@/lib/surge/entryCompetition";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.challengeId || !body?.userId || typeof body?.entryFee !== "number") {
      return NextResponse.json(
        { ok: false, error: "missing_entry_competition_fields" },
        { status: 400 }
      );
    }

    const entry = createEntryCompetition({
      challengeId: String(body.challengeId),
      userId: String(body.userId),
      entryFee: body.entryFee,
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_entry_competition_v1",
      entry,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "entry_competition_failed" },
      { status: 500 }
    );
  }
}
