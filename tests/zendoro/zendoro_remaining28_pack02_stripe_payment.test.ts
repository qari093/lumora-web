import { describe, expect, it } from "vitest";
import { createZendoroIdempotencyKey, validateZendoroStripePaymentFlow, zendoroStripePaymentFlow } from "@/src/lib/zendoro/remaining28/stripePaymentFlow";

describe("Zendoro Remaining 28% Pack 2/9 — Stripe Payment Flow", () => {
  it("locks Stripe production payment requirements", () => {
    expect(validateZendoroStripePaymentFlow()).toBe(true);
    expect(zendoroStripePaymentFlow.webhookSignature).toBe(true);
    expect(zendoroStripePaymentFlow.duplicatePaymentPrevention).toBe(true);
  });

  it("creates stable idempotency keys", () => {
    expect(createZendoroIdempotencyKey("u1", "c1")).toBe("zendoro:u1:c1");
  });
});
