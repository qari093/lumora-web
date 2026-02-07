import { describe, it, expect } from "vitest";
import { getFypHealth } from "../../lib/fyp/runtime";

describe("FYP runtime health", () => {
  it("returns valid health object", () => {
    const h = getFypHealth();
    expect(h.ok).toBe(true);
    expect(["seed", "live", "shadow"]).toContain(h.mode);
    expect(typeof h.items).toBe("number");
    expect(typeof h.ts).toBe("number");
  });
});
