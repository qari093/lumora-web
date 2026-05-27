import { NextResponse } from "next/server";

import {
  joinGmarSquad,
  assertGmarSocialState
} from "@/src/core/gmar/social-active/socialMultiplayer";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    if (!body.squad || typeof body.playerId !== "string") {
      throw new Error("GMAR squad and playerId are required.");
    }

    const squad = joinGmarSquad({
      squad: body.squad,
      playerId: body.playerId
    });

    assertGmarSocialState({
      squad,
      leaderboard: {
        playerId: body.playerId,
        displayName: "GMAR Player",
        xp: 0,
        rank: 1
      }
    });

    return NextResponse.json({
      ok: true,
      squad
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "GMAR squad join failed."
      },
      { status: 400 }
    );
  }
}
