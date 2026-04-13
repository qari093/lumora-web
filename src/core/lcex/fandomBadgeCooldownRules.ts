export type FandomBadgeCooldownRulesInput = {
  lastAwardedAt?: string;
  cooldownHours?: number;
};

export type FandomBadgeCooldownRulesDecision = {
  cooledDown: boolean;
  remainingHours: number;
  reason: "ok" | "cooldown_active";
};

export function resolveFandomBadgeCooldown(
  input: FandomBadgeCooldownRulesInput
): FandomBadgeCooldownRulesDecision {
  const cooldownHours = input.cooldownHours ?? 72;

  if (!input.lastAwardedAt) {
    return {
      cooledDown: true,
      remainingHours: 0,
      reason: "ok",
    };
  }

  const awardedTs = Date.parse(input.lastAwardedAt);
  if (Number.isNaN(awardedTs)) {
    return {
      cooledDown: true,
      remainingHours: 0,
      reason: "ok",
    };
  }

  const elapsedHours = (Date.now() - awardedTs) / (1000 * 60 * 60);
  const remainingHours = Math.max(0, Math.ceil(cooldownHours - elapsedHours));

  if (remainingHours > 0) {
    return {
      cooledDown: false,
      remainingHours,
      reason: "cooldown_active",
    };
  }

  return {
    cooledDown: true,
    remainingHours: 0,
    reason: "ok",
  };
}

export function canAwardFandomBadgeNow(
  input: FandomBadgeCooldownRulesInput
): boolean {
  return resolveFandomBadgeCooldown(input).cooledDown;
}
