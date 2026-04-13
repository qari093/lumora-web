export type IdentityAdaptationLoopInput = {
  priorIntensity: "low" | "balanced" | "high";
  priorAffinityStrength: number;
  skipRate: number;
  saveRate: number;
  fatigueScore: number;
  noveltyAcceptanceScore: number;
};

export type IdentityAdaptationLoopResult = {
  nextIntensity: "low" | "balanced" | "high";
  affinityAdjustment: number;
  reason:
    | "high_fatigue"
    | "high_novelty_acceptance"
    | "low_novelty_acceptance"
    | "stable";
};

function clampDelta(value: number): number {
  return Math.max(-20, Math.min(20, Math.round(value)));
}

export function adaptIdentityProfile(
  input: IdentityAdaptationLoopInput
): IdentityAdaptationLoopResult {
  if (input.fatigueScore >= 75 || input.skipRate >= 70) {
    return {
      nextIntensity: "low",
      affinityAdjustment: clampDelta(10),
      reason: "high_fatigue",
    };
  }

  if (input.noveltyAcceptanceScore >= 70 && input.saveRate >= 25) {
    return {
      nextIntensity: "high",
      affinityAdjustment: clampDelta(-8),
      reason: "high_novelty_acceptance",
    };
  }

  if (input.noveltyAcceptanceScore <= 35 || input.skipRate >= 55) {
    return {
      nextIntensity: "balanced",
      affinityAdjustment: clampDelta(6),
      reason: "low_novelty_acceptance",
    };
  }

  return {
    nextIntensity: input.priorIntensity,
    affinityAdjustment: clampDelta(0),
    reason: "stable",
  };
}

export function shouldAdaptIdentityProfile(
  input: IdentityAdaptationLoopInput
): boolean {
  const result = adaptIdentityProfile(input);
  return result.reason !== "stable";
}
