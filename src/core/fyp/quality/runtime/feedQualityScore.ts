import type {
  FeedQualityDecision,
  FeedQualityInput
} from "../types";

import { validateFeedQualityInput } from "../contracts/feedQualityContract";

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function calculateFeedQuality(
  input: FeedQualityInput
): FeedQualityDecision {
  if (!validateFeedQualityInput(input)) {
    throw new Error("invalid_feed_quality_input");
  }

  const score = clamp(
    input.watchScore * 0.4 +
      input.safetyScore * 0.3 +
      input.freshnessScore * 0.2 -
      input.duplicateRisk * 0.1
  );

  const grade =
    score >= 85
      ? "excellent"
      : score >= 65
      ? "good"
      : score >= 40
      ? "weak"
      : "reject";

  return {
    itemId: input.itemId,
    grade,
    score,
    publishable: grade !== "reject"
  };
}
