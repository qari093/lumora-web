import { describe, it, expect } from "vitest";
import { getLiveHealth } from "../../lib/live/runtime";

describe("Live runtime health", () => {
  it("returns valid health object", () => {
    const h = getLiveHealth();
    expect(h.ok).toBe(true);
    expect(typeof h.roomsActive).toBe("number");
    expect(typeof h.listeners).toBe("number");
    expect(typeof h.ts).toBe("number");
  });
});
