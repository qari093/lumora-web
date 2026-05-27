import { describe, expect, it } from "vitest";
import { createOrderIntent, settleOrderIntent } from "@/src/core/zenwallet/orderintent/orderIntent";

describe("ZenWallet Pack 04", () => {
  it("settles exactly once", () => {
    createOrderIntent({
      orderId: "ord_001",
      psp: "stripe",
      amountEUR: 10,
      status: "pending",
    });

    const settled = settleOrderIntent("ord_001");

    expect(settled?.status).toBe("settled");
  });
});
