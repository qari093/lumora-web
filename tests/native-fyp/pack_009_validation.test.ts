import { describe, expect, it } from "vitest";
import { createInitialQueue } from "../../src/lib/native-fyp/runtime/queue";
import { buildWindow } from "../../src/lib/native-fyp/runtime/window";
import { getNextIndex } from "../../src/lib/native-fyp/runtime/swipe";

const base = {
  sourceType: "lumora_generated",
  rightsStatus: "verified",
  licenseType: "lumora_generated",
  playbackUrl: "/v.mp4",
  posterUrl: "/v.jpg",
  durationSeconds: 10,
  createdAt: new Date().toISOString(),
};

describe("native fyp pack 009", () => {
  it("creates queue", () => {
    const items = Array.from({ length: 30 }).map((_, i) => ({
      ...base,
      id: String(i),
      title: "v" + i,
    }));
    const q = createInitialQueue(items);
    expect(q.length).toBe(20);
  });

  it("builds window", () => {
    const items = Array.from({ length: 5 }).map((_, i) => ({
      ...base,
      id: String(i),
      title: "v" + i,
    }));
    const w = buildWindow(items, 2);
    expect(w.current.id).toBe("2");
    expect(w.prev?.id).toBe("1");
    expect(w.next?.id).toBe("3");
  });

  it("handles swipe index", () => {
    expect(getNextIndex(0, "up", 10)).toBe(1);
    expect(getNextIndex(0, "down", 10)).toBe(0);
  });
});
