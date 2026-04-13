export type ConfidenceRecalibrationInput = {
  currentConfidence: number;
  hitRate: number;
  missRate: number;
  falsePositiveRate: number;
  volatilityScore: number;
};

export type ConfidenceRecalibrationResult = {
  recalibratedConfidence: number;
  adjustment: number;
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function recalibrateConfidence(
  input: ConfidenceRecalibrationInput
): ConfidenceRecalibrationResult {
  const boost = input.hitRate * 0.12;
  const penalty =
    input.missRate * 0.15 +
    input.falsePositiveRate * 0.2 +
    input.volatilityScore * 0.08;

  const recalibratedConfidence = clampScore(
    input.currentConfidence + boost - penalty
  );

  return {
    recalibratedConfidence,
    adjustment: recalibratedConfidence - clampScore(input.currentConfidence),
  };
}

export function hasConfidenceImproved(
  result: ConfidenceRecalibrationResult
): boolean {
  return result.adjustment > 0;
}
