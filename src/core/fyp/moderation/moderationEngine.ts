export type ModerationVerdict =
  | "approved"
  | "quarantine"
  | "blocked";

export interface ModerationInput {
  videoId: string;
  sourceId: string;
  violenceScore: number;
  adultScore: number;
  copyrightRisk: number;
}

export interface ModerationResult {
  verdict: ModerationVerdict;
  requiresHumanReview: boolean;
  reason: string;
}

export function moderateVideo(
  input: ModerationInput
): ModerationResult {

  if (
    input.violenceScore >= 0.90 ||
    input.adultScore >= 0.90
  ) {
    return {
      verdict: "blocked",
      requiresHumanReview: true,
      reason: "critical_safety_risk"
    };
  }

  if (
    input.violenceScore >= 0.50 ||
    input.adultScore >= 0.50 ||
    input.copyrightRisk >= 0.50
  ) {
    return {
      verdict: "quarantine",
      requiresHumanReview: true,
      reason: "manual_review_required"
    };
  }

  return {
    verdict: "approved",
    requiresHumanReview: false,
    reason: "safe_for_pool"
  };
}
