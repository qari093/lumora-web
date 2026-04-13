export type LiveReactionRoomBoostInput = {
  heatScore: number;
  liveCount: number;
  joinVelocity: number;
  rightsScore: number;
  culturalScore: number;
  safetyOverrideActive: boolean;
};

export type LiveReactionRoomBoostDecision = {
  boostAllowed: boolean;
  boostScore: number;
  tier: "none" | "soft" | "strong" | "spotlight";
  reason:
    | "ok"
    | "safety_override_active"
    | "low_rights"
    | "low_cultural_confidence"
    | "insufficient_heat";
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function resolveLiveReactionRoomBoost(
  input: LiveReactionRoomBoostInput
): LiveReactionRoomBoostDecision {
  if (input.safetyOverrideActive) {
    return {
      boostAllowed: false,
      boostScore: 0,
      tier: "none",
      reason: "safety_override_active",
    };
  }

  if (input.rightsScore < 60) {
    return {
      boostAllowed: false,
      boostScore: 0,
      tier: "none",
      reason: "low_rights",
    };
  }

  if (input.culturalScore < 55) {
    return {
      boostAllowed: false,
      boostScore: 0,
      tier: "none",
      reason: "low_cultural_confidence",
    };
  }

  const boostScore = clampScore(
    input.heatScore * 0.45 +
      Math.min(input.liveCount, 5000) * 0.01 +
      input.joinVelocity * 0.3
  );

  if (boostScore < 45) {
    return {
      boostAllowed: false,
      boostScore,
      tier: "none",
      reason: "insufficient_heat",
    };
  }

  return {
    boostAllowed: true,
    boostScore,
    tier:
      boostScore >= 85
        ? "spotlight"
        : boostScore >= 70
        ? "strong"
        : "soft",
    reason: "ok",
  };
}

export function canBoostLiveReactionRoom(
  input: LiveReactionRoomBoostInput
): boolean {
  return resolveLiveReactionRoomBoost(input).boostAllowed;
}
