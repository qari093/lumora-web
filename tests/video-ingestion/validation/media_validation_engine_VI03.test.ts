import { describe, expect, it } from "vitest";
import {
  approveValidatedMediaAsset,
  createCanonicalVideoAsset,
  createDefaultMediaValidationPolicy,
  createMediaValidationReport,
  createVideoLicense,
  validateMediaAudio,
  validateMediaDuration,
  validateMediaLicense,
  validateMediaVideo,
} from "@/src/core/video-ingestion";

describe("Video Ingestion Ω — Pack 03 Media Validation Engine", () => {
  function demoAsset(overrides = {}) {
    return createCanonicalVideoAsset({
      providerId: "genesis",
      sourceAssetId: "trace_validation_001",
      sourceUrl: "https://lumora.app/media/trace_validation_001.mp4",
      title: "Validation Trace",
      durationSeconds: 32,
      width: 1920,
      height: 1080,
      hasAudio: true,
      mimeType: "video/mp4",
      attribution: "Lumora Genesis Collection",
      license: createVideoLicense({
        id: "lumora-owned",
        label: "Lumora Owned",
        commercialUse: true,
        derivativesAllowed: true,
        attributionRequired: false,
        sourceUrl: "https://lumora.app/licenses/genesis",
      }),
      tags: ["genesis", "wonder"],
      metadata: { serenity: 0.92 },
      ...overrides,
    });
  }

  it("passes valid media through all validation stages", () => {
    const policy = createDefaultMediaValidationPolicy();
    const report = createMediaValidationReport(demoAsset(), policy);

    expect(report.ok).toBe(true);
    expect(report.fatal).toBe(false);
    expect(report.score).toBe(1);
    expect(report.stages.length).toBeGreaterThan(5);
  });

  it("detects audio, video, duration, and license failures", () => {
    const policy = createDefaultMediaValidationPolicy();
    const asset = demoAsset({
      hasAudio: false,
      width: 320,
      durationSeconds: 2,
      license: createVideoLicense({
        id: "restricted",
        label: "Restricted",
        commercialUse: false,
        derivativesAllowed: false,
        attributionRequired: true,
        sourceUrl: "https://lumora.app/licenses/restricted",
      }),
    });

    expect(validateMediaAudio(asset, policy).ok).toBe(false);
    expect(validateMediaVideo(asset, policy).ok).toBe(false);
    expect(validateMediaDuration(asset, policy).ok).toBe(false);
    expect(validateMediaLicense(asset, policy).ok).toBe(false);
  });

  it("quarantines invalid assets and preserves validation issues", () => {
    const asset = demoAsset({ hasAudio: false });
    const report = createMediaValidationReport(asset);
    const updated = approveValidatedMediaAsset(asset, report);

    expect(report.ok).toBe(false);
    expect(updated.lifecycle).toBe("quarantined");
    expect(updated.metadata.validationIssues).toContain("audio_required");
  });

  it("marks valid assets as validated", () => {
    const asset = demoAsset();
    const report = createMediaValidationReport(asset);
    const updated = approveValidatedMediaAsset(asset, report);

    expect(updated.lifecycle).toBe("validated");
    expect(updated.metadata.validationScore).toBe(1);
    expect(updated.metadata.validationIssues).toEqual([]);
  });
});
