import { NextResponse } from "next/server";

import {
  createGmarPersistedSnapshot,
  assertGmarPersistedSnapshot
} from "@/src/core/gmar/persistence-active/persistence";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    if (!body.gameState) {
      throw new Error("GMAR gameState is required.");
    }

    const snapshot = createGmarPersistedSnapshot({
      gameState: body.gameState,
      wallet: body.wallet ?? null
    });

    assertGmarPersistedSnapshot(snapshot);

    return NextResponse.json({
      ok: true,
      snapshot
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "GMAR persistence save failed."
      },
      { status: 400 }
    );
  }
}
