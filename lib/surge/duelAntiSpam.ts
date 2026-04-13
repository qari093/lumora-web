export type DuelSpamInput = {
  userId: string;
  lastVoteAt?: number;
  now?: number;
  minIntervalMs?: number;
};

export type DuelSpamResult = {
  allowed: boolean;
  reason: "allowed" | "too_fast";
  retryAfterMs: number;
};

export function checkDuelSpam(input: DuelSpamInput): DuelSpamResult {
  const now = input.now ?? Date.now();
  const last = input.lastVoteAt ?? 0;
  const minInterval = Math.max(200, input.minIntervalMs ?? 800);

  const diff = now - last;

  if (diff < minInterval) {
    return {
      allowed: false,
      reason: "too_fast",
      retryAfterMs: minInterval - diff,
    };
  }

  return {
    allowed: true,
    reason: "allowed",
    retryAfterMs: 0,
  };
}
