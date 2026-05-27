import { describe, expect, it } from "vitest";
import {
  canRunCreativeMatch,
  calculateCreativeMatchBonus,
  creativeMatchHealthy
} from "@/core/zencoin/creative-match/creativeMatchSystem";

describe("Zencoin Pack 16 — Creative Match System", () => {
  it("allows only rare campaigns", () => {
    expect(canRunCreativeMatch({ campaignEnabled: true, campaignType: "seasonal" })).toBe(true);
    expect(canRunCreativeMatch({ campaignEnabled: true, campaignType: "always-on" })).toBe(false);
  });

  it("caps bonus rate", () => {
    expect(calculateCreativeMatchBonus({ purchasedZc: 1000, bonusRate: 0.5 })).toBe(200);
  });

  it("supports creative match health", () => {
    expect(creativeMatchHealthy()).toBe(true);
  });
});
