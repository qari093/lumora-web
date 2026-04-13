export type CooldownCheckInput = {
  lastActionAt?: number | null;
  cooldownMinutes?: number;
};

export type CooldownCheckResult = {
  allowed: boolean;
  retryAfterSeconds: number;
  nextAllowedAt: number;
};

export function checkCooldown(input: CooldownCheckInput): CooldownCheckResult {
  const cooldownMinutes = Math.max(1, input.cooldownMinutes ?? 5);
  const lastActionAt = input.lastActionAt ?? 0;
  const now = Date.now();
  const cooldownMs = cooldownMinutes * 60 * 1000;
  const nextAllowedAt = lastActionAt + cooldownMs;

  if (!lastActionAt || now >= nextAllowedAt) {
    return {
      allowed: true,
      retryAfterSeconds: 0,
      nextAllowedAt: now,
    };
  }

  return {
    allowed: false,
    retryAfterSeconds: Math.ceil((nextAllowedAt - now) / 1000),
    nextAllowedAt,
  };
}
