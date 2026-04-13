export type RewardTrigger =
  | "daily_login"
  | "quest_complete"
  | "referral_success"
  | "streak_bonus"
  | "promo_drop";

export type RewardInput = {
  userId?: string | null;
  walletId?: string | null;
  trigger?: RewardTrigger | null;
  amount?: number | null;
  reference?: string | null;
  idempotencyKey?: string | null;
};

export type RewardRecord = {
  id: string;
  userId: string;
  walletId: string;
  trigger: RewardTrigger;
  amount: number;
  reference: string;
  idempotencyKey: string;
  createdAt: number;
};

export type RewardResult =
  | { ok: true; reward: RewardRecord }
  | { ok: false; reason: string };

const MAX_REWARD = 100000;
const seenKeys = new Set<string>();

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function createRewardDistribution(
  input: RewardInput,
  now: number = Date.now()
): RewardResult {
  const userId = typeof input.userId === "string" ? input.userId.trim() : "";
  const walletId = typeof input.walletId === "string" ? input.walletId.trim() : "";
  const trigger = input.trigger ?? null;
  const amount =
    typeof input.amount === "number" && Number.isFinite(input.amount)
      ? round2(input.amount)
      : NaN;
  const reference = typeof input.reference === "string" ? input.reference.trim() : "";
  const idempotencyKey =
    typeof input.idempotencyKey === "string" ? input.idempotencyKey.trim() : "";

  if (!userId) return { ok: false, reason: "missing_user_id" };
  if (!walletId) return { ok: false, reason: "missing_wallet_id" };
  if (!trigger) return { ok: false, reason: "missing_trigger" };
  if (!Number.isFinite(amount) || amount <= 0) return { ok: false, reason: "invalid_amount" };
  if (amount > MAX_REWARD) return { ok: false, reason: "amount_exceeds_limit" };
  if (!reference) return { ok: false, reason: "missing_reference" };
  if (!idempotencyKey) return { ok: false, reason: "missing_idempotency_key" };
  if (seenKeys.has(idempotencyKey)) return { ok: false, reason: "duplicate_distribution" };

  seenKeys.add(idempotencyKey);

  return {
    ok: true,
    reward: {
      id: `r_${Math.random().toString(36).slice(2, 10)}`,
      userId,
      walletId,
      trigger,
      amount,
      reference,
      idempotencyKey,
      createdAt: now,
    },
  };
}

export function __resetRewardDistributionForTests() {
  seenKeys.clear();
}
