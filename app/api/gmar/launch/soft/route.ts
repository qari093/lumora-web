import { NextResponse } from "next/server";

import {
  createGmarSoftLaunchStatus,
  assertGmarSoftLaunchStatus
} from "@/src/core/gmar/launch-active/softLaunch";

export async function GET() {
  try {
    const status = createGmarSoftLaunchStatus();

    assertGmarSoftLaunchStatus(status);

    return NextResponse.json({
      ok: true,
      status
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "GMAR soft launch status failed."
      },
      { status: 503 }
    );
  }
}
