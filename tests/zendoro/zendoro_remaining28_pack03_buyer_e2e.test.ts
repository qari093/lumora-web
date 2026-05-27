import { describe, expect, it } from "vitest";
import { getZendoroBuyerNextStep, validateZendoroBuyerE2EFlow, zendoroBuyerE2EFlow } from "@/src/lib/zendoro/remaining28/buyerE2E";

describe("Zendoro Remaining 28% Pack 3/9 — Buyer E2E UX", () => {
  it("locks full buyer journey", () => {
    expect(validateZendoroBuyerE2EFlow()).toBe(true);
    expect(zendoroBuyerE2EFlow).toContain("reviewAfterPurchase");
    expect(zendoroBuyerE2EFlow).toContain("mobilePolish");
  });

  it("tracks buyer journey progression", () => {
    expect(getZendoroBuyerNextStep("browse")).toBe("productDetail");
  });
});
