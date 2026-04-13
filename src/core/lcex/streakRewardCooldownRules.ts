export type StreakRewardCooldownInput = {
  rewardType: "streak" | "prediction" | "versus" | "bounty" | "reaction";
  lastGrantedAt?: string;
  cooldownHours?: number;
};

export type StreakRewardCooldownDecision = {
  cooledDown: boolean;
  remainingHours: number;
  reason: "ok" | "cooldown_active";
};

export function resolveStreakRewardCooldown(
  input: StreakRewardCooldownInput
): StreakRewardCooldownDecision {
  const cooldownHours = input.cooldownHours ?? 24;

  if (!input.lastGrantedAt) {
    return { cooledDown: true, remainingHours: 0, reason: "ok" };
  }

  const lastGrantedTs = Date.parse(input.lastGrantedAt);
  if (Number.isNaN(lastGrantedTs)) {
    return { cooledDown: true, remainingHours: 0, reason: "ok" };
  }

  const elapsedHours = (Date.now() - lastGrantedTs) / (1000 * 60 * 60);
  const remainingHours = Math.max(0, Math.ceil(cooldownHours - elapsedHours));

  if (remainingHours > 0) {
    return {
      cooledDown: false,
      remainingHours,
      reason: "cooldown_active",
    };
  }

  return { cooledDown: true, remainingHours: 0, reason: "ok" };
}

export function canGrantStreakRewardNow(
  input: StreakRewardCooldownInput
): boolean {
  return resolveStreakRewardCooldown(input).cooledDown;
}
