import { NextResponse } from "next/server";

import {
  createGmarReleaseStatus,
  assertGmarReleaseStatus
} from "@/src/core/gmar/final-completion/release/publicFinalRelease";

export async function GET() {
  try {
    const status = createGmarReleaseStatus("public_release");

    assertGmarReleaseStatus(status);

    return NextResponse.json({
      ok: true,
      service: "gmar",
      release: status
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        service: "gmar",
        error:
          error instanceof Error
            ? error.message
            : "GMAR final release failed."
      },
      { status: 503 }
    );
  }
}
