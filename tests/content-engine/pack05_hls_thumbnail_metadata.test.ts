import { describe, expect, it } from "vitest";
import {
  buildContentMetadata,
  buildHlsOutput,
  buildThumbnailOutput,
  createProcessedContentOutput,
  validateProcessedOutput,
} from "@/src/content-engine/output";

describe("Content Engine Pack05 — HLS Output + Thumbnail + Metadata", () => {
  it("builds HLS output with 360p and 720p by default", () => {
    const hls = buildHlsOutput({
      contentId: "content1",
      baseUrl: "https://cdn.lumora.test",
    });

    expect(hls.masterPlaylistUrl).toBe("https://cdn.lumora.test/content1/master.m3u8");
    expect(hls.segmentDurationSec).toBe(2);
    expect(hls.audioCodec).toBe("aac");
    expect(hls.variants.map((v) => v.label)).toEqual(["360p", "720p"]);
  });

  it("adds 1080p only for trusted creators", () => {
    const hls = buildHlsOutput({
      contentId: "content1",
      baseUrl: "https://cdn.lumora.test",
      creatorTrusted: true,
    });

    expect(hls.variants.map((v) => v.label)).toContain("1080p");
  });

  it("builds thumbnail at 1.5 seconds", () => {
    const thumbnail = buildThumbnailOutput({
      contentId: "content1",
      baseUrl: "https://cdn.lumora.test",
    });

    expect(thumbnail.thumbnailUrl).toBe("https://cdn.lumora.test/content1/thumb-001.jpg");
    expect(thumbnail.frameAtSec).toBe(1.5);
  });

  it("builds metadata with hashes and quality scores", () => {
    const metadata = buildContentMetadata({
      contentId: "content1",
      durationSec: 30,
      tags: ["nature", "calm"],
      videoQualityScore: 0.9,
      audioQualityScore: 0.8,
      processedAt: "2026-05-04T00:00:00.000Z",
    });

    expect(metadata.autoTags).toEqual(["nature", "calm"]);
    expect(metadata.perceptualHash).toBe("phash_content1");
    expect(metadata.audioFingerprint).toBe("afp_content1");
    expect(metadata.videoQualityScore).toBe(0.9);
    expect(metadata.processedAt).toBe("2026-05-04T00:00:00.000Z");
  });

  it("creates and validates complete processed output", () => {
    const output = createProcessedContentOutput({
      contentId: "content1",
      baseUrl: "https://cdn.lumora.test",
      durationSec: 30,
      tags: ["nature"],
    });

    expect(output.eventType).toBe("content.processing.complete");
    expect(validateProcessedOutput(output).ok).toBe(true);
  });
});
