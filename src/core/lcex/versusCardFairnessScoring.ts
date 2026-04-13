export type VersusCardFairnessInput = {
  leftTrendScore: number;
  rightTrendScore: number;
  leftConfidenceScore: number;
  rightConfidenceScore: number;
  leftExposureCount: number;
  rightExposureCount: number;
  leftWinRate?: number;
  rightWinRate?: number;
};

export type VersusCardFairnessResult = {
  fairnessScore: number;
  fair: boolean;
  reason:
    | "ok"
    | "trend_gap_too_high"
    | "confidence_gap_too_high"
    | "exposure_gap_too_high"
    | "win_rate_gap_too_high";
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function scoreVersusCardFairness(
  input: VersusCardFairnessInput
): VersusCardFairnessResult {
  const trendGap = Math.abs(input.leftTrendScore - input.rightTrendScore);
  const confidenceGap = Math.abs(input.leftConfidenceScore - input.rightConfidenceScore);
  const exposureGap = Math.abs(input.leftExposureCount - input.rightExposureCount);
  const winRateGap = Math.abs((input.leftWinRate ?? 50) - (input.rightWinRate ?? 50));

  if (trendGap > 35) {
    return {
      fairnessScore: clampScore(100 - trendGap),
      fair: false,
      reason: "trend_gap_too_high",
    };
  }

  if (confidenceGap > 30) {
    return {
      fairnessScore: clampScore(100 - confidenceGap),
      fair: false,
      reason: "confidence_gap_too_high",
    };
  }

  if (exposureGap > 1000) {
    return {
      fairnessScore: clampScore(100 - exposureGap / 20),
      fair: false,
      reason: "exposure_gap_too_high",
    };
  }

  if (winRateGap > 40) {
    return {
      fairnessScore: clampScore(100 - winRateGap),
      fair: false,
      reason: "win_rate_gap_too_high",
    };
  }

  const fairnessScore = clampScore(
    100 -
      trendGap * 0.8 -
      confidenceGap * 0.7 -
      exposureGap * 0.02 -
      winRateGap * 0.6
  );

  return {
    fairnessScore,
    fair: fairnessScore >= 60,
    reason: "ok",
  };
}

export function isVersusCardFair(
  input: VersusCardFairnessInput
): boolean {
  return scoreVersusCardFairness(input).fair;
}
