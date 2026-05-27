import { describe, expect, it } from "vitest";

import {
  getZendoroPaymentEvents,
  validateZendoroStripePaymentHardening,
} from "@/src/lib/zendoro/payments/paymentHardening";

describe("Zendoro Pack 4/10 — Stripe + Payment Hardening", () => {
  it("validates hardened Stripe payment runtime", () => {
    const runtime = validateZendoroStripePaymentHardening();

    expect(runtime.stripeCheckoutSessions).toBe(true);
    expect(runtime.webhookSignatureValidation).toBe(true);
    expect(runtime.webhookReplayProtection).toBe(true);
    expect(runtime.paymentIdempotencyProtection).toBe(true);
    expect(runtime.duplicateChargeProtection).toBe(true);
    expect(runtime.failedPaymentRecovery).toBe(true);
    expect(runtime.abandonedCheckoutRecovery).toBe(true);
    expect(runtime.orderFinalizationProtection).toBe(true);
    expect(runtime.refundLifecycleTracking).toBe(true);
    expect(runtime.chargebackRiskTracking).toBe(true);
    expect(runtime.payoutVerificationFlow).toBe(true);
    expect(runtime.sellerFraudScreening).toBe(true);
    expect(runtime.transactionAuditTrail).toBe(true);
    expect(runtime.paymentDisputePersistence).toBe(true);
    expect(runtime.webhookEventPersistence).toBe(true);
    expect(runtime.runtimePaymentObservability).toBe(true);
    expect(runtime.paymentRetryPolicy).toBe(true);
    expect(runtime.durablePaymentStateMachine).toBe(true);
    expect(runtime.secureCheckoutContracts).toBe(true);
    expect(runtime.stripeRuntimeSeal).toBe(true);
  });

  it("tracks critical Stripe/payment lifecycle events", () => {
    const events = getZendoroPaymentEvents();

    expect(events).toContain("checkout.created");
    expect(events).toContain("checkout.completed");
    expect(events).toContain("payment.failed");
    expect(events).toContain("payment.refunded");
    expect(events).toContain("chargeback.created");
    expect(events).toContain("webhook.received");
    expect(events).toContain("webhook.validated");
    expect(events).toContain("order.finalized");
  });
});
