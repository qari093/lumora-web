import { NextResponse } from "next/server";
import {
  createValidationMediaPool,
  createValidationPoolBridgeCertification,
  createVideoIngestionFoundationCertification,
  runValidationPoolBridge,
} from "@/src/core/video-ingestion";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const assets = createValidationMediaPool();
    const bridge = runValidationPoolBridge();
    const bridgeCertification = createValidationPoolBridgeCertification();
    const foundation = createVideoIngestionFoundationCertification();

    const ready =
      assets.length === 40 &&
      bridge.summary.ready &&
      bridgeCertification.ready &&
      foundation.passed;

    return NextResponse.json({
      ok: true,
      route: "/api/video-ingestion/runtime/final-certification",
      ready,
      poolSize: assets.length,
      foundation,
      bridgeCertification,
      bridgeSummary: bridge.summary,
      next: "real_browser_fyp_lumaspace_smoke",
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "unknown_error" },
      { status: 500 },
    );
  }
}
