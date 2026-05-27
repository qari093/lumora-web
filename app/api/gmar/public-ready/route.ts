import { NextResponse } from "next/server";

import {
  createGmarPublicReadinessStatus,
  assertGmarPublicReadinessStatus
} from "@/src/core/gmar/public-active/publicReadiness";

export async function GET() {
  try {
    const status = createGmarPublicReadinessStatus();

    assertGmarPublicReadinessStatus(status);

    return NextResponse.json({
      ok: true,
      service: "gmar",
      status
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        service: "gmar",
        error:
          error instanceof Error
            ? error.message
            : "GMAR public readiness failed."
      },
      { status: 503 }
    );
  }
}
