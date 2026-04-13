export type ParticipationHabitStreakBridgeInput = {
  habitCompleted: boolean;
  currentStreakDays: number;
  missedDays: number;
  safetyBlocked: boolean;
};

export type ParticipationHabitStreakBridgeDecision = {
  shouldAdvanceStreak: boolean;
  nextStreakDays: number;
  reason:
    | "ok"
    | "habit_not_completed"
    | "safety_blocked"
    | "streak_broken";
};

export function resolveParticipationHabitStreakBridge(
  input: ParticipationHabitStreakBridgeInput
): ParticipationHabitStreakBridgeDecision {
  if (!input.habitCompleted) {
    return {
      shouldAdvanceStreak: false,
      nextStreakDays: Math.max(0, Math.round(input.currentStreakDays)),
      reason: "habit_not_completed",
    };
  }

  if (input.safetyBlocked) {
    return {
      shouldAdvanceStreak: false,
      nextStreakDays: Math.max(0, Math.round(input.currentStreakDays)),
      reason: "safety_blocked",
    };
  }

  if (Math.max(0, Math.round(input.missedDays)) > 1) {
    return {
      shouldAdvanceStreak: false,
      nextStreakDays: 0,
      reason: "streak_broken",
    };
  }

  return {
    shouldAdvanceStreak: true,
    nextStreakDays: Math.max(0, Math.round(input.currentStreakDays)) + 1,
    reason: "ok",
  };
}

export function canBridgeParticipationHabitToStreak(
  input: ParticipationHabitStreakBridgeInput
): boolean {
  return resolveParticipationHabitStreakBridge(input).shouldAdvanceStreak;
}
