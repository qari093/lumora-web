import type {
  TrendResult,
  TrendSignal
} from "../types";

export function calculateTrend(
  signal: TrendSignal
): TrendResult {
  const score =
    signal.velocity * 0.7 +
    signal.engagement * 0.3;

  let direction: TrendResult["direction"] =
    "stable";

  if (score >= 80) {
    direction = "up";
  } else if (score <= 30) {
    direction = "down";
  }

  return {
    id: signal.id,
    score,
    direction
  };
}
