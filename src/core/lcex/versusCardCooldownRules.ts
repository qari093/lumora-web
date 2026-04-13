export type VersusCardCooldownInput = {
  cardId: string;
  lastShownAt?: string;
  lastVotedAt?: string;
  cooldownMinutes?: number;
};

export type VersusCardCooldownDecision = {
  cooledDown: boolean;
  remainingMinutes: number;
  reason: "ok" | "cooldown_active";
};

export function resolveVersusCardCooldown(
  input: VersusCardCooldownInput
): VersusCardCooldownDecision {
  const cooldownMinutes = input.cooldownMinutes ?? 30;
  const referenceTs = Date.parse(input.lastVotedAt ?? input.lastShownAt ?? "");

  if (Number.isNaN(referenceTs)) {
    return {
      cooledDown: true,
      remainingMinutes: 0,
      reason: "ok",
    };
  }

  const elapsedMinutes = (Date.now() - referenceTs) / (1000 * 60);
  const remainingMinutes = Math.max(0, Math.ceil(cooldownMinutes - elapsedMinutes));

  if (remainingMinutes > 0) {
    return {
      cooledDown: false,
      remainingMinutes,
      reason: "cooldown_active",
    };
  }

  return {
    cooledDown: true,
    remainingMinutes: 0,
    reason: "ok",
  };
}

export function canResurfaceVersusCard(
  input: VersusCardCooldownInput
): boolean {
  return resolveVersusCardCooldown(input).cooledDown;
}
