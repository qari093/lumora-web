import { describe, expect, it } from "vitest";
import { lockVideoProcessingPipeline } from "../../lib/video/videoProcessingPipeline";

describe("video processing pipeline", () => {
  const base = {
    id: "vid_1",
    creatorId: "creator_1",
    sourceUrl: "https://cdn.example.com/v.mp4",
    mimeType: "video/mp4" as const,
    durationSec: 45,
    createdAt: Date.now()
  };

  it("moves uploaded to queued", () => {
    const result = lockVideoProcessingPipeline({ ...base, status: "uploaded" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.nextStatus).toBe("queued");
      expect(result.jobType).toBe("transcode");
    }
  });

  it("moves queued to processing", () => {
    const result = lockVideoProcessingPipeline({ ...base, status: "queued" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.nextStatus).toBe("processing");
      expect(result.jobType).toBe("thumbnail");
    }
  });

  it("moves processing to ready", () => {
    const result = lockVideoProcessingPipeline({ ...base, status: "processing" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.nextStatus).toBe("ready");
      expect(result.jobType).toBe("finalize");
    }
  });

  it("rejects invalid duration", () => {
    const result = lockVideoProcessingPipeline({
      ...base,
      durationSec: 0,
      status: "uploaded"
    });
    expect(result).toEqual({ ok: false, error: "invalid_duration" });
  });

  it("rejects unsupported mime type", () => {
    const result = lockVideoProcessingPipeline({
      ...base,
      mimeType: "image/png",
      status: "uploaded"
    });
    expect(result).toEqual({ ok: false, error: "unsupported_mime_type" });
  });
});
