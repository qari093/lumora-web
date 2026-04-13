export type IdentityDiscoveryIntensityInput = {
  explicitPreference?: "low" | "balanced" | "high";
  noveltyAcceptanceScore: number;
  skipRate: number;
  saveRate: number;
  fatigueScore: number;
};

export type IdentityDiscoveryIntensityDecision = {
  intensity: "low" | "balanced" | "high";
  reason:
    | "explicit_preference"
    | "high_fatigue"
    | "high_novelty_acceptance"
    | "low_novelty_acceptance"
    | "default_balanced";
};

export function resolveIdentityDiscoveryIntensity(
  input: IdentityDiscoveryIntensityInput
): IdentityDiscoveryIntensityDecision {
  if (input.explicitPreference) {
    return {
      intensity: input.explicitPreference,
      reason: "explicit_preference",
    };
  }

  if (input.fatigueScore >= 75) {
    return {
      intensity: "low",
      reason: "high_fatigue",
    };
  }

  if (input.noveltyAcceptanceScore >= 70 && input.saveRate >= 25 && input.skipRate <= 35) {
    return {
      intensity: "high",
      reason: "high_novelty_acceptance",
    };
  }

  if (input.noveltyAcceptanceScore <= 35 || input.skipRate >= 65) {
    return {
      intensity: "low",
      reason: "low_novelty_acceptance",
    };
  }

  return {
    intensity: "balanced",
    reason: "default_balanced",
  };
}

export function prefersHighDiscoveryIntensity(
  input: IdentityDiscoveryIntensityInput
): boolean {
  return resolveIdentityDiscoveryIntensity(input).intensity === "high";
}
