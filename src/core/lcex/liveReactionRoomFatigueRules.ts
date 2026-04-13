export type LiveReactionRoomFatigueInput = {
  impressionsLast24h: number;
  joinsLast24h: number;
  hidesLast24h: number;
  dismissalsLast24h: number;
  repeatExposureRate: number;
};

export type LiveReactionRoomFatigueDecision = {
  fatigued: boolean;
  fatigueScore: number;
  tier: "none" | "watch" | "high" | "critical";
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function resolveLiveReactionRoomFatigue(
  input: LiveReactionRoomFatigueInput
): LiveReactionRoomFatigueDecision {
  const joinResistance =
    input.impressionsLast24h <= 0
      ? 0
      : Math.max(0, 100 - (input.joinsLast24h / input.impressionsLast24h) * 100);

  const fatigueScore = clampScore(
    joinResistance * 0.35 +
      Math.min(input.hidesLast24h * 4, 100) * 0.25 +
      Math.min(input.dismissalsLast24h * 3, 100) * 0.2 +
      input.repeatExposureRate * 0.2
  );

  return {
    fatigued: fatigueScore >= 55,
    fatigueScore,
    tier:
      fatigueScore >= 85
        ? "critical"
        : fatigueScore >= 70
        ? "high"
        : fatigueScore >= 55
        ? "watch"
        : "none",
  };
}

export function shouldThrottleLiveReactionRoom(
  input: LiveReactionRoomFatigueInput
): boolean {
  return resolveLiveReactionRoomFatigue(input).fatigued;
}
