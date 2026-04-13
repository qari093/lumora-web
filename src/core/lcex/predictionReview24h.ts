import type { PredictionOutcomeRecord } from "./predictionOutcomeTracker";

export type PredictionReview24h = {
  reviewWindow: "24h";
  total: number;
  pending: number;
  resolved: number;
  hits: number;
  misses: number;
  partials: number;
  expired: number;
};

function isWithin24Hours(createdAt: string): boolean {
  const ts = Date.parse(createdAt);
  if (Number.isNaN(ts)) return false;
  const ageMs = Date.now() - ts;
  return ageMs >= 0 && ageMs <= 24 * 60 * 60 * 1000;
}

export function build24HourPredictionReview(
  records: PredictionOutcomeRecord[]
): PredictionReview24h {
  const scoped = records.filter((r) => isWithin24Hours(r.createdAt));

  return {
    reviewWindow: "24h",
    total: scoped.length,
    pending: scoped.filter((r) => r.status === "pending").length,
    resolved: scoped.filter((r) => r.status !== "pending").length,
    hits: scoped.filter((r) => r.status === "hit").length,
    misses: scoped.filter((r) => r.status === "miss").length,
    partials: scoped.filter((r) => r.status === "partial").length,
    expired: scoped.filter((r) => r.status === "expired").length,
  };
}

export function has24HourPredictionSignal(
  review: PredictionReview24h
): boolean {
  return review.total > 0;
}
