import { describe, expect, it } from "vitest";
import { classifySwipeSpeed, shouldPreloadForSwipeSpeed } from "../../src/lib/native-fyp/preload/intent";
import { buildAdaptivePreloadPlan } from "../../src/lib/native-fyp/preload/plan";

const base = {
  sourceType: "lumora_generated",
  rightsStatus: "verified",
  licenseType: "lumora_generated",
  playbackUrl: "/v.mp4",
  posterUrl: "/v.jpg",
  durationSeconds: 10,
  createdAt: new Date().toISOString(),
};

describe("native fyp preload pack 001", () => {
  it("classifies rapid swipe speed", () => {
    expect(classifySwipeSpeed(4, 1000)).toBe("rapid");
  });

  it("blocks preload during rapid swipes", () => {
    expect(shouldPreloadForSwipeSpeed("rapid")).toBe(false);
  });

  it("builds wifi first segment preload plan", () => {
    const queue = Array.from({ length: 5 }).map((_, i) => ({ ...base, id: String(i), title: "v" + i }));
    const plan = buildAdaptivePreloadPlan({ queue, index: 0, network: "wifi", speed: "slow" });
    expect(plan.mode).toBe("first_segment");
    expect(plan.ids.length).toBe(2);
  });

  it("builds data saver thumbnail-only plan", () => {
    const queue = Array.from({ length: 5 }).map((_, i) => ({ ...base, id: String(i), title: "v" + i }));
    const plan = buildAdaptivePreloadPlan({ queue, index: 0, network: "data_saver", speed: "slow" });
    expect(plan.ids.length).toBe(0);
    expect(plan.mode).toBe("thumbnail_only");
  });
});
