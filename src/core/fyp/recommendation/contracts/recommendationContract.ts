import type { RecommendationCandidate } from "../types";

export function validateRecommendationCandidate(
  candidate: RecommendationCandidate
): boolean {
  return Boolean(
    candidate.id &&
      Number.isFinite(candidate.qualityScore) &&
      Number.isFinite(candidate.trendScore) &&
      Number.isFinite(candidate.socialScore) &&
      Number.isFinite(candidate.emotionScore)
  );
}
