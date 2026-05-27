import { describe, expect, it } from "vitest";
import {
  marketplaceRuntime,
  marketplaceHealthy
} from "@/core/zencoin/marketplace/marketplaceRuntime";

describe("Zencoin Ω Pack 03 — Marketplace", () => {
  it("supports gifting", () => {
    expect(marketplaceRuntime.giftingEnabled).toBe(true);
  });

  it("supports marketplace runtime", () => {
    expect(marketplaceRuntime.marketplaceEnabled).toBe(true);
    expect(marketplaceRuntime.digitalGoodsEngine).toBe(true);
  });

  it("supports marketplace health", () => {
    expect(marketplaceHealthy()).toBe(true);
  });
});
