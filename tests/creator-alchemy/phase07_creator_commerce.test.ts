import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import {
  buildCreatorCommerceStorefront,
  canActivateCreatorCommerce,
  createCreatorCommerceItem,
  createSilentSupporterTier,
  evaluateCreatorCommerceTrust,
  validateCreatorCommerceCopy
} from "@/src/core/creator-alchemy/creator-commerce";

describe("Phase 07 — Creator Commerce Expansion Ω", () => {
  it("builds safety-approved creator storefronts", () => {
    const item = createCreatorCommerceItem({
      id: "item-1",
      creatorId: "creator-1",
      type: "digital_collectible",
      title: "Quiet Echo",
      price: 10,
      zencoinEligible: true,
      safetyApproved: true
    });

    const storefront = buildCreatorCommerceStorefront({
      creatorId: "creator-1",
      zendoroReady: true,
      items: [item]
    });

    expect(storefront.enabled).toBe(true);
    expect(storefront.items).toHaveLength(1);
  });

  it("hides public ranking in supporter tiers", () => {
    const tier = createSilentSupporterTier({
      id: "tier-1",
      creatorId: "creator-1",
      name: "Quiet Supporter",
      monthlyPrice: 5
    });

    expect(tier.publicRankHidden).toBe(true);
  });

  it("evaluates creator commerce trust", () => {
    const trust = evaluateCreatorCommerceTrust({
      creatorId: "creator-1",
      verified: true,
      refundSafe: true,
      moderationSafe: true
    });

    expect(trust.score).toBe(1);
    expect(canActivateCreatorCommerce(trust)).toBe(true);
  });

  it("blocks unsafe commerce copy", () => {
    expect(validateCreatorCommerceCopy("Guaranteed viral buy followers")).toBe(false);
    expect(validateCreatorCommerceCopy("A quiet collectible from this creator's world")).toBe(true);
  });

  it("creates creator commerce API route", () => {
    expect(existsSync("app/api/creator-alchemy/creator-commerce/route.ts")).toBe(true);
    expect(readFileSync("app/api/creator-alchemy/creator-commerce/route.ts", "utf8")).toContain("buildCreatorCommerceStorefront");
  });
});
