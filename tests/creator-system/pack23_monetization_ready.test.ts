import { describe, expect, it } from "vitest";
import { createDeepEngagementEvent } from "@/src/lib/creator-system/monetization-ready/deepEngagement";
import { createQuietResonanceEvent } from "@/src/lib/creator-system/monetization-ready/quietResonance";
import { calculateInvisibleValue } from "@/src/lib/creator-system/monetization-ready/invisibleValueSignals";
import { buildSoftPreUnlockHint } from "@/src/lib/creator-system/monetization-ready/preUnlockHint";
import { evaluateMicroValueWindow } from "@/src/lib/creator-system/monetization-ready/microValueWindow";

describe("Pack23 Monetization-Ready Loop", () => {
  it("creates deep engagement event", () => {
    const event = createDeepEngagementEvent({ creatorId: "c1", witnessId: "w1", circleId: "circle1" });
    expect(event.eventType).toBe("deep-engagement");
  });

  it("creates quiet resonance event", () => {
    const event = createQuietResonanceEvent({ creatorId: "c1", witnessId: "w1", memoryId: "m1" });
    expect(event.eventType).toBe("quiet-resonance");
    expect(event.memoryId).toBe("m1");
  });

  it("tracks invisible value without public score", () => {
    const value = calculateInvisibleValue([
      { type: "deep-engagement", creatorId: "c1", witnessId: "w1", weight: 4 },
      { type: "quiet-resonance", creatorId: "c1", witnessId: "w2", weight: 3 },
    ]);

    expect(value.invisibleValueScore).toBe(7);
    expect(value.publicScoreVisible).toBe(false);
  });

  it("adds soft pre-unlock hint", () => {
    expect(buildSoftPreUnlockHint({ invisibleValueScore: 8, threshold: 10 }).visible).toBe(true);
    expect(buildSoftPreUnlockHint({ invisibleValueScore: 3, threshold: 10 }).visible).toBe(false);
  });

  it("evaluates micro-value window safely", () => {
    const open = evaluateMicroValueWindow({ invisibleValueScore: 10, threshold: 10 });
    const closed = evaluateMicroValueWindow({ invisibleValueScore: 4, threshold: 10 });

    expect(open.open).toBe(true);
    expect(open.noBackdoorMonetization).toBe(true);
    expect(closed.open).toBe(false);
  });
});
