import { describe, it, expect } from "vitest";
import { getVideosHealth } from "../../lib/videos/runtime";

describe("Videos runtime health", () => {
  it("returns valid health object", () => {
    const h = getVideosHealth();
    expect(h.ok).toBe(true);
    expect(["seed", "live", "shadow"]).toContain(h.mode);
    expect(typeof h.items).toBe("number");
    expect(typeof h.ts).toBe("number");
  });
});
