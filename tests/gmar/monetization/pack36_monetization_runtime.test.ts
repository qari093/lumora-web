import { describe, expect, it } from "vitest";
import { monetizationRuntimeHealthy } from "../../../src/core/gmar/monetization/runtime";
import { isGmarProductAllowed } from "../../../src/core/gmar/monetization/products";
import { validateGmarPurchase } from "../../../src/core/gmar/monetization/transaction";

describe("GMAR Pack 36/40 — Monetization Runtime", () => {
  it("validates monetization runtime", () => {
    const runtime = monetizationRuntimeHealthy();

    expect(runtime.zencoinSpendSafe).toBe(true);
    expect(runtime.noPayToWin).toBe(true);
    expect(runtime.auditLedgerReady).toBe(true);
  });

  it("allows only ethical GMAR products", () => {
    expect(isGmarProductAllowed("solace_coin")).toBe(true);
    expect(isGmarProductAllowed("power_boost")).toBe(false);
  });

  it("blocks pay-to-win purchases", () => {
    expect(validateGmarPurchase({ product: "memory_orb", grantsPower: false, refundable: true }).ok).toBe(true);
    expect(validateGmarPurchase({ product: "memory_orb", grantsPower: true, refundable: true }).reason).toBe("pay_to_win_blocked");
    expect(validateGmarPurchase({ product: "unknown", grantsPower: false, refundable: true }).reason).toBe("product_not_allowed");
  });
});
