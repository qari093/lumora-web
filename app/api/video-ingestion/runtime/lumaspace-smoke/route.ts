import { NextResponse } from "next/server";
import {
  createValidationMediaPool,
  createFypLumaSpaceValidationJourney,
  summarizeFypLumaSpaceValidationJourneys,
} from "@/src/core/video-ingestion";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const journeys = createValidationMediaPool().map((asset) =>
      createFypLumaSpaceValidationJourney(asset),
    );

    const summary = summarizeFypLumaSpaceValidationJourneys(journeys);
    const memoryReady = journeys.every((journey) =>
      journey.steps.some((step) => step.id === "lumaspace_memory_save" && step.passed),
    );

    return NextResponse.json({
      ok: true,
      route: "/api/video-ingestion/runtime/lumaspace-smoke",
      memoryReady,
      summary,
      poolSize: journeys.length,
      next: "final_runtime_certification",
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "unknown_error" },
      { status: 500 },
    );
  }
}
