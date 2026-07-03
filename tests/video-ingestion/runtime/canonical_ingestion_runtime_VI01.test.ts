import { describe, expect, it, beforeEach } from "vitest";

import {
  createCanonicalVideoAsset,
  createVideoLicense,
  validateCanonicalVideoAsset,
  createIngestionJob,
  transitionIngestionJob,
  runValidationPipeline,
  genesisAdapter,
  registerProviderAdapter,
  listProviderAdapters,
  clearProviderRegistry,
} from "@/src/core/video-ingestion";

describe("Video Ingestion Ω — Canonical Runtime", () => {
  beforeEach(() => {
    clearProviderRegistry();
  });

  function demoAsset() {
    return createCanonicalVideoAsset({
      providerId: "genesis",
      sourceAssetId: "trace_001",
      sourceUrl: "https://lumora.app/media/trace_001.mp4",
      title: "Genesis Trace",
      durationSeconds: 30,
      width: 1920,
      height: 1080,
      hasAudio: true,
      mimeType: "video/mp4",
      attribution: "Lumora",
      license: createVideoLicense({
        id: "owned",
        label: "Owned",
        commercialUse: true,
        derivativesAllowed: true,
        attributionRequired: false,
        sourceUrl: "https://lumora.app/license",
      }),
    });
  }

  it("validates canonical assets", () => {
    const result = validateCanonicalVideoAsset(demoAsset());

    expect(result.ok).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("tracks ingestion jobs", () => {
    const queued = createIngestionJob("genesis");
    const importing = transitionIngestionJob(queued, "importing");
    const finished = transitionIngestionJob(importing, "complete");

    expect(queued.state).toBe("queued");
    expect(importing.attempts).toBe(1);
    expect(finished.state).toBe("complete");
  });

  it("runs validation pipeline", () => {
    const runtime = runValidationPipeline(
      "genesis",
      [demoAsset()],
    );

    expect(runtime.ok).toBe(true);
    expect(runtime.assets).toHaveLength(1);
    expect(runtime.job.state).toBe("complete");
  });

  it("registers Genesis provider", () => {
    registerProviderAdapter(genesisAdapter);

    expect(listProviderAdapters()).toHaveLength(1);
    expect(listProviderAdapters()[0].provider.id).toBe("genesis");
  });
});
