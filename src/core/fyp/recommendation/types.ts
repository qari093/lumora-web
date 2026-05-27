export interface RecommendationCandidate {
  id: string;
  qualityScore: number;
  trendScore: number;
  socialScore: number;
  emotionScore: number;
}

export interface RecommendationResult {
  id: string;
  rankScore: number;
  reason: string;
}
