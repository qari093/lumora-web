import { NextResponse } from "next/server";

import {
  createGmarCreatorProfile,
  assertGmarCreatorProfile
} from "@/src/core/gmar/creator-active/creatorEcosystem";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const profile = createGmarCreatorProfile({
      playerId:
        typeof body.playerId === "string"
          ? body.playerId
          : "",
      displayName:
        typeof body.displayName === "string"
          ? body.displayName
          : "",
      factionName:
        typeof body.factionName === "string"
          ? body.factionName
          : undefined
    });

    assertGmarCreatorProfile(profile);

    return NextResponse.json({
      ok: true,
      profile
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "GMAR creator profile failed."
      },
      { status: 400 }
    );
  }
}
