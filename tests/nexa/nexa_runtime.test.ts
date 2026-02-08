import { describe, expect, it } from "vitest";
import { getNexaRuntimeHealth } from "../../lib/nexa/runtime";

describe("NEXA runtime health", () => {
  it("returns valid health object", () => {
    const h = getNexaRuntimeHealth();
    expect(h.ok).toBe(true);
    expect(h.service).toBe("nexa");
    expect(typeof h.ts).toBe("number");
    expect(h.ts).toBeGreaterThan(0);
    expect(typeof h.version).toBe("string");
    expect(h.version.length).toBeGreaterThan(0);
  });
});
