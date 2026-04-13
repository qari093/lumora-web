export type PredictionPickOutcomeResolutionInput = {
  pickId: string;
  status: "draft" | "open" | "locked" | "resolved" | "cancelled";
  winningOptionId?: string;
  cancelled?: boolean;
  reason?: string;
};

export type PredictionPickOutcomeResolution = {
  resolved: boolean;
  winningOptionId: string | null;
  cancelled: boolean;
  reason:
    | "ok"
    | "pick_not_locked"
    | "missing_winner"
    | "cancelled";
};

export function resolvePredictionPickOutcome(
  input: PredictionPickOutcomeResolutionInput
): PredictionPickOutcomeResolution {
  if (input.cancelled) {
    return {
      resolved: true,
      winningOptionId: null,
      cancelled: true,
      reason: "cancelled",
    };
  }

  if (input.status !== "locked" && input.status !== "resolved") {
    return {
      resolved: false,
      winningOptionId: null,
      cancelled: false,
      reason: "pick_not_locked",
    };
  }

  if (!input.winningOptionId || input.winningOptionId.trim().length === 0) {
    return {
      resolved: false,
      winningOptionId: null,
      cancelled: false,
      reason: "missing_winner",
    };
  }

  return {
    resolved: true,
    winningOptionId: input.winningOptionId.trim(),
    cancelled: false,
    reason: "ok",
  };
}

export function hasResolvedPredictionPickOutcome(
  result: PredictionPickOutcomeResolution
): boolean {
  return result.resolved && (result.cancelled || !!result.winningOptionId);
}
