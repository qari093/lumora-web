import { describe, expect, it } from "vitest";
import { detectNetworkMode } from "../../src/lib/native-fyp/runtime/network";
import { shouldShowShimmer, shouldSkipVideo } from "../../src/lib/native-fyp/runtime/latency";
import { ensurePlayable } from "../../src/lib/native-fyp/runtime/guard";

const base = {
  sourceType: "lumora_generated",
  rightsStatus: "verified",
  licenseType: "lumora_generated",
  playbackUrl: "/v.mp4",
  posterUrl: "/v.jpg",
  durationSeconds: 10,
  createdAt: new Date().toISOString(),
};

describe("native fyp pack 012", () => {
  it("detects network", () => {
    expect(detectNetworkMode({ isWifi: true })).toBe("wifi");
    expect(detectNetworkMode({})).toBe("cellular");
    expect(detectNetworkMode({ dataSaver: true })).toBe("data_saver");
  });

  it("latency rules", () => {
    expect(shouldShowShimmer(300)).toBe(true);
    expect(shouldSkipVideo(800)).toBe(true);
  });

  it("filters playable", () => {
    const items = [
      { ...base, id: "1", title: "a" },
      { ...base, id: "2", title: "b", playbackUrl: "" },
    ];
    const out = ensurePlayable(items);
    expect(out.length).toBe(1);
  });
});
