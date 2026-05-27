import { describe, expect, it } from "vitest";

import { createAtmosphericMotionProfile } from "@/src/core/fyp/ux/atmosphericMotion";
import { calculateFeedRhythm } from "@/src/core/fyp/flow/feedRhythm";
import { buildEmotionalArc } from "@/src/core/fyp/flow/emotionalArc";
import { detectEmotionalOverload, recommendRecoveryCopy } from "@/src/core/fyp/flow/overloadGuard";
import { createFeedSession, updateEmotionalLoad } from "@/src/core/fyp/session/sessionEngine";

describe("Lumora FYP Feed Flow + Atmospheric UX", () => {
  const items = [
    { id: "a", creatorId: "c1", mode: "drift" as const, intensity: 5, replayWeight: 3, novelty: 4, createdAt: 1 },
    { id: "b", creatorId: "c2", mode: "drift" as const, intensity: 6, replayWeight: 4, novelty: 5, createdAt: 2 },
    { id: "c", creatorId: "c3", mode: "comfort" as const, intensity: 4, replayWeight: 2, novelty: 3, createdAt: 3 }
  ];

  it("creates atmospheric motion profile", () => {
    const profile = createAtmosphericMotionProfile("drift");

    expect(profile.mode).toBe("drift");
    expect(profile.transitionMs).toBeGreaterThan(0);
    expect(profile.breathingSpace).toBeGreaterThan(0);
  });

  it("calculates feed rhythm", () => {
    const rhythm = calculateFeedRhythm(items);

    expect(rhythm.averageIntensity).toBeGreaterThan(0);
    expect(rhythm.nextAction).toBe("pulse_allowed");
  });

  it("builds stable emotional arc", () => {
    const arc = buildEmotionalArc(items);

    expect(arc.itemCount).toBe(3);
    expect(arc.stable).toBe(true);
  });

  it("detects overload and recommends recovery copy", () => {
    const session = updateEmotionalLoad(createFeedSession("waqar"), 85);

    expect(detectEmotionalOverload(session)).toBe(true);
    expect(recommendRecoveryCopy(session)).toContain("atmosphere");
  });
});
