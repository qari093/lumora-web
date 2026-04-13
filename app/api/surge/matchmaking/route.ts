import { NextRequest, NextResponse } from "next/server";
import { findEloMatch } from "@/lib/surge/eloMatchmaking";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      !body?.requesterId ||
      typeof body?.requesterElo !== "number" ||
      !Array.isArray(body?.candidates)
    ) {
      return NextResponse.json(
        { ok: false, error: "missing_matchmaking_fields" },
        { status: 400 }
      );
    }

    const result = findEloMatch({
      requesterId: String(body.requesterId),
      requesterElo: body.requesterElo,
      candidates: body.candidates,
      maxGap: typeof body?.maxGap === "number" ? body.maxGap : 200,
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_elo_matchmaking_v1",
      ...result,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "matchmaking_failed" },
      { status: 500 }
    );
  }
}
