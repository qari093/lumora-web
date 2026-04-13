export type LiveReactionRoomCooldownInput = {
  endedAt?: string;
  roomHeatScore: number;
  previousSessionDurationMinutes: number;
  roomTier: "starter" | "standard" | "premium" | "event";
};

export type LiveReactionRoomCooldownResult = {
  cooldownMinutes: number;
  canReopenNow: boolean;
};

function round(value: number): number {
  return Math.max(0, Math.round(value));
}

function baseCooldownByTier(
  tier: LiveReactionRoomCooldownInput["roomTier"]
): number {
  switch (tier) {
    case "starter":
      return 20;
    case "standard":
      return 30;
    case "premium":
      return 45;
    case "event":
      return 60;
  }
}

export function resolveLiveReactionRoomCooldown(
  input: LiveReactionRoomCooldownInput
): LiveReactionRoomCooldownResult {
  const base = baseCooldownByTier(input.roomTier);
  const heatModifier = input.roomHeatScore >= 80 ? 20 : input.roomHeatScore >= 60 ? 10 : 0;
  const durationModifier =
    input.previousSessionDurationMinutes >= 120
      ? 20
      : input.previousSessionDurationMinutes >= 60
      ? 10
      : 0;

  const cooldownMinutes = round(base + heatModifier + durationModifier);

  if (!input.endedAt) {
    return {
      cooldownMinutes,
      canReopenNow: false,
    };
  }

  const endedTs = Date.parse(input.endedAt);
  if (Number.isNaN(endedTs)) {
    return {
      cooldownMinutes,
      canReopenNow: false,
    };
  }

  const elapsedMinutes = (Date.now() - endedTs) / (1000 * 60);

  return {
    cooldownMinutes,
    canReopenNow: elapsedMinutes >= cooldownMinutes,
  };
}

export function isLiveReactionRoomOutOfCooldown(
  input: LiveReactionRoomCooldownInput
): boolean {
  return resolveLiveReactionRoomCooldown(input).canReopenNow;
}
