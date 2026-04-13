import { describe, expect, it } from "vitest";
import { validateCreativeAsset } from "@/lib/ads/creativeAssets";

describe("creative asset handling", () => {
  it("accepts a valid image asset", () => {
    const out = validateCreativeAsset({
      creativeId: "creative_1",
      vendorId: "vendor_1",
      filename: "banner.png",
      mimeType: "image/png",
      sizeBytes: 1024 * 1024,
      width: 1080,
      height: 1350,
      durationMs: 0,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.asset.assetType).toBe("image");
      expect(out.asset.durationMs).toBe(0);
    }
  });

  it("accepts a valid video asset", () => {
    const out = validateCreativeAsset({
      creativeId: "creative_2",
      vendorId: "vendor_1",
      filename: "spot.mp4",
      mimeType: "video/mp4",
      sizeBytes: 25 * 1024 * 1024,
      width: 1080,
      height: 1920,
      durationMs: 15000,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.asset.assetType).toBe("video");
      expect(out.asset.durationMs).toBe(15000);
    }
  });

  it("rejects unsupported mime type", () => {
    const out = validateCreativeAsset({
      creativeId: "creative_3",
      vendorId: "vendor_1",
      filename: "doc.pdf",
      mimeType: "application/pdf",
      sizeBytes: 1000,
      width: 100,
      height: 100,
      durationMs: 0,
    });

    expect(out).toEqual({ ok: false, reason: "unsupported_mime_type" });
  });

  it("rejects oversized image", () => {
    const out = validateCreativeAsset({
      creativeId: "creative_4",
      vendorId: "vendor_1",
      filename: "huge.jpg",
      mimeType: "image/jpeg",
      sizeBytes: 11 * 1024 * 1024,
      width: 1080,
      height: 1080,
      durationMs: 0,
    });

    expect(out).toEqual({ ok: false, reason: "image_too_large" });
  });

  it("rejects video without duration", () => {
    const out = validateCreativeAsset({
      creativeId: "creative_5",
      vendorId: "vendor_1",
      filename: "clip.webm",
      mimeType: "video/webm",
      sizeBytes: 5 * 1024 * 1024,
      width: 720,
      height: 1280,
      durationMs: 0,
    });

    expect(out).toEqual({ ok: false, reason: "invalid_video_duration" });
  });
});
