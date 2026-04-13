export type PredictionPickSummaryInput = {
  pickId: string;
  title: string;
  winningOptionLabel?: string;
  totalPredictions: number;
  resolvedAt: string;
  cancelled?: boolean;
};

export type PredictionPickSummaryCard = {
  id: string;
  type: "prediction-pick-summary";
  pickId: string;
  title: string;
  outcomeLine: string;
  statsLine: string;
  resolvedAt: string;
};

export function buildPredictionPickSummaryCard(
  input: PredictionPickSummaryInput
): PredictionPickSummaryCard {
  const outcomeLine = input.cancelled
    ? "Prediction pick was cancelled"
    : `${(input.winningOptionLabel || "").trim()} won the outcome`;

  return {
    id: `prediction-pick-summary:${input.pickId.trim()}`,
    type: "prediction-pick-summary",
    pickId: input.pickId.trim(),
    title: input.title.trim(),
    outcomeLine,
    statsLine: `${Math.max(0, Math.round(input.totalPredictions))} predictions`,
    resolvedAt: input.resolvedAt,
  };
}

export function isPredictionPickSummaryCardUsable(
  card: PredictionPickSummaryCard
): boolean {
  return (
    card.pickId.length > 0 &&
    card.title.length > 0 &&
    card.outcomeLine.length > 0 &&
    card.statsLine.length > 0
  );
}
