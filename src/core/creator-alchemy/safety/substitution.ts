export interface SimilarCreatorCandidate {
  creatorId: string;
  emotionalSimilarity: number;
  freshness: number;
  safetyPassed: boolean;
}

export function selectSimilarCreators(candidates: readonly SimilarCreatorCandidate[], limit = 3): SimilarCreatorCandidate[] {
  return [...candidates]
    .filter((candidate) => candidate.safetyPassed && candidate.emotionalSimilarity >= 0.55)
    .sort((a, b) => {
      const scoreA = a.emotionalSimilarity * 0.7 + a.freshness * 0.3;
      const scoreB = b.emotionalSimilarity * 0.7 + b.freshness * 0.3;
      return scoreB - scoreA;
    })
    .slice(0, Math.max(0, limit));
}
