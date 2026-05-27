import { NextResponse } from "next/server";

import {
  createGmarComplianceStatus,
  assertGmarComplianceStatus
} from "@/src/core/gmar/final-completion/compliance/securityCompliance";

export async function GET() {
  try {
    const status = createGmarComplianceStatus();

    assertGmarComplianceStatus(status);

    return NextResponse.json({
      ok: true,
      service: "gmar",
      compliance: status
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        service: "gmar",
        error:
          error instanceof Error
            ? error.message
            : "GMAR compliance status failed."
      },
      { status: 503 }
    );
  }
}
