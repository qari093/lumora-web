import { describe, expect, it } from "vitest";
import { createZenLedgerEntry, calculateZenBalance } from "@/src/monetization/zen/ledger";
import { calculateZenScore, applyZenScoreEma } from "@/src/monetization/zen/score";
import { calculateZenEarn } from "@/src/monetization/zen/earn";
import { canSpendZen } from "@/src/monetization/zen/spend";
import { calculateDailyBaseIssuance, calculateCounterCyclicalBonus } from "@/src/monetization/zen/issuance";

describe("Monetization Pack03 — Zen Economy Core", () => {
  it("creates ledger entries and calculates balance", () => {
    const credit = createZenLedgerEntry({
      userId: "u1",
      amount: 50,
      direction: "credit",
      reason: "hold",
      createdAt: "2026-05-05T00:00:00.000Z",
    });

    const debit = createZenLedgerEntry({
      userId: "u1",
      amount: 10,
      direction: "debit",
      reason: "ad_skip",
      createdAt: "2026-05-05T00:00:00.000Z",
    });

    expect(credit.amount).toBe(50);
    expect(calculateZenBalance([credit, debit])).toBe(40);
  });

  it("calculates ZenScore and EMA", () => {
    const score = calculateZenScore({
      presenceDepth: 0.8,
      resonance: 0.5,
      drift: 0.1,
      legacyBonus: 0.2,
    });

    expect(score).toBeGreaterThan(0);
    expect(applyZenScoreEma({ previousScore: 0.5, newScore: 1 })).toBeGreaterThan(0.5);
  });

  it("calculates earn rules", () => {
    expect(calculateZenEarn({ type: "hold", strength: 10 })).toBe(10);
    expect(calculateZenEarn({ type: "completion", strength: 10 })).toBe(20);
    expect(calculateZenEarn({ type: "reward_ad", strength: 10 })).toBe(30);
  });

  it("validates spend rules", () => {
    expect(canSpendZen({ balance: 30, action: "content_boost" }).ok).toBe(true);
    expect(canSpendZen({ balance: 3, action: "ad_skip" }).ok).toBe(false);
  });

  it("calculates issuance baseline and counter-cyclical bonus", () => {
    expect(calculateDailyBaseIssuance({ dayIndex: 0 })).toBe(1000);
    expect(calculateDailyBaseIssuance({ dayIndex: 3650 })).toBeLessThan(1000);
    expect(calculateCounterCyclicalBonus({
      revenuePerUser: 0.02,
      targetRevenuePerUser: 0.05,
      reserveAvailable: 10,
    })).toBeGreaterThan(0);
  });
});
