import { NextResponse } from "next/server";
import {
  createValidationPoolBridgeCertification,
  runValidationPoolBridge,
} from "@/src/core/video-ingestion";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const bridge = runValidationPoolBridge();
    const certification = createValidationPoolBridgeCertification();

    return NextResponse.json({
      ok: true,
      route: "/api/video-ingestion/runtime/fyp-smoke",
      certification,
      summary: bridge.summary,
      poolSize: bridge.poolSize,
      runtimeReady:
        certification.ready &&
        bridge.summary.ready &&
        bridge.poolSize === 40,
      next: "lumaspace_runtime_smoke",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "unknown_error",
      },
      { status: 500 },
    );
  }
}
