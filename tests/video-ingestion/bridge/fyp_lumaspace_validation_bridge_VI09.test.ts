import { describe, expect, it } from "vitest";
import {
  createFypLumaSpaceValidationJourney,
  createValidationMediaPool,
  createValidationPoolBridgeCertification,
  runValidationPoolBridge,
  summarizeFypLumaSpaceValidationJourneys,
} from "@/src/core/video-ingestion";

describe("Video Ingestion Ω — Pack 09 FYP + LumaSpace Validation Bridge", () => {
  it("validates a single asset across FYP, voice check, LumaSpace, and share", () => {
    const asset = createValidationMediaPool()[0];
    const journey = createFypLumaSpaceValidationJourney(asset);

    expect(journey.passed).toBe(true);
    expect(journey.steps.map((step) => step.id)).toEqual([
      "fyp_playback",
      "voice_check",
      "lumaspace_memory_save",
      "universal_share_ready",
    ]);
  });

  it("summarizes all validation pool journeys", () => {
    const journeys = createValidationMediaPool().map((asset) =>
      createFypLumaSpaceValidationJourney(asset),
    );

    const summary = summarizeFypLumaSpaceValidationJourneys(journeys);

    expect(summary.total).toBe(40);
    expect(summary.failed).toBe(0);
    expect(summary.ready).toBe(true);
  });

  it("runs full validation pool bridge", () => {
    const bridge = runValidationPoolBridge();

    expect(bridge.poolSize).toBe(40);
    expect(bridge.summary.passed).toBe(40);
    expect(bridge.summary.ready).toBe(true);
  });

  it("creates final bridge certification", () => {
    const certification = createValidationPoolBridgeCertification();

    expect(certification.ready).toBe(true);
    expect(certification.poolSize).toBe(40);
    expect(certification.requiredSurfaces).toContain("voice_check");
    expect(certification.requiredSurfaces).toContain("lumaspace");
  });
});
