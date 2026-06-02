import type { GravityAssistedLearningResult } from "./assistedLearning";

export type GravityAssistedThresholdPatch = {
  integrated: boolean;
  patchAllowed: boolean;
  proximityPxDelta: number;
  intentThresholdDelta: number;
  reason: string;
};

export function computeAssistedThresholdPatch(learning: GravityAssistedLearningResult): GravityAssistedThresholdPatch {
  if (!learning.canTuneThresholds) {
    return {
      integrated: true,
      patchAllowed: false,
      proximityPxDelta: 0,
      intentThresholdDelta: 0,
      reason: "insufficient_exposure",
    };
  }

  if (learning.falsePositiveRate > 0.03) {
    return {
      integrated: true,
      patchAllowed: true,
      proximityPxDelta: -10,
      intentThresholdDelta: 0.04,
      reason: "reduce_false_positives",
    };
  }

  if (learning.frustrationRate > 0.08) {
    return {
      integrated: true,
      patchAllowed: true,
      proximityPxDelta: 12,
      intentThresholdDelta: -0.03,
      reason: "reduce_frustration",
    };
  }

  return {
    integrated: true,
    patchAllowed: true,
    proximityPxDelta: 0,
    intentThresholdDelta: 0,
    reason: "stable",
  };
}
