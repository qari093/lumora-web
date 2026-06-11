import { describe, expect, it } from "vitest";

import {
  FYP_SOURCE_REGISTRY,
  getFypSourceById
} from "@/src/core/fyp/sources/sourceRegistry";

import {
  createFypSourceSample,
  validateAllFypSourceSamples,
  validateFypSourceSample
} from "@/src/core/fyp/sources/sourceSampling";

describe("FYP Mega Pack 02 — Source Sampling & Ingestion Eligibility", () => {
  it("keeps exactly 48 registered sources", () => {
    expect(FYP_SOURCE_REGISTRY).toHaveLength(48);
  });

  it("creates valid samples for every source", () => {
    const results = FYP_SOURCE_REGISTRY.map((source) =>
      validateFypSourceSample(createFypSourceSample(source))
    );

    expect(results.every((result) => result.ok)).toBe(true);
    expect(results.every((result) => result.ingestionEligible)).toBe(true);
  });

  it("keeps YouTube official source embed-only", () => {
    const source = getFypSourceById("YOUTUBE_OFFICIAL");
    expect(source).not.toBeNull();

    const result = validateFypSourceSample(createFypSourceSample(source!));

    expect(result.ok).toBe(true);
    expect(result.ingestionMode).toBe("embed_only");
  });

  it("keeps official trailers protected from non-official ingestion", () => {
    const blocked = validateFypSourceSample({
      sourceId: "OFFICIAL_TRAILERS",
      sampleUrl: "https://example.com/random-trailer.mp4",
      licenseName: "unknown",
      commercialReuseAllowed: true,
      embedOnly: false,
      officialChannel: false
    });

    expect(blocked.ok).toBe(false);
    expect(blocked.errors).toContain("non_official_trailer_source");
  });

  it("allows public-domain direct ingestion sample", () => {
    const source = getFypSourceById("NASA");
    expect(source).not.toBeNull();

    const result = validateFypSourceSample(createFypSourceSample(source!));

    expect(result.ok).toBe(true);
    expect(result.ingestionMode).toBe("direct_download");
  });

  it("validates complete source sampling coverage", () => {
    expect(validateAllFypSourceSamples()).toBe(true);
  });
});
