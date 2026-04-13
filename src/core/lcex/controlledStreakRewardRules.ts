export type ControlledStreakRewardInput = {
  currentStreakDays: number;
  lastActiveAt?: string;
  rewardCapReached: boolean;
  safetyBlocked: boolean;
  missedDays?: number;
};

export type ControlledStreakRewardDecision = {
  eligible: boolean;
  nextRewardTier: 0 | 3 | 7 | 14 | 21 | 30;
  preserveStreak: boolean;
  reason:
    | "ok"
    | "reward_cap_reached"
    | "safety_blocked"
    | "streak_broken";
};

const REWARD_TIERS: Array<0 | 3 | 7 | 14 | 21 | 30> = [0, 3, 7, 14, 21, 30];

export function resolveControlledStreakReward(
  input: ControlledStreakRewardInput
): ControlledStreakRewardDecision {
  if (input.safetyBlocked) {
    return {
      eligible: false,
      nextRewardTier: 0,
      preserveStreak: false,
      reason: "safety_blocked",
    };
  }

  if (input.rewardCapReached) {
    return {
      eligible: false,
      nextRewardTier: 0,
      preserveStreak: true,
      reason: "reward_cap_reached",
    };
  }

  if ((input.missedDays ?? 0) > 1) {
    return {
      eligible: false,
      nextRewardTier: 0,
      preserveStreak: false,
      reason: "streak_broken",
    };
  }

  const nextRewardTier =
    REWARD_TIERS.find((tier) => tier > input.currentStreakDays) ?? 30;

  return {
    eligible: true,
    nextRewardTier,
    preserveStreak: true,
    reason: "ok",
  };
}

export function canGrantControlledStreakReward(
  input: ControlledStreakRewardInput
): boolean {
  return resolveControlledStreakReward(input).eligible;
}
