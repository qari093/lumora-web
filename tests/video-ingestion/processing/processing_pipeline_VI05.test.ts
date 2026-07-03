import { describe, expect, it } from "vitest";
import {
  createCanonicalVideoAsset,
  createProcessingPlan,
  createStorageManifest,
  createVideoLicense,
  materializeProcessedVideoAsset,
  rollbackProcessedAsset,
  runProcessingPipeline,
  runProcessingStage,
  summarizeProcessingPlan,
} from "@/src/core/video-ingestion";

describe("Video Ingestion Ω — Pack 05 Processing Pipeline", () => {
  function demoAsset() {
    return createCanonicalVideoAsset({
      providerId: "genesis",
      sourceAssetId: "processing_trace_001",
      sourceUrl: "https://lumora.app/media/processing_trace_001.mp4",
      title: "Processing Trace",
      durationSeconds: 30,
      width: 1920,
      height: 1080,
      hasAudio: true,
      mimeType: "video/mp4",
      attribution: "Lumora Genesis Collection",
      license: createVideoLicense({
        id: "owned",
        label: "Owned",
        commercialUse: true,
        derivativesAllowed: true,
        attributionRequired: false,
        sourceUrl: "https://lumora.app/license",
      }),
      tags: ["genesis", "processing"],
    });
  }

  it("creates a deterministic processing plan", () => {
    const asset = demoAsset();
    const plan = createProcessingPlan(asset);

    expect(plan.assetId).toBe(asset.id);
    expect(plan.steps).toHaveLength(8);
    expect(plan.steps.map((step) => step.stage)).toEqual([
      "download",
      "stream_probe",
      "thumbnail",
      "preview",
      "transcode",
      "normalize",
      "storage",
      "rollback",
    ]);
  });

  it("runs individual processing stages", () => {
    const asset = demoAsset();
    const plan = createProcessingPlan(asset);
    const next = runProcessingStage(asset, plan, "thumbnail");

    expect(next.steps.find((step) => step.stage === "thumbnail")?.status).toBe("complete");
    expect(next.steps.find((step) => step.stage === "thumbnail")?.outputUrl).toContain("thumbnail");
  });

  it("runs the full processing pipeline and summarizes readiness", () => {
    const asset = demoAsset();
    const plan = runProcessingPipeline(asset, createProcessingPlan(asset));
    const summary = summarizeProcessingPlan(plan);

    expect(summary.total).toBe(8);
    expect(summary.complete).toBe(8);
    expect(summary.failed).toBe(0);
    expect(summary.ready).toBe(true);
  });

  it("materializes processed assets and storage manifests", () => {
    const asset = demoAsset();
    const plan = runProcessingPipeline(asset, createProcessingPlan(asset));
    const processed = materializeProcessedVideoAsset(asset, plan);
    const manifest = createStorageManifest(processed, plan);

    expect(processed.processing.thumbnailUrl).toContain("thumbnail");
    expect(processed.processing.previewUrl).toContain("preview");
    expect(processed.processing.normalizedUrl).toContain("normalize");
    expect(processed.processing.storageKey).toContain("storage");
    expect(manifest.assetId).toBe(asset.id);
    expect(manifest.objects.original).toBe(asset.sourceUrl);
  });

  it("supports rollback contracts", () => {
    const asset = demoAsset();
    const plan = runProcessingPipeline(asset, createProcessingPlan(asset));
    const processed = materializeProcessedVideoAsset(asset, plan);
    const rollback = rollbackProcessedAsset(processed, plan);

    expect(rollback.ok).toBe(true);
    expect(rollback.assetId).toBe(asset.id);
    expect(rollback.restoredPlanId).toBe(plan.id);
  });
});
