import { describe, it, expect } from "vitest";
import { getNexaHealth } from "../../lib/nexa/runtime";

describe("NEXA runtime health", () => {
  it("returns valid health object", () => {
    const h = getNexaHealth();
    expect(h.ok).toBe(true);
    expect(["seed", "live", "shadow"]).toContain(h.mode);
    expect(typeof h.modules).toBe("number");
    expect(typeof h.ts).toBe("number");
  });
});
