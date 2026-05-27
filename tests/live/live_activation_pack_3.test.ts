import { describe, expect, it } from "vitest";
import { createLivePresence, isGhostPresence } from "../../src/live/presence/livePresence";

describe("Lumora Live Activation Pack 3", () => {
  it("creates visible and ghost presence states", () => {
    expect(isGhostPresence(createLivePresence("r1", "u1", "ghost"))).toBe(true);
    expect(isGhostPresence(createLivePresence("r1", "u1", "visible"))).toBe(false);
  });
});
