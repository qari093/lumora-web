export type ParticipationHabitProgressRulesInput = {
  currentCount: number;
  targetCount: number;
  blocked: boolean;
  safetyMode: "normal" | "safe-filtered" | "interactive-disabled" | "suppressed";
};

export type ParticipationHabitProgressRulesDecision = {
  progressCount: number;
  completed: boolean;
  reason:
    | "ok"
    | "user_blocked"
    | "suppressed_mode"
    | "target_reached";
};

export function resolveParticipationHabitProgress(
  input: ParticipationHabitProgressRulesInput
): ParticipationHabitProgressRulesDecision {
  if (input.blocked) {
    return {
      progressCount: Math.max(0, Math.round(input.currentCount)),
      completed: false,
      reason: "user_blocked",
    };
  }

  if (input.safetyMode === "suppressed") {
    return {
      progressCount: Math.max(0, Math.round(input.currentCount)),
      completed: false,
      reason: "suppressed_mode",
    };
  }

  const targetCount = Math.max(1, Math.round(input.targetCount));
  const nextCount = Math.min(targetCount, Math.max(0, Math.round(input.currentCount)) + 1);

  if (nextCount >= targetCount) {
    return {
      progressCount: nextCount,
      completed: true,
      reason: "target_reached",
    };
  }

  return {
    progressCount: nextCount,
    completed: false,
    reason: "ok",
  };
}

export function hasCompletedParticipationHabit(
  input: ParticipationHabitProgressRulesInput
): boolean {
  return resolveParticipationHabitProgress(input).completed;
}
