export type PredictionPickBadgeType =
  | "first-predictor"
  | "early-wave"
  | "correct-call"
  | "bold-call"
  | "streak-reader"
  | "comeback-reader";

export type PredictionPickBadgeInput = {
  pickId: string;
  userId: string;
  predictionOrder?: number;
  predictedCorrectly?: boolean;
  confidence?: number;
  streakCount?: number;
  spottedComeback?: boolean;
};

export type PredictionPickBadge = {
  id: string;
  pickId: string;
  userId: string;
  badge: PredictionPickBadgeType;
};

export function buildPredictionPickBadges(
  input: PredictionPickBadgeInput
): PredictionPickBadge[] {
  const badges: PredictionPickBadge[] = [];

  if ((input.predictionOrder ?? Number.POSITIVE_INFINITY) === 1) {
    badges.push({
      id: `prediction-pick-badge:${input.pickId}:${input.userId}:first-predictor`,
      pickId: input.pickId.trim(),
      userId: input.userId.trim(),
      badge: "first-predictor",
    });
  }

  if ((input.predictionOrder ?? Number.POSITIVE_INFINITY) <= 25) {
    badges.push({
      id: `prediction-pick-badge:${input.pickId}:${input.userId}:early-wave`,
      pickId: input.pickId.trim(),
      userId: input.userId.trim(),
      badge: "early-wave",
    });
  }

  if (input.predictedCorrectly) {
    badges.push({
      id: `prediction-pick-badge:${input.pickId}:${input.userId}:correct-call`,
      pickId: input.pickId.trim(),
      userId: input.userId.trim(),
      badge: "correct-call",
    });
  }

  if ((input.confidence ?? 0) >= 80 && input.predictedCorrectly) {
    badges.push({
      id: `prediction-pick-badge:${input.pickId}:${input.userId}:bold-call`,
      pickId: input.pickId.trim(),
      userId: input.userId.trim(),
      badge: "bold-call",
    });
  }

  if ((input.streakCount ?? 0) >= 5) {
    badges.push({
      id: `prediction-pick-badge:${input.pickId}:${input.userId}:streak-reader`,
      pickId: input.pickId.trim(),
      userId: input.userId.trim(),
      badge: "streak-reader",
    });
  }

  if (input.spottedComeback) {
    badges.push({
      id: `prediction-pick-badge:${input.pickId}:${input.userId}:comeback-reader`,
      pickId: input.pickId.trim(),
      userId: input.userId.trim(),
      badge: "comeback-reader",
    });
  }

  return badges;
}

export function hasPredictionPickBadge(
  badges: PredictionPickBadge[],
  badge: PredictionPickBadgeType
): boolean {
  return badges.some((entry) => entry.badge === badge);
}
