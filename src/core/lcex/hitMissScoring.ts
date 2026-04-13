import type { PredictionOutcomeRecord } from "./predictionOutcomeTracker";

export type HitMissScoreSummary = {
  totalResolved: number;
  hitCount: number;
  missCount: number;
  partialCount: number;
  expiredCount: number;
  hitRate: number;
  weightedScore: number;
};

function round(value: number): number {
  return Number(value.toFixed(2));
}

export function buildHitMissScoreSummary(
  records: PredictionOutcomeRecord[]
): HitMissScoreSummary {
  const resolved = records.filter((r) => r.status !== "pending");
  const hitCount = resolved.filter((r) => r.status === "hit").length;
  const missCount = resolved.filter((r) => r.status === "miss").length;
  const partialCount = resolved.filter((r) => r.status === "partial").length;
  const expiredCount = resolved.filter((r) => r.status === "expired").length;

  const totalResolved = resolved.length;
  const hitRate = totalResolved === 0 ? 0 : round((hitCount / totalResolved) * 100);

  const weightedScore =
    totalResolved === 0
      ? 0
      : round(
          ((hitCount * 1 + partialCount * 0.5 - missCount * 0.75 - expiredCount * 0.25) /
            totalResolved) *
            100
        );

  return {
    totalResolved,
    hitCount,
    missCount,
    partialCount,
    expiredCount,
    hitRate,
    weightedScore,
  };
}

export function hasPositivePredictionAccuracy(
  summary: HitMissScoreSummary
): boolean {
  return summary.weightedScore > 0;
}
