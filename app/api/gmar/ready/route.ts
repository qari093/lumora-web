import { NextResponse } from "next/server";

import {
  createGmarReadinessReport,
  assertGmarReadinessReport
} from "@/src/core/gmar/infra-active/readiness";

export async function GET() {
  try {
    const report = createGmarReadinessReport();

    assertGmarReadinessReport(report);

    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        service: "gmar",
        status: "degraded",
        error:
          error instanceof Error
            ? error.message
            : "GMAR readiness failed."
      },
      { status: 503 }
    );
  }
}
