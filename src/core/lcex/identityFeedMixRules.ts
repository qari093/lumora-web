export type IdentityFeedMixMode = "low" | "balanced" | "high";

export type IdentityFeedMixRulesInput = {
  intensity: IdentityFeedMixMode;
  affinityStrength: number;
  noveltyTolerance: number;
  fatigueScore: number;
};

export type IdentityFeedMixRulesDecision = {
  knownRatio: number;
  adjacentRatio: number;
  novelRatio: number;
  reason:
    | "high_fatigue"
    | "low_intensity"
    | "balanced_intensity"
    | "high_intensity";
};

function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function resolveIdentityFeedMix(
  input: IdentityFeedMixRulesInput
): IdentityFeedMixRulesDecision {
  if (input.fatigueScore >= 75) {
    return {
      knownRatio: 75,
      adjacentRatio: 20,
      novelRatio: 5,
      reason: "high_fatigue",
    };
  }

  if (input.intensity === "low") {
    return {
      knownRatio: 70,
      adjacentRatio: 20,
      novelRatio: 10,
      reason: "low_intensity",
    };
  }

  if (input.intensity === "high") {
    const novelRatio = clampPercent(25 + input.noveltyTolerance * 0.2);
    const adjacentRatio = clampPercent(25 + (100 - input.affinityStrength) * 0.05);
    const knownRatio = clampPercent(100 - novelRatio - adjacentRatio);

    return {
      knownRatio,
      adjacentRatio,
      novelRatio,
      reason: "high_intensity",
    };
  }

  return {
    knownRatio: 55,
    adjacentRatio: 25,
    novelRatio: 20,
    reason: "balanced_intensity",
  };
}

export function prefersNovelHeavyFeedMix(
  input: IdentityFeedMixRulesInput
): boolean {
  return resolveIdentityFeedMix(input).novelRatio >= 25;
}
