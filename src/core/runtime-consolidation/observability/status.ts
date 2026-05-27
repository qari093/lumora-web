import type { ObservabilityMetric, ObservabilityStatus } from "./types";

export function metricStatus(value: number, warningAt: number, criticalAt: number): ObservabilityStatus {
  if (value >= criticalAt) return "critical";
  if (value >= warningAt) return "warning";
  return "healthy";
}

export function worstStatus(metrics: ObservabilityMetric[]): ObservabilityStatus {
  if (metrics.some((metric) => metric.status === "critical")) return "critical";
  if (metrics.some((metric) => metric.status === "warning")) return "warning";
  return "healthy";
}
