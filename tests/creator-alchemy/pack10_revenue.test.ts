import { describe, expect, it } from "vitest";
import {
  buildRevenueTransparencySnapshot,
  createConstellationPatronage,
  createUtilityListing,
  decideCreatorPayout,
  evaluateBrandCompatibility,
  revenueFraudCleared,
  revenueSystemSafe,
  validateUtilityListing
} from "@/src/core/creator-alchemy/revenue";

describe("Creator Alchemy Pack 10 — Revenue Sustainability Ω", () => {
  it("approves only emotionally compatible patronage", () => {
    const good = evaluateBrandCompatibility({
      brandName: "Calm Studio",
      sponsorTone: "reflective",
      constellationAtmosphere: "reflective quiet creative depth",
      copy: "This week is quietly supported so creators can breathe."
    });

    const bad = evaluateBrandCompatibility({
      brandName: "Loud Growth",
      sponsorTone: "creative",
      constellationAtmosphere: "reflective quiet creative depth",
      copy: "Buy reach with jackpot viral guaranteed casino rewards."
    });

    expect(good.ok).toBe(true);
    expect(bad.ok).toBe(false);
    expect(bad.risks).toContain("casino_language");
  });

  it("creates non-interruptive tiny patronage", () => {
    const patronage = createConstellationPatronage({
      id: "p1",
      brandName: "Calm Studio",
      constellationId: "midnight_souls",
      tone: "reflective",
      line: "This week, Midnight Souls is quietly supported by Calm Studio.",
      approved: true
    });

    expect(patronage.status).toBe("approved");
    expect(patronage.logoScale).toBe("tiny");
    expect(patronage.interruptive).toBe(false);
  });

  it("keeps utility marketplace non pay-to-win", () => {
    const listing = createUtilityListing({
      id: "u1",
      utility: "garden_enhancement",
      priceSilentCoins: 250
    });

    expect(validateUtilityListing(listing)).toBe(true);
    expect(listing.payToWinReach).toBe(false);
  });

  it("blocks payouts before fiat bridge maturity", () => {
    const payout = decideCreatorPayout({
      grossAmount: 100,
      creatorShare: 0.7,
      platformShare: 0.3,
      fraudCleared: true,
      fiatBridgeAllowed: false
    });

    expect(payout.payable).toBe(false);
    expect(payout.reason).toBe("fiat_bridge_not_allowed");
  });

  it("allows creator-majority payouts after readiness", () => {
    const payout = decideCreatorPayout({
      grossAmount: 100,
      creatorShare: 0.7,
      platformShare: 0.3,
      fraudCleared: true,
      fiatBridgeAllowed: true
    });

    expect(payout.payable).toBe(true);
    expect(payout.creatorAmount).toBe(70);
    expect(payout.platformAmount).toBe(30);
  });

  it("rejects suspicious revenue signals", () => {
    expect(
      revenueFraudCleared({
        chargebackRate: 0.01,
        giftVelocitySpike: 0.2,
        repeatedViewerRatio: 0.3,
        suspiciousDeviceRatio: 0.02
      })
    ).toBe(true);

    expect(
      revenueFraudCleared({
        chargebackRate: 0.05,
        giftVelocitySpike: 0.2,
        repeatedViewerRatio: 0.3,
        suspiciousDeviceRatio: 0.02
      })
    ).toBe(false);
  });

  it("builds revenue transparency and safety snapshot", () => {
    const snapshot = buildRevenueTransparencySnapshot({
      patronageActive: true,
      fiatBridgeAllowed: false,
      antiCasinoPassed: true,
      creatorMajorityShare: true
    });

    expect(revenueSystemSafe(snapshot)).toBe(true);
  });
});
