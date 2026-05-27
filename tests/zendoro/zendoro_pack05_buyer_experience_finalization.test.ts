import { describe, expect, it } from "vitest";

import {
  getZendoroBuyerRoutes,
  validateZendoroBuyerExperienceFinalization,
} from "@/src/lib/zendoro/buyer/buyerExperienceFinalization";

describe("Zendoro Pack 5/10 — Buyer Experience Finalization", () => {
  it("validates finalized buyer runtime", () => {
    const runtime = validateZendoroBuyerExperienceFinalization();

    expect(runtime.marketplaceBrowseFlow).toBe(true);
    expect(runtime.productDetailFlow).toBe(true);
    expect(runtime.addToCartFlow).toBe(true);
    expect(runtime.checkoutFlow).toBe(true);
    expect(runtime.paymentFlow).toBe(true);
    expect(runtime.orderConfirmationFlow).toBe(true);
    expect(runtime.orderHistoryFlow).toBe(true);
    expect(runtime.reviewAfterPurchaseFlow).toBe(true);
    expect(runtime.loadingStates).toBe(true);
    expect(runtime.emptyStates).toBe(true);
    expect(runtime.retryStates).toBe(true);
    expect(runtime.mobileResponsiveRuntime).toBe(true);
    expect(runtime.accessibilityContracts).toBe(true);
    expect(runtime.localizationContracts).toBe(true);
    expect(runtime.regionalCurrencyContracts).toBe(true);
    expect(runtime.buyerSessionRecovery).toBe(true);
    expect(runtime.offlineSafeContinuity).toBe(true);
    expect(runtime.shipmentTrackingFlow).toBe(true);
    expect(runtime.refundVisibilityFlow).toBe(true);
    expect(runtime.buyerNotificationFlow).toBe(true);
    expect(runtime.buyerExperienceSeal).toBe(true);
  });

  it("tracks canonical buyer route coverage", () => {
    const routes = getZendoroBuyerRoutes();

    expect(routes).toContain("/products");
    expect(routes).toContain("/products/[id]");
    expect(routes).toContain("/cart");
    expect(routes).toContain("/checkout");
    expect(routes).toContain("/orders");
    expect(routes).toContain("/reviews");
  });
});
