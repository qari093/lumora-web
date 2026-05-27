import { describe, expect, it } from "vitest";
import { createLiveSpark, normalizeAuraIntensity } from "../../src/live/interactions/liveInteractions";
import { decideLiveSafety } from "../../src/live/safety/liveSafetyRuntime";

describe("Lumora Live Activation Pack 4", () => {
  it("normalizes interaction intensity", () => {
    expect(normalizeAuraIntensity(120)).toBe(100);
    expect(normalizeAuraIntensity(-1)).toBe(0);
  });

  it("creates 9-second Live Spark interaction", () => {
    expect(createLiveSpark("r1", "u1")).toEqual({ type: "spark", roomId: "r1", userId: "u1", seconds: 9 });
  });

  it("routes unsafe rooms to moderator review", () => {
    expect(decideLiveSafety({ toxicity: 90, spamVelocity: 70, emotionalEscalation: 80 })).toBe("moderator_review");
    expect(decideLiveSafety({ toxicity: 5, spamVelocity: 5, emotionalEscalation: 5 })).toBe("allow");
  });
});
