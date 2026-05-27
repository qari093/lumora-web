import { describe, expect, it } from "vitest";
import {
  FIAT_BRIDGE_CREATOR_THRESHOLD,
  FIAT_BRIDGE_MAU_THRESHOLD,
  buildResonanceGarden,
  buildResonanceLedger,
  createQuietGift,
  decideResonanceWindow,
  evaluateEconomyMaturity,
  isQuietGiftType,
  totalGiftEnergy,
  validateEconomyCopy,
  validatePayoutSplit
} from "@/src/core/creator-alchemy/economy";

const gifts = [
  createQuietGift({
    id: "g1",
    type: "candle",
    creatorId: "creator-1",
    viewerId: "viewer-1",
    createdAt: "2026-01-01T00:00:00.000Z",
    silentCoinsValue: 20
  }),
  createQuietGift({
    id: "g2",
    type: "star",
    creatorId: "creator-1",
    viewerId: "viewer-2",
    createdAt: "2026-01-01T00:00:00.000Z",
    silentCoinsValue: 50
  })
];

describe("Creator Alchemy Pack 05 — Resonance Economy Ω", () => {
  it("validates quiet gift types", () => {
    expect(isQuietGiftType("candle")).toBe(true);
    expect(isQuietGiftType("jackpot")).toBe(false);
  });

  it("creates quiet gifts and calculates energy", () => {
    expect(gifts[0]?.silentCoinsValue).toBe(20);
    expect(totalGiftEnergy(gifts)).toBeGreaterThan(80);
  });

  it("keeps fiat bridge locked until public maturity thresholds are met", () => {
    const symbolic = evaluateEconomyMaturity({
      monthlyActiveCreators: 100,
      monthlyActiveUsers: 5000,
      antiFraudReady: false,
      moderationStable: false,
      creatorCultureStable: false
    });

    const ready = evaluateEconomyMaturity({
      monthlyActiveCreators: FIAT_BRIDGE_CREATOR_THRESHOLD,
      monthlyActiveUsers: FIAT_BRIDGE_MAU_THRESHOLD,
      antiFraudReady: true,
      moderationStable: true,
      creatorCultureStable: true
    });

    expect(symbolic.fiatBridgeAllowed).toBe(false);
    expect(ready.fiatBridgeAllowed).toBe(true);
    expect(ready.stage).toBe("fiat_ready");
  });

  it("builds symbolic ledger states and horizon progress", () => {
    const ledger = buildResonanceLedger("creator-1", gifts);

    expect(ledger.creatorId).toBe("creator-1");
    expect(ledger.horizonProgress).toBeGreaterThanOrEqual(0);
    expect(ledger.horizonProgress).toBeLessThanOrEqual(1);
  });

  it("builds resonance garden from gift milestones", () => {
    const manyGifts = Array.from({ length: 1000 }, (_, index) =>
      createQuietGift({
        id: `gift-${index}`,
        type: index % 10 === 0 ? "star" : "leaf",
        creatorId: "creator-1",
        viewerId: `viewer-${index}`,
        createdAt: "2026-01-01T00:00:00.000Z"
      })
    );

    const garden = buildResonanceGarden("creator-1", manyGifts);
    expect(garden.plants).toBe(10);
    expect(garden.trees).toBe(1);
    expect(garden.rareBlooms).toBe(100);
  });

  it("allows resonance windows only after resonance and safety are ready", () => {
    const blocked = decideResonanceWindow({
      resonanceEnergy: 2000,
      completionRate: 0.8,
      rewatchRate: 0.8,
      saveRate: 0.8,
      safetyPassed: false
    });

    const allowed = decideResonanceWindow({
      resonanceEnergy: 2200,
      completionRate: 0.8,
      rewatchRate: 0.8,
      saveRate: 0.8,
      safetyPassed: true
    });

    expect(blocked.allowed).toBe(false);
    expect(allowed.allowed).toBe(true);
    expect(allowed.durationHours).toBe(24);
  });

  it("blocks casino and pay-to-win economy language", () => {
    expect(validateEconomyCopy("Buy reach and guaranteed profit jackpot")).toBe(false);
    expect(validateEconomyCopy("Quiet appreciation supports your resonance garden")).toBe(true);
  });

  it("validates creator-majority payout splits", () => {
    expect(validatePayoutSplit({ creatorShare: 0.7, platformShare: 0.3 })).toBe(true);
    expect(validatePayoutSplit({ creatorShare: 0.5, platformShare: 0.5 })).toBe(false);
  });
});
