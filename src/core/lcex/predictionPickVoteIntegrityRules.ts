export type PredictionPickVoteIntegrityInput = {
  userId: string;
  pickId: string;
  optionId: string;
  status: "draft" | "open" | "locked" | "resolved" | "cancelled";
  previousOptionId?: string;
  lastVoteAt?: string;
  cooldownSeconds?: number;
  blocked: boolean;
};

export type PredictionPickVoteIntegrityDecision = {
  allowed: boolean;
  reason:
    | "ok"
    | "invalid_payload"
    | "user_blocked"
    | "pick_not_open"
    | "duplicate_vote"
    | "cooldown_active";
};

export function resolvePredictionPickVoteIntegrity(
  input: PredictionPickVoteIntegrityInput
): PredictionPickVoteIntegrityDecision {
  if (
    input.userId.trim().length === 0 ||
    input.pickId.trim().length === 0 ||
    input.optionId.trim().length === 0
  ) {
    return { allowed: false, reason: "invalid_payload" };
  }

  if (input.blocked) {
    return { allowed: false, reason: "user_blocked" };
  }

  if (input.status !== "open") {
    return { allowed: false, reason: "pick_not_open" };
  }

  if (
    input.previousOptionId &&
    input.previousOptionId.trim() === input.optionId.trim()
  ) {
    return { allowed: false, reason: "duplicate_vote" };
  }

  const cooldownSeconds = input.cooldownSeconds ?? 8;
  if (input.lastVoteAt) {
    const delta = Date.now() - Date.parse(input.lastVoteAt);
    if (!Number.isNaN(delta) && delta >= 0 && delta < cooldownSeconds * 1000) {
      return { allowed: false, reason: "cooldown_active" };
    }
  }

  return { allowed: true, reason: "ok" };
}

export function canCastPredictionPickVote(
  input: PredictionPickVoteIntegrityInput
): boolean {
  return resolvePredictionPickVoteIntegrity(input).allowed;
}
