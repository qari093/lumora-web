import { describe, expect, it } from "vitest";
import { antiFatigue } from "@/src/core/gmar-cohesion/safety/antiFatigue";
import { antiCheatBoundary } from "@/src/core/gmar-cohesion/safety/antiCheatBoundary";
import { soundtrackCohesion } from "@/src/core/gmar-cohesion/experience/soundtrackCohesion";

describe("gmar experience safety", () => {
  it("supports anti fatigue", () => {
    expect(antiFatigue.cooldownAware).toBe(true);
  });

  it("flags suspicious score for review only", () => {
    expect(antiCheatBoundary(95).suspicious).toBe(true);
  });

  it("resolves active soundtrack", () => {
    expect(soundtrackCohesion(90)).toBe("active");
  });
});
