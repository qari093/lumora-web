export type FandomBadgeAwardRulesInput = {
  eligible: boolean;
  progressScore: number;
  alreadyOwned: boolean;
  cooldownActive: boolean;
  safetyBlocked: boolean;
};

export type FandomBadgeAwardRulesDecision = {
  canAward: boolean;
  reason:
    | "ok"
    | "not_eligible"
    | "insufficient_progress"
    | "already_owned"
    | "cooldown_active"
    | "safety_blocked";
};

export function resolveFandomBadgeAward(
  input: FandomBadgeAwardRulesInput
): FandomBadgeAwardRulesDecision {
  if (!input.eligible) {
    return { canAward: false, reason: "not_eligible" };
  }

  if (input.safetyBlocked) {
    return { canAward: false, reason: "safety_blocked" };
  }

  if (input.alreadyOwned) {
    return { canAward: false, reason: "already_owned" };
  }

  if (input.cooldownActive) {
    return { canAward: false, reason: "cooldown_active" };
  }

  if (input.progressScore < 85) {
    return { canAward: false, reason: "insufficient_progress" };
  }

  return { canAward: true, reason: "ok" };
}

export function canAwardFandomBadge(
  input: FandomBadgeAwardRulesInput
): boolean {
  return resolveFandomBadgeAward(input).canAward;
}
