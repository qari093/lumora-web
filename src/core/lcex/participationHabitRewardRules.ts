export type ParticipationHabitRewardRulesInput = {
  completed: boolean;
  rewardCooldownActive: boolean;
  alreadyRewarded: boolean;
  safetyBlocked: boolean;
  rewardCapReached: boolean;
};

export type ParticipationHabitRewardRulesDecision = {
  canReward: boolean;
  reason:
    | "ok"
    | "habit_not_completed"
    | "reward_cooldown_active"
    | "already_rewarded"
    | "safety_blocked"
    | "reward_cap_reached";
};

export function resolveParticipationHabitReward(
  input: ParticipationHabitRewardRulesInput
): ParticipationHabitRewardRulesDecision {
  if (!input.completed) {
    return { canReward: false, reason: "habit_not_completed" };
  }

  if (input.safetyBlocked) {
    return { canReward: false, reason: "safety_blocked" };
  }

  if (input.rewardCapReached) {
    return { canReward: false, reason: "reward_cap_reached" };
  }

  if (input.alreadyRewarded) {
    return { canReward: false, reason: "already_rewarded" };
  }

  if (input.rewardCooldownActive) {
    return { canReward: false, reason: "reward_cooldown_active" };
  }

  return { canReward: true, reason: "ok" };
}

export function canGrantParticipationHabitReward(
  input: ParticipationHabitRewardRulesInput
): boolean {
  return resolveParticipationHabitReward(input).canReward;
}
