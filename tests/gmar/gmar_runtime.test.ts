import { describe, it, expect } from "vitest";
import { getGmarHealth } from "../../lib/gmar/runtime";

describe("GMAR runtime health", () => {
  it("returns valid health object", () => {
    const h = getGmarHealth();
    expect(h.ok).toBe(true);
    expect(["seed", "live", "shadow"]).toContain(h.mode);
    expect(typeof h.games).toBe("number");
    expect(typeof h.ts).toBe("number");
  });
});
