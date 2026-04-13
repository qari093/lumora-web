export type VersusVoteIntegrityInput = {
  userId: string;
  cardId: string;
  optionId: string;
  previousVoteOptionId?: string;
  lastVoteAt?: string;
  cooldownSeconds?: number;
  userRegion?: string;
  blocked: boolean;
};

export type VersusVoteIntegrityDecision = {
  allowed: boolean;
  reason:
    | "ok"
    | "user_blocked"
    | "cooldown_active"
    | "duplicate_vote"
    | "invalid_payload";
};

export function resolveVersusVoteIntegrity(
  input: VersusVoteIntegrityInput
): VersusVoteIntegrityDecision {
  if (
    input.userId.trim().length === 0 ||
    input.cardId.trim().length === 0 ||
    input.optionId.trim().length === 0
  ) {
    return { allowed: false, reason: "invalid_payload" };
  }

  if (input.blocked) {
    return { allowed: false, reason: "user_blocked" };
  }

  if (
    input.previousVoteOptionId &&
    input.previousVoteOptionId.trim() === input.optionId.trim()
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

export function canCastVersusVote(
  input: VersusVoteIntegrityInput
): boolean {
  return resolveVersusVoteIntegrity(input).allowed;
}
