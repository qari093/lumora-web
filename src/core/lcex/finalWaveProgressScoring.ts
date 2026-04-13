export type FinalWaveProgressScoringInput = {
  completionScore: number;
  verificationScore: number;
  closeoutScore: number;
  launchCorridorScore: number;
  blockerPenalty: number;
};

export type FinalWaveProgressScoringResult = {
  score: number;
  tier: "early" | "advancing" | "finalizing" | "near-complete";
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function scoreFinalWaveProgress(
  input: FinalWaveProgressScoringInput
): FinalWaveProgressScoringResult {
  const score = clampScore(
    input.completionScore * 0.3 +
      input.verificationScore * 0.25 +
      input.closeoutScore * 0.2 +
      input.launchCorridorScore * 0.25 -
      input.blockerPenalty
  );

  return {
    score,
    tier:
      score >= 92
        ? "near-complete"
        : score >= 80
        ? "finalizing"
        : score >= 60
        ? "advancing"
        : "early",
  };
}

export function isFinalWaveNearComplete(
  input: FinalWaveProgressScoringInput
): boolean {
  const result = scoreFinalWaveProgress(input);
  return result.tier === "near-complete" || result.tier === "finalizing";
}
