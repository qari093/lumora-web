import type { PredictionOutcomeRecord } from "./predictionOutcomeTracker";

export type PredictionReview7d = {
  reviewWindow: "7d";
  total: number;
  pending: number;
  resolved: number;
  hits: number;
  misses: number;
  partials: number;
  expired: number;
};

function isWithin7Days(createdAt: string): boolean {
  const ts = Date.parse(createdAt);
  if (Number.isNaN(ts)) return false;
  const ageMs = Date.now() - ts;
  return ageMs >= 0 && ageMs <= 7 * 24 * 60 * 60 * 1000;
}

export function build7DayPredictionReview(
  records: PredictionOutcomeRecord[]
): PredictionReview7d {
  const scoped = records.filter((r) => isWithin7Days(r.createdAt));

  return {
    reviewWindow: "7d",
    total: scoped.length,
    pending: scoped.filter((r) => r.status === "pending").length,
    resolved: scoped.filter((r) => r.status !== "pending").length,
    hits: scoped.filter((r) => r.status === "hit").length,
    misses: scoped.filter((r) => r.status === "miss").length,
    partials: scoped.filter((r) => r.status === "partial").length,
    expired: scoped.filter((r) => r.status === "expired").length,
  };
}

export function has7DayPredictionSignal(
  review: PredictionReview7d
): boolean {
  return review.total > 0;
}
