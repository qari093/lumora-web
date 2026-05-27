import { describe, expect, it } from "vitest";
import { createInitialMemory, updateMemory } from "../../src/lib/native-fyp/runtime/memory";
import { handleFailure } from "../../src/lib/native-fyp/runtime/failure";

const base = {
  sourceType: "lumora_generated",
  rightsStatus: "verified",
  licenseType: "lumora_generated",
  playbackUrl: "/v.mp4",
  posterUrl: "/v.jpg",
  durationSeconds: 10,
  createdAt: new Date().toISOString(),
};

describe("native fyp pack 011", () => {
  it("initial memory empty", () => {
    const m = createInitialMemory();
    expect(m.current.id).toBe(null);
  });

  it("updates memory", () => {
    const m = updateMemory(createInitialMemory(), "1", "2", "3");
    expect(m.current.id).toBe("2");
    expect(m.prev.id).toBe("1");
    expect(m.next.id).toBe("3");
  });

  it("removes failed item", () => {
    const items = [
      { ...base, id: "1", title: "a" },
      { ...base, id: "2", title: "b" },
    ];
    const out = handleFailure(items, "1");
    expect(out.length).toBe(1);
    expect(out[0].id).toBe("2");
  });
});
