import { NextResponse } from "next/server";

import {
  restoreGmarDatabaseRecord
} from "@/src/core/gmar/final-completion/database/databasePersistence";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    if (!body.record) {
      throw new Error("GMAR database record is required.");
    }

    const restored = restoreGmarDatabaseRecord(body.record);

    return NextResponse.json({
      ok: true,
      restored
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "GMAR database restore failed."
      },
      { status: 400 }
    );
  }
}
