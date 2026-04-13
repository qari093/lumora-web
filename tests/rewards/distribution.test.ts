import { beforeEach, describe, expect, it } from "vitest";
import {
  __resetRewardDistributionForTests,
  createRewardDistribution,
} from "@/lib/rewards/distribution";

describe("reward distribution engine", () => {
  const now = 1_700_000_000_000;

  beforeEach(() => {
    __resetRewardDistributionForTests();
  });

  it("creates a valid reward distribution", () => {
    const out = createRewardDistribution(
      {
        userId: "user_1",
        walletId: "wallet_1",
        trigger: "daily_login",
        amount: 25,
        reference: "login_reward_day_1",
        idempotencyKey: "reward:user_1:day_1",
      },
      now
    );

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.reward.userId).toBe("user_1");
      expect(out.reward.walletId).toBe("wallet_1");
      expect(out.reward.amount).toBe(25);
      expect(out.reward.createdAt).toBe(now);
    }
  });

  it("rejects duplicate idempotency key", () => {
    createRewardDistribution({
      userId: "user_1",
      walletId: "wallet_1",
      trigger: "daily_login",
      amount: 25,
      reference: "login_reward_day_1",
      idempotencyKey: "reward:user_1:day_1",
    });

    const out = createRewardDistribution({
      userId: "user_1",
      walletId: "wallet_1",
      trigger: "daily_login",
      amount: 25,
      reference: "login_reward_day_1",
      idempotencyKey: "reward:user_1:day_1",
    });

    expect(out).toEqual({ ok: false, reason: "duplicate_distribution" });
  });

  it("rejects invalid amount", () => {
    const out = createRewardDistribution({
      userId: "user_1",
      walletId: "wallet_1",
      trigger: "quest_complete",
      amount: 0,
      reference: "quest_reward",
      idempotencyKey: "reward:q1",
    });

    expect(out).toEqual({ ok: false, reason: "invalid_amount" });
  });

  it("rejects missing trigger", () => {
    const out = createRewardDistribution({
      userId: "user_1",
      walletId: "wallet_1",
      amount: 10,
      reference: "ref",
      idempotencyKey: "reward:x",
    });

    expect(out).toEqual({ ok: false, reason: "missing_trigger" });
  });

  it("rejects missing idempotency key", () => {
    const out = createRewardDistribution({
      userId: "user_1",
      walletId: "wallet_1",
      trigger: "promo_drop",
      amount: 10,
      reference: "promo",
      idempotencyKey: " ",
    });

    expect(out).toEqual({ ok: false, reason: "missing_idempotency_key" });
  });
});
