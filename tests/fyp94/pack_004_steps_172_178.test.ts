import { describe, expect, it } from "vitest";
import { validateFyp94AspectRatio, validateFyp94Duration, validateFyp94Mime } from "../../src/lib/fyp94/media/validate";
import { buildFyp94PosterUrl, createFyp94PosterJob } from "../../src/lib/fyp94/media/poster";
import { buildFyp94AssetStorageKey, buildFyp94StoredAssetUrl } from "../../src/lib/fyp94/media/storage";
import { registerFyp94ProcessedAsset } from "../../src/lib/fyp94/media/register";

describe("FYP 9.4 Pack 004 — Media Processing", () => {
  it("validates MP4, duration, and vertical aspect", () => {
    expect(validateFyp94Mime("video/mp4")).toBe(true);
    expect(validateFyp94Mime("video/webm")).toBe(false);
    expect(validateFyp94Duration(18)).toBe(true);
    expect(validateFyp94Duration(90)).toBe(false);
    expect(validateFyp94AspectRatio(720, 1280)).toBe(true);
    expect(validateFyp94AspectRatio(1280, 720)).toBe(false);
  });

  it("creates poster job", () => {
    const job = createFyp94PosterJob({ assetId: "a:1", mp4Url: "/a.mp4" });
    expect(job.strategy).toBe("first_frame");
    expect(job.outputUrl).toBe("/native-fyp/posters/a_1.jpg");
    expect(buildFyp94PosterUrl("clip/1")).toBe("/native-fyp/posters/clip_1.jpg");
  });

  it("builds safe storage key and URL", () => {
    const key = buildFyp94AssetStorageKey({
      source: "pexels",
      assetId: "a:1",
      filename: "clip one.mp4",
    });

    expect(key).toBe("fyp94/pexels/a_1/clip_one.mp4");
    expect(buildFyp94StoredAssetUrl(key)).toContain(key);
  });

  it("registers processed asset", () => {
    const asset = registerFyp94ProcessedAsset({
      assetId: "asset_1",
      source: "pexels",
      licenseType: "royalty_free_commercial",
      title: "Parkour jump",
      mp4Url: "/native-fyp/assets/asset_1.mp4",
      width: 720,
      height: 1280,
      durationSeconds: 22,
      mimeType: "video/mp4",
    });

    expect(asset.posterUrl).toContain("asset_1.jpg");
    expect(asset.aspectRatio).toBe("vertical");
    expect(asset.mimeType).toBe("video/mp4");
  });

  it("blocks invalid processed content", () => {
    expect(() =>
      registerFyp94ProcessedAsset({
        assetId: "bad",
        source: "pexels",
        licenseType: "royalty_free_commercial",
        title: "bad",
        mp4Url: "/bad.webm",
        width: 1280,
        height: 720,
        durationSeconds: 90,
        mimeType: "video/webm",
      }),
    ).toThrow();
  });
});
