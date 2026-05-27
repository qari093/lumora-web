import { describe, expect, it } from "vitest";
import { resolveNativeFypPublicUrl } from "../../src/lib/native-fyp/media/config";
import { checkNativeFypStorageHealth } from "../../src/lib/native-fyp/media/health";
import { assertAcceptedNativeFypVideoMime, isAcceptedNativeFypVideoMime } from "../../src/lib/native-fyp/media/mp4";
import { validateNativeFypDuration } from "../../src/lib/native-fyp/media/duration";
import { buildNativeFypPosterKey, buildNativeFypPosterUrl } from "../../src/lib/native-fyp/media/poster";
import { createLocalNativeFypStorage } from "../../src/lib/native-fyp/storage/local";

describe("native fyp pack 004", () => {
  it("resolves public CDN urls", () => {
    expect(resolveNativeFypPublicUrl("clips/a.mp4", { publicBaseUrl: "https://cdn.test/" })).toBe("https://cdn.test/clips/a.mp4");
  });

  it("checks storage health", async () => {
    const health = await checkNativeFypStorageHealth(createLocalNativeFypStorage("tmp/native-fyp-health"));
    expect(health.ok).toBe(true);
  });

  it("accepts MP4 first", () => {
    expect(isAcceptedNativeFypVideoMime("video/mp4")).toBe(true);
    expect(isAcceptedNativeFypVideoMime("video/webm")).toBe(false);
    expect(() => assertAcceptedNativeFypVideoMime("video/webm")).toThrow();
  });

  it("validates duration limits", () => {
    expect(validateNativeFypDuration(20).ok).toBe(true);
    expect(validateNativeFypDuration(1).ok).toBe(false);
    expect(validateNativeFypDuration(121).ok).toBe(false);
  });

  it("generates poster key and url", () => {
    expect(buildNativeFypPosterKey({ userId: "u/1", videoId: "v:1" })).toBe("posters/u_1/v_1.jpg");
    expect(buildNativeFypPosterUrl({ userId: "u1", videoId: "v1", publicBaseUrl: "https://cdn.test" })).toBe("https://cdn.test/posters/u1/v1.jpg");
  });
});
