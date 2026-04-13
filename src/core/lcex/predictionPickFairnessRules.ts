export type PredictionPickFairnessInput = {
  optionWeights: number[];
  totalPredictions: number;
  culturalScore: number;
  rightsScore: number;
  safetyOverrideActive: boolean;
};

export type PredictionPickFairnessDecision = {
  fair: boolean;
  fairnessScore: number;
  reason:
    | "ok"
    | "safety_override_active"
    | "low_rights"
    | "low_cultural_confidence"
    | "option_distribution_too_skewed"
    | "insufficient_predictions";
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function resolvePredictionPickFairness(
  input: PredictionPickFairnessInput
): PredictionPickFairnessDecision {
  if (input.safetyOverrideActive) {
    return {
      fair: false,
      fairnessScore: 0,
      reason: "safety_override_active",
    };
  }

  if (input.rightsScore < 60) {
    return {
      fair: false,
      fairnessScore: 0,
      reason: "low_rights",
    };
  }

  if (input.culturalScore < 55) {
    return {
      fair: false,
      fairnessScore: 0,
      reason: "low_cultural_confidence",
    };
  }

  if (input.totalPredictions < 10) {
    return {
      fair: false,
      fairnessScore: 0,
      reason: "insufficient_predictions",
    };
  }

  const normalized = input.optionWeights
    .map((value) => Math.max(0, value))
    .filter((value) => Number.isFinite(value));

  if (normalized.length < 2) {
    return {
      fair: false,
      fairnessScore: 0,
      reason: "option_distribution_too_skewed",
    };
  }

  const maxWeight = Math.max(...normalized);
  const minWeight = Math.min(...normalized);
  const spread = maxWeight - minWeight;
  const fairnessScore = clampScore(100 - spread * 100);

  if (fairnessScore < 60) {
    return {
      fair: false,
      fairnessScore,
      reason: "option_distribution_too_skewed",
    };
  }

  return {
    fair: true,
    fairnessScore,
    reason: "ok",
  };
}

export function isPredictionPickFair(
  input: PredictionPickFairnessInput
): boolean {
  return resolvePredictionPickFairness(input).fair;
}
