import { NextResponse } from "next/server";

import {
  createInitialGmarGameState,
  assertGmarGameState
} from "@/src/core/gmar/state/gameState";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const userId =
      typeof body.userId === "string"
        ? body.userId
        : "";

    const displayName =
      typeof body.displayName === "string"
        ? body.displayName
        : undefined;

    const state = createInitialGmarGameState({
      userId,
      displayName
    });

    assertGmarGameState(state);

    return NextResponse.json({
      ok: true,
      state
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "GMAR game state initialization failed."
      },
      { status: 400 }
    );
  }
}
