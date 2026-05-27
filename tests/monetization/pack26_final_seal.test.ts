import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { REQUIRED_MONETIZATION_PACK_LOCKS, validatePackLocks } from "@/src/monetization/final-seal/systemValidation";
import { validateMonetizationStress } from "@/src/monetization/final-seal/stress";
import { simulateMonthlyRevenue } from "@/src/monetization/final-seal/revenueSimulation";
import { validateMonetizationUx } from "@/src/monetization/final-seal/uxValidation";
import { createMonetizationProductionSeal } from "@/src/monetization/final-seal/seal";

describe("Monetization Pack26 — Final Seal", () => {
  it("validates required lock list shape", () => {
    expect(REQUIRED_MONETIZATION_PACK_LOCKS).toHaveLength(25);
    expect(validatePackLocks(REQUIRED_MONETIZATION_PACK_LOCKS).ok).toBe(true);
  });

  it("validates stress test", () => {
    expect(validateMonetizationStress({
      requestsPerMinute: 500,
      maxRequestsPerMinute: 1000,
      errorRate: 0.001,
      maxErrorRate: 0.01,
    }).ok).toBe(true);
  });

  it("simulates monthly revenue", () => {
    const revenue = simulateMonthlyRevenue({
      sessions: 100000,
      revenuePerSession: 0.03,
      creatorShareRate: 0.25,
    });

    expect(revenue.gross).toBe(3000);
    expect(revenue.platformNet).toBe(2250);
  });

  it("validates UX guardrails", () => {
    expect(validateMonetizationUx({
      forcedAds: false,
      hiddenSubliminal: false,
      notNowEnabled: true,
      disclosureVisible: true,
      redStateBlocksAds: true,
    }).ok).toBe(true);
  });

  it("creates production seal and docs", () => {
    const seal = createMonetizationProductionSeal();

    expect(seal.ok).toBe(true);
    expect(seal.totalSteps).toBe(130);
    expect(seal.totalPacks).toBe(26);
    expect(seal.status).toBe("production_sealed");
    expect(fs.existsSync("docs/lumora_monetization_final_seal.md")).toBe(true);
  });
});
