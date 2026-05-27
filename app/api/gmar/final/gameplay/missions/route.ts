import { NextResponse } from "next/server";

import {
  getAvailableGmarMissions,
  assertGmarGameplayContent
} from "@/src/core/gmar/final-completion/gameplay/content";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const level = Number(url.searchParams.get("level") ?? "1");

    const missions = getAvailableGmarMissions(level);

    assertGmarGameplayContent();

    return NextResponse.json({
      ok: true,
      missions
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "GMAR mission registry failed."
      },
      { status: 400 }
    );
  }
}
