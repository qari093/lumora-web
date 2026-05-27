import { describe, expect, it } from "vitest";
import { buildRankedQueue, scoreVideo } from "../../src/lib/native-fyp/feed/ranking";
import { ensureQueueSize } from "../../src/lib/native-fyp/feed/queue";

const base = {
  sourceType: "lumora_generated",
  rightsStatus: "verified",
  licenseType: "lumora_generated",
  playbackUrl: "/native-fyp/demo.mp4",
  posterUrl: "/native-fyp/demo.jpg",
  durationSeconds: 10,
  createdAt: new Date().toISOString(),
};

describe("native fyp pack 006", () => {
  it("scores videos", () => {
    const s = scoreVideo({ ...base, id: "1", title: "a" });
    expect(typeof s).toBe("number");
  });

  it("returns 20 ranked items", () => {
    const items = Array.from({ length: 25 }).map((_, i) => ({
      ...base,
      id: String(i),
      title: "v" + i,
    }));
    const ranked = buildRankedQueue(items);
    expect(ranked.length).toBe(20);
  });

  it("ensures queue size", () => {
    const items = [
      { ...base, id: "1", title: "x" },
      { ...base, id: "2", title: "y" },
    ];
    const q = ensureQueueSize(items, 20);
    expect(q.length).toBe(20);
  });
});
