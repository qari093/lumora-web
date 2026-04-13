export type PredictionPickBoostInput = {
  fairnessScore: number;
  totalPredictions: number;
  predictionVelocity: number;
  culturalScore: number;
  rightsScore: number;
  safetyOverrideActive: boolean;
};

export type PredictionPickBoostDecision = {
  boostAllowed: boolean;
  boostScore: number;
  tier: "none" | "soft" | "strong" | "spotlight";
  reason:
    | "ok"
    | "safety_override_active"
    | "low_rights"
    | "low_cultural_confidence"
    | "low_fairness"
    | "insufficient_activity";
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function resolvePredictionPickBoost(
  input: PredictionPickBoostInput
): PredictionPickBoostDecision {
  if (input.safetyOverrideActive) {
    return {
      boostAllowed: false,
      boostScore: 0,
      tier: "none",
      reason: "safety_override_active",
    };
  }

  if (input.rightsScore < 60) {
    return {
      boostAllowed: false,
      boostScore: 0,
      tier: "none",
      reason: "low_rights",
    };
  }

  if (input.culturalScore < 55) {
    return {
      boostAllowed: false,
      boostScore: 0,
      tier: "none",
      reason: "low_cultural_confidence",
    };
  }

  if (input.fairnessScore < 60) {
    return {
      boostAllowed: false,
      boostScore: 0,
      tier: "none",
      reason: "low_fairness",
    };
  }

  const boostScore = clampScore(
    input.fairnessScore * 0.4 +
      Math.min(input.totalPredictions, 5000) * 0.01 +
      input.predictionVelocity * 0.35
  );

  if (boostScore < 45) {
    return {
      boostAllowed: false,
      boostScore,
      tier: "none",
      reason: "insufficient_activity",
    };
  }

  return {
    boostAllowed: true,
    boostScore,
    tier:
      boostScore >= 85
        ? "spotlight"
        : boostScore >= 70
        ? "strong"
        : "soft",
    reason: "ok",
  };
}

export function canBoostPredictionPick(
  input: PredictionPickBoostInput
): boolean {
  return resolvePredictionPickBoost(input).boostAllowed;
}
