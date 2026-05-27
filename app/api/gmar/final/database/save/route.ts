import { NextResponse } from "next/server";

import {
  createGmarDatabaseRecord,
  assertGmarDatabaseRecord
} from "@/src/core/gmar/final-completion/database/databasePersistence";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    if (!body.gameState) {
      throw new Error("GMAR gameState is required.");
    }

    const record = createGmarDatabaseRecord({
      gameState: body.gameState,
      wallet: body.wallet ?? null
    });

    assertGmarDatabaseRecord(record);

    return NextResponse.json({
      ok: true,
      record
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "GMAR database save failed."
      },
      { status: 400 }
    );
  }
}
