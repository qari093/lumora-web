import { describe, expect, it } from "vitest";
import { addPaymentMethod, getPaymentMethods } from "@/src/core/zenwallet/methods/methodsHub";

describe("ZenWallet Pack 07", () => {
  it("stores payment methods", () => {
    addPaymentMethod({
      id: "pm_001",
      nickname: "Visa ••4242",
      provider: "stripe",
    });

    expect(getPaymentMethods().length).toBeGreaterThan(0);
  });
});
