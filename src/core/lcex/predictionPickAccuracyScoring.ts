export type PredictionPickAccuracyInput = {
  selectedOptionId: string;
  winningOptionId: string | null;
  submittedAt: string;
  lockedAt?: string;
  confidence?: number;
};

export type PredictionPickAccuracyScore = {
  accurate: boolean;
  score: number;
  tier: "miss" | "good" | "great" | "elite";
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function scorePredictionPickAccuracy(
  input: PredictionPickAccuracyInput
): PredictionPickAccuracyScore {
  const accurate =
    !!input.winningOptionId &&
    input.selectedOptionId.trim() === input.winningOptionId.trim();

  if (!accurate) {
    return { accurate: false, score: 0, tier: "miss" };
  }

  const confidence = Math.max(0, Math.min(100, Math.round(input.confidence ?? 50)));

  let timingBonus = 10;
  if (input.lockedAt) {
    const submittedTs = Date.parse(input.submittedAt);
    const lockedTs = Date.parse(input.lockedAt);
    if (!Number.isNaN(submittedTs) && !Number.isNaN(lockedTs) && submittedTs < lockedTs) {
      const hoursEarly = Math.max(0, (lockedTs - submittedTs) / (1000 * 60 * 60));
      timingBonus = Math.min(30, Math.round(hoursEarly));
    }
  }

  const score = clampScore(60 + timingBonus + confidence * 0.1);

  return {
    accurate: true,
    score,
    tier: score >= 90 ? "elite" : score >= 80 ? "great" : "good",
  };
}

export function isHighAccuracyPredictionPick(
  input: PredictionPickAccuracyInput
): boolean {
  return scorePredictionPickAccuracy(input).score >= 80;
}
