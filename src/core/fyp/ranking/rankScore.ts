import type {
  RealFeedCandidate
} from "../real-feed/types";

export function calculateRankScore(
  candidate: RealFeedCandidate
): number {
  const score =
    candidate.resonanceScore * 0.28 +
    candidate.voltageScore * 0.18 +
    candidate.noveltyScore * 0.16 +
    candidate.trustScore * 0.18 +
    candidate.safetyScore * 0.12 +
    candidate.intensity * 0.08;

  return Number(score.toFixed(2));
}
