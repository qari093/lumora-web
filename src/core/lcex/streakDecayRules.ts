export type StreakDecayInput = {
  currentStreakDays: number;
  missedDays: number;
  graceWindowDays?: number;
  safetyBlocked: boolean;
};

export type StreakDecayDecision = {
  nextStreakDays: number;
  preserveStreak: boolean;
  reason:
    | "ok"
    | "within_grace_window"
    | "partial_decay"
    | "streak_reset"
    | "safety_blocked";
};

export function resolveStreakDecay(
  input: StreakDecayInput
): StreakDecayDecision {
  if (input.safetyBlocked) {
    return {
      nextStreakDays: Math.max(0, input.currentStreakDays),
      preserveStreak: false,
      reason: "safety_blocked",
    };
  }

  const graceWindowDays = input.graceWindowDays ?? 1;
  const currentStreakDays = Math.max(0, Math.round(input.currentStreakDays));
  const missedDays = Math.max(0, Math.round(input.missedDays));

  if (missedDays === 0) {
    return {
      nextStreakDays: currentStreakDays,
      preserveStreak: true,
      reason: "ok",
    };
  }

  if (missedDays <= graceWindowDays) {
    return {
      nextStreakDays: currentStreakDays,
      preserveStreak: true,
      reason: "within_grace_window",
    };
  }

  if (missedDays === graceWindowDays + 1) {
    return {
      nextStreakDays: Math.max(0, currentStreakDays - 1),
      preserveStreak: false,
      reason: "partial_decay",
    };
  }

  return {
    nextStreakDays: 0,
    preserveStreak: false,
    reason: "streak_reset",
  };
}

export function shouldResetStreak(
  input: StreakDecayInput
): boolean {
  return resolveStreakDecay(input).reason === "streak_reset";
}
