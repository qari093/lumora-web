import type { FeedQualityInput } from "../types";

export function validateFeedQualityInput(
  input: FeedQualityInput
): boolean {
  return Boolean(
    input.itemId &&
      Number.isFinite(input.watchScore) &&
      Number.isFinite(input.safetyScore) &&
      Number.isFinite(input.freshnessScore) &&
      Number.isFinite(input.duplicateRisk)
  );
}
