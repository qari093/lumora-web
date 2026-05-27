import { NextResponse } from "next/server";
import {
  createGmarPlayerProfile,
  assertGmarPlayerProfile
} from "@/src/core/gmar/player/playerIdentity";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const userId = typeof body.userId === "string" ? body.userId : "";
    const displayName = typeof body.displayName === "string" ? body.displayName : undefined;
    const faction = body.faction === "nexus" || body.faction === "vanguard" || body.faction === "aurora"
      ? body.faction
      : undefined;

    const profile = createGmarPlayerProfile({
      userId,
      displayName,
      faction
    });

    assertGmarPlayerProfile(profile);

    return NextResponse.json({
      ok: true,
      profile
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "GMAR player initialization failed."
      },
      { status: 400 }
    );
  }
}
