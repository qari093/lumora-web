import { describe, expect, it } from "vitest";
import {
  createPaymentIntent,
  markPaymentPaid,
  getPaymentIntent,
} from "@/src/lib/zendoro/payments/paymentRuntime";

describe("Zendoro Pack 5/12 — Payments + Checkout", () => {
  it("creates payment intents", () => {
    const intent = createPaymentIntent("order_1", 120);

    expect(intent.amount).toBe(120);
    expect(intent.status).toBe("created");
  });

  it("marks payments as paid", () => {
    const intent = createPaymentIntent("order_2", 50);

    const paid = markPaymentPaid(intent.id);

    expect(paid.status).toBe("paid");
  });

  it("supports runtime lookup", () => {
    const intent = createPaymentIntent("order_3", 75);

    expect(getPaymentIntent(intent.id)?.currency).toBe("EUR");
  });
});
