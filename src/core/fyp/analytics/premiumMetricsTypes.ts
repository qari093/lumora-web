export interface FypPremiumSessionMetrics {
  timeToFirstInteractionMs: number;
  accidentalSwipeBackRate: number;
  curiosityRingCompletionRate: number;
  shareToLumaSpaceRate: number;
  highQualitySurveyAgreeRate: number;
}

export interface FypPremiumMetricsResult {
  ok: boolean;
  failures: string[];
}
