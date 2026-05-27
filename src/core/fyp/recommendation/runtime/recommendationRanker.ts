import type {
  RecommendationCandidate,
  RecommendationResult
} from "../types";

import { validateRecommendationCandidate } from "../contracts/recommendationContract";

export function rankRecommendationCandidate(
  candidate: RecommendationCandidate
): RecommendationResult {
  if (!validateRecommendationCandidate(candidate)) {
    throw new Error("invalid_recommendation_candidate");
  }

  const rankScore =
    candidate.qualityScore * 0.35 +
    candidate.trendScore * 0.25 +
    candidate.socialScore * 0.2 +
    candidate.emotionScore * 0.2;

  return {
    id: candidate.id,
    rankScore,
    reason: rankScore >= 75 ? "high_relevance" : "standard_relevance"
  };
}
