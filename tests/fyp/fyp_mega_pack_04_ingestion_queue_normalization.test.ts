import { describe, expect, it } from "vitest";

import {
  createFypIngestionJob,
  normalizeFypIngestionBatch,
  normalizeFypIngestionJob,
  validateFypIngestionJob,
  validateFypIngestionQueueNormalizationRuntime
} from "@/src/core/fyp/ingestion/ingestionQueue";

describe("FYP Mega Pack 04 — Ingestion Queue + Normalization", () => {
  it("creates a queued ingestion job for a known source", () => {
    const job = createFypIngestionJob({
      sourceId: "NASA",
      externalId: "sample-1",
      title: "NASA Sample",
      sampleUrl: "https://nasa.gov/sample.mp4",
      rightsTag: "public_domain",
      commercialReuseAllowed: true
    });

    expect(job.status).toBe("queued");
    expect(job.source.id).toBe("NASA");
  });

  it("blocks unknown sources", () => {
    const job = createFypIngestionJob({
      sourceId: "UNKNOWN_SOURCE",
      externalId: "bad-1",
      title: "Bad",
      sampleUrl: "https://example.com/bad.mp4"
    });

    expect(job.status).toBe("blocked");
    expect(job.errors).toContain("unknown_source_id");
  });

  it("validates and normalizes a public domain source", () => {
    const job = validateFypIngestionJob(createFypIngestionJob({
      sourceId: "NASA",
      externalId: "earth-rise",
      title: "Earth Rise",
      sampleUrl: "https://www.nasa.gov/earth-rise.mp4",
      rightsTag: "public_domain",
      commercialReuseAllowed: true,
      embedOnly: false
    }));

    const item = normalizeFypIngestionJob(job);

    expect(item.sourceId).toBe("NASA");
    expect(item.rightsVerified).toBe(true);
    expect(item.safeForFyp).toBe(true);
    expect(item.ingestionMode).toBe("direct_download");
  });

  it("keeps official YouTube items embed-only", () => {
    const batch = normalizeFypIngestionBatch([
      {
        sourceId: "YOUTUBE_OFFICIAL",
        externalId: "official-embed",
        title: "Official Embed",
        sampleUrl: "https://youtube.com/watch?v=official",
        licenseName: "official_channel_embed",
        commercialReuseAllowed: true,
        embedOnly: true,
        officialChannel: true
      }
    ]);

    expect(batch).toHaveLength(1);
    expect(batch[0]?.ingestionMode).toBe("embed_only");
  });

  it("deduplicates normalized feed items", () => {
    const batch = normalizeFypIngestionBatch([
      {
        sourceId: "NASA",
        externalId: "dupe",
        title: "Dupe",
        sampleUrl: "https://www.nasa.gov/dupe.mp4",
        rightsTag: "public_domain",
        commercialReuseAllowed: true
      },
      {
        sourceId: "NASA",
        externalId: "dupe",
        title: "Dupe",
        sampleUrl: "https://www.nasa.gov/dupe.mp4",
        rightsTag: "public_domain",
        commercialReuseAllowed: true
      }
    ]);

    expect(batch).toHaveLength(1);
  });

  it("validates complete ingestion queue normalization runtime", () => {
    expect(validateFypIngestionQueueNormalizationRuntime()).toBe(true);
  });
});
