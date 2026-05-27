import type { TrendSignal } from "../types";
import { calculateTrend } from "./trendVelocity";

export function runTrendRuntime(
  signals: TrendSignal[]
) {
  return {
    active: true,
    trends: signals.map(calculateTrend)
  };
}
