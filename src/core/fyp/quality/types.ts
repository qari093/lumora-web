export type FeedQualityGrade =
  | "excellent"
  | "good"
  | "weak"
  | "reject";

export interface FeedQualityInput {
  itemId: string;
  watchScore: number;
  safetyScore: number;
  freshnessScore: number;
  duplicateRisk: number;
}

export interface FeedQualityDecision {
  itemId: string;
  grade: FeedQualityGrade;
  score: number;
  publishable: boolean;
}
