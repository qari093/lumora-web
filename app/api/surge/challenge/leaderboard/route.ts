import { NextRequest, NextResponse } from "next/server";
import { rankChallengeLeaderboard } from "@/lib/surge/challengeLeaderboard";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!Array.isArray(body?.entries)) {
      return NextResponse.json(
        { ok: false, error: "missing_challenge_leaderboard_entries" },
        { status: 400 }
      );
    }

    const leaderboard = rankChallengeLeaderboard(body.entries);

    return NextResponse.json({
      ok: true,
      source: "lumora_challenge_leaderboard_v1",
      leaderboard,
      count: leaderboard.length,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "challenge_leaderboard_failed" },
      { status: 500 }
    );
  }
}
