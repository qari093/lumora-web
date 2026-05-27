import { describe, expect, it } from "vitest";
import { availablePayoutMethods, canShowCreatorView, getCreatorViewLabel } from "@/src/core/zenwallet/creator/creatorSeparation";

describe("ZenWallet Pack 13 — Creator Economy Separation", () => {
  it("gates creator view", () => {
    expect(canShowCreatorView("none")).toBe(false);
    expect(canShowCreatorView("approved")).toBe(true);
  });

  it("shows correct label", () => {
    expect(getCreatorViewLabel("none")).toBe("Become a Creator");
    expect(getCreatorViewLabel("applied")).toBe("Creator View");
  });

  it("returns country-aware payout methods", () => {
    expect(availablePayoutMethods("DE")).toContain("bank_transfer");
    expect(availablePayoutMethods("NG")).toContain("manual_review");
  });
});
