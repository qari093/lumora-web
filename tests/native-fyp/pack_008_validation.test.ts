import { describe, expect, it } from "vitest";
import { createEvent } from "../../src/lib/native-fyp/behavior/events";
import { scoreAdjustment } from "../../src/lib/native-fyp/behavior/score";
import { reorderQueue } from "../../src/lib/native-fyp/behavior/reorder";

const base = {
  sourceType: "lumora_generated",
  rightsStatus: "verified",
  licenseType: "lumora_generated",
  playbackUrl: "/v.mp4",
  posterUrl: "/v.jpg",
  durationSeconds: 10,
  createdAt: new Date().toISOString(),
};

describe("native fyp pack 008", () => {
  it("creates events", () => {
    const e = createEvent({ type: "view", id: "1", duration: 10 });
    expect(e.ts).toBeDefined();
  });

  it("scores behavior", () => {
    const scores = scoreAdjustment([
      { type: "view", id: "1", duration: 10 },
      { type: "skip", id: "2" },
    ]);
    expect(scores["1"]).toBeGreaterThan(0);
    expect(scores["2"]).toBeLessThan(0);
  });

  it("reorders queue", () => {
    const items = [
      { ...base, id: "1", title: "a" },
      { ...base, id: "2", title: "b" },
    ];
    const scores = { "2": 10, "1": 1 };
    const out = reorderQueue(items, scores);
    expect(out[0].id).toBe("2");
  });
});
