import { describe, it, expect } from "vitest";
import { nextFirstBreathState } from "@/src/lib/creator-system/onboarding/firstBreathFlow";
import { selectWitnessName } from "@/src/lib/creator-system/onboarding/witnessNameSelection";
import { getSimulatedCirclePreview } from "@/src/lib/creator-system/onboarding/simulatedCircle";
import { teachGestures } from "@/src/lib/creator-system/onboarding/gestureLearning";
import { routeToPhantomCircle } from "@/src/lib/creator-system/onboarding/phantomEntry";

describe("Pack03 First Breath", () => {
  it("progresses onboarding flow", () => {
    expect(nextFirstBreathState("entry")).toBe("name-selection");
  });

  it("validates witness name selection", () => {
    expect(selectWitnessName("Nova").ok).toBe(true);
    expect(selectWitnessName("x").ok).toBe(false);
  });

  it("provides simulated circle preview", () => {
    const c = getSimulatedCirclePreview();
    expect(c.participants).toBeGreaterThan(0);
  });

  it("teaches gestures", () => {
    const g = teachGestures();
    expect(g).toContain("tap");
  });

  it("routes to phantom circle", () => {
    const r = routeToPhantomCircle("u1");
    expect(r.destination).toBe("phantom-circle");
  });
});
