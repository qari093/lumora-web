import { NextRequest, NextResponse } from "next/server";
import { rankLeaderboard } from "@/lib/surge/duelLeaderboard";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!Array.isArray(body?.entries)) {
      return NextResponse.json(
        { ok: false, error: "missing_leaderboard_entries" },
        { status: 400 }
      );
    }

    const leaderboard = rankLeaderboard(body.entries);

    return NextResponse.json({
      ok: true,
      source: "lumora_duel_leaderboard_v1",
      leaderboard,
      count: leaderboard.length,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "leaderboard_failed" },
      { status: 500 }
    );
  }
}
