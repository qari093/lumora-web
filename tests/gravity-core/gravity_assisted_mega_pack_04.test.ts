import { describe, expect, it } from "vitest";
import {
  analyzeAssistedTelemetry,
  computeAssistedThresholdPatch,
  evaluateAssistedLearning,
  type GravityShadowTelemetryEvent,
} from "@/src/core/gravity-core";

describe("Gravity Assisted Mega Pack 4/5", () => {
  it("evaluates learning metrics but keeps learning disabled", () => {
    const result = evaluateAssistedLearning({
      attempts: 100,
      successfulRecognitions: 96,
      falsePositives: 2,
      frustrationEvents: 4,
      exposures: 120,
    });

    expect(result.integrated).toBe(true);
    expect(result.learningEnabled).toBe(false);
    expect(result.accuracy).toBeGreaterThanOrEqual(0.95);
    expect(result.canUnlockAssisted).toBe(true);
  });

  it("blocks unlock when exposure is insufficient", () => {
    const result = evaluateAssistedLearning({
      attempts: 10,
      successfulRecognitions: 10,
      falsePositives: 0,
      frustrationEvents: 0,
      exposures: 20,
    });

    expect(result.canTuneThresholds).toBe(false);
    expect(result.canUnlockAssisted).toBe(false);
  });

  it("recommends stricter threshold when false positives are high", () => {
    const learning = evaluateAssistedLearning({
      attempts: 100,
      successfulRecognitions: 94,
      falsePositives: 8,
      frustrationEvents: 2,
      exposures: 120,
    });

    const patch = computeAssistedThresholdPatch(learning);

    expect(patch.patchAllowed).toBe(true);
    expect(patch.intentThresholdDelta).toBeGreaterThan(0);
    expect(patch.reason).toBe("reduce_false_positives");
  });

  it("recommends softer threshold when frustration is high", () => {
    const learning = evaluateAssistedLearning({
      attempts: 100,
      successfulRecognitions: 95,
      falsePositives: 1,
      frustrationEvents: 20,
      exposures: 120,
    });

    const patch = computeAssistedThresholdPatch(learning);

    expect(patch.patchAllowed).toBe(true);
    expect(patch.proximityPxDelta).toBeGreaterThan(0);
    expect(patch.reason).toBe("reduce_frustration");
  });

  it("analyzes telemetry into learning metrics", () => {
    const events: GravityShadowTelemetryEvent[] = [
      { type: "gesture_attempt", ts: 1, state: "intent", intentScore: 0.8, confidence: 0.8, proximity: 0.9, velocity: 1, shadowOnly: true },
      { type: "ring_visible", ts: 2, state: "intent", intentScore: 0.9, confidence: 0.9, proximity: 0.9, velocity: 1, shadowOnly: true },
      { type: "haptic_confirm", ts: 3, state: "intent", intentScore: 0.9, confidence: 0.9, proximity: 0.9, velocity: 1, shadowOnly: true },
    ];

    const result = analyzeAssistedTelemetry(events);

    expect(result.integrated).toBe(true);
    expect(result.accuracy).toBeGreaterThan(0);
  });
});
