import { describe, expect, it } from "vitest";
import { validateLicense } from "@/src/lib/content/legal/licenseNormalizer";
import { buildAttributionRecord, shouldRenderAttribution } from "@/src/lib/content/legal/attribution";
import { validateMediaAssetForLumora } from "@/src/lib/content/legal/assetClearance";

describe("Lumora Pack 03 — license + attribution clearance", () => {
  it("accepts public domain and CC0", () => {
    expect(validateLicense("Public Domain").ok).toBe(true);
    expect(validateLicense("CC0 1.0").ok).toBe(true);
  });

  it("accepts CC-BY but requires attribution", () => {
    const out = validateLicense("CC BY 4.0");
    expect(out.ok).toBe(true);
    expect(out.attributionRequired).toBe(true);
  });

  it("rejects non-commercial and unknown licenses", () => {
    expect(validateLicense("CC-BY-NC 4.0").ok).toBe(false);
    expect(validateLicense("unknown").ok).toBe(false);
  });

  it("builds attribution records", () => {
    const record = buildAttributionRecord({
      sourceId: "esa",
      sourceName: "ESA",
      title: "Earth from Space",
      creator: "ESA",
      sourceUrl: "https://esa.int",
      license: "CC BY 4.0",
    });

    expect(record.valid).toBe(true);
    expect(shouldRenderAttribution(record)).toBe(true);
  });

  it("validates a full asset for Lumora FYP", () => {
    const out = validateMediaAssetForLumora({
      sourceId: "nasa",
      sourceName: "NASA",
      title: "Launch",
      sourceUrl: "https://nasa.gov",
      license: "public domain",
      hasAudio: true,
      playableUrl: "https://example.com/launch.mp4",
      durationSeconds: 30,
      commercialUse: true,
    });

    expect(out.ok).toBe(true);
    expect(out.reasons).toHaveLength(0);
  });

  it("rejects silent assets even with valid license", () => {
    const out = validateMediaAssetForLumora({
      sourceId: "nasa",
      sourceName: "NASA",
      title: "Silent",
      sourceUrl: "https://nasa.gov",
      license: "public domain",
      hasAudio: false,
      playableUrl: "https://example.com/silent.mp4",
      durationSeconds: 30,
      commercialUse: true,
    });

    expect(out.ok).toBe(false);
    expect(out.reasons).toContain("missing_audio");
  });
});
