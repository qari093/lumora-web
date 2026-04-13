import type { PreViralSignal } from "./preViralSignalRegistry";

export type TrendConfidenceInput = {
  signals: PreViralSignal[];
  sourceDiversity: number;
  regionDiversity: number;
  trustAverage: number;
};

export type TrendConfidenceBreakdown = {
  signalStrengthScore: number;
  sourceDiversityScore: number;
  regionDiversityScore: number;
  trustScore: number;
  totalConfidence: number;
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function scoreTrendConfidence(
  input: TrendConfidenceInput
): TrendConfidenceBreakdown {
  const signalStrengthScore =
    input.signals.length === 0
      ? 0
      : clampScore(
          input.signals.reduce((sum, signal) => sum + signal.score, 0) /
            input.signals.length
        );

  const sourceDiversityScore = clampScore(input.sourceDiversity);
  const regionDiversityScore = clampScore(input.regionDiversity);
  const trustScore = clampScore(input.trustAverage);

  const totalConfidence = clampScore(
    signalStrengthScore * 0.4 +
      sourceDiversityScore * 0.2 +
      regionDiversityScore * 0.15 +
      trustScore * 0.25
  );

  return {
    signalStrengthScore,
    sourceDiversityScore,
    regionDiversityScore,
    trustScore,
    totalConfidence,
  };
}

export function isHighConfidenceTrend(
  input: TrendConfidenceInput
): boolean {
  return scoreTrendConfidence(input).totalConfidence >= 75;
}
