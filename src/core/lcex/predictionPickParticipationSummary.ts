export type PredictionPickParticipationSummaryInput = {
  pickId: string;
  uniquePredictors: number;
  totalPredictions: number;
  totalComments: number;
  averageDecisionSeconds: number;
  resolvedAt: string;
};

export type PredictionPickParticipationSummary = {
  pickId: string;
  participationScore: number;
  summaryLine: string;
  resolvedAt: string;
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function buildPredictionPickParticipationSummary(
  input: PredictionPickParticipationSummaryInput
): PredictionPickParticipationSummary {
  const participationScore = clampScore(
    Math.min(input.uniquePredictors, 5000) * 0.015 +
      Math.min(input.totalPredictions, 5000) * 0.01 +
      Math.min(input.totalComments, 2000) * 0.02 +
      Math.max(0, 60 - input.averageDecisionSeconds) * 0.5
  );

  return {
    pickId: input.pickId.trim(),
    participationScore,
    summaryLine: `${input.uniquePredictors} predictors • ${input.totalPredictions} total predictions • ${input.totalComments} comments`,
    resolvedAt: input.resolvedAt,
  };
}

export function hasMeaningfulPredictionPickParticipation(
  summary: PredictionPickParticipationSummary
): boolean {
  return summary.participationScore >= 25;
}
