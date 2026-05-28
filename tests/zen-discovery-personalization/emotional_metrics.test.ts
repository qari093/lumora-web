import { describe, expect, it } from "vitest";
import { calculateEmotionalRetentionSignals } from "@/lib/emotional-metrics/retentionSignals";

describe("emotional metrics", () => {
  it("calculates retention signals without dark patterns", () => {
    const signals = calculateEmotionalRetentionSignals({
      sessionSeconds: 420,
      replayCount: 2,
      vaultSaves: 2,
      skippedCount: 1,
      completedSession: true
    });

    expect(signals.returnVelocityScore).toBeGreaterThan(50);
    expect(signals.fatigueRisk).toBe("low");
  });
});
