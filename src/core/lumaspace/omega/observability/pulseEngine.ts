import type { CivilizationMetric, CivilizationPulse } from "./types";

export function createCivilizationMetric(kind: CivilizationMetric["kind"], value: number): CivilizationMetric {
  return {
    kind,
    value: Math.max(0, value),
    healthy: value >= 0,
  };
}

export function createCivilizationPulse(communityId: string, metrics: CivilizationMetric[]): CivilizationPulse {
  if (!communityId.trim()) throw new Error("communityId_required");

  const average = metrics.length === 0
    ? 0
    : Math.round(metrics.reduce((sum, metric) => sum + Math.min(100, metric.value), 0) / metrics.length);

  return {
    communityId,
    metrics,
    healthScore: average,
    status: average >= 70 ? "healthy" : average >= 40 ? "watch" : "critical",
  };
}
