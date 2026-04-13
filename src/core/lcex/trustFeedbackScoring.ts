export type TrustFeedbackScoringInput = {
  sentiment: "positive" | "neutral" | "negative";
  severity: number;
  confidence: number;
  repeatCount: number;
};

export type TrustFeedbackScoringResult = {
  score: number;
  priority: "low" | "medium" | "high" | "critical";
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function scoreTrustFeedback(
  input: TrustFeedbackScoringInput
): TrustFeedbackScoringResult {
  const sentimentBase =
    input.sentiment === "negative"
      ? 55
      : input.sentiment === "neutral"
      ? 30
      : 10;

  const score = clampScore(
    sentimentBase +
      Math.max(0, Math.min(30, Math.round(input.severity))) +
      Math.max(0, Math.min(10, Math.round(input.repeatCount * 2))) +
      Math.max(0, Math.min(20, Math.round(input.confidence * 0.2)))
  );

  return {
    score,
    priority:
      score >= 85
        ? "critical"
        : score >= 65
        ? "high"
        : score >= 40
        ? "medium"
        : "low",
  };
}

export function isHighPriorityTrustFeedback(
  input: TrustFeedbackScoringInput
): boolean {
  const result = scoreTrustFeedback(input);
  return result.priority === "high" || result.priority === "critical";
}
