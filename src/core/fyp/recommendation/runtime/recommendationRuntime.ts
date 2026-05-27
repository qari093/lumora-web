import type {
  RecommendationCandidate,
  RecommendationResult
} from "../types";

import { rankRecommendationCandidate } from "./recommendationRanker";

export function runRecommendationRuntime(
  candidates: RecommendationCandidate[]
): RecommendationResult[] {
  return candidates
    .map(rankRecommendationCandidate)
    .sort((a, b) => b.rankScore - a.rankScore);
}
