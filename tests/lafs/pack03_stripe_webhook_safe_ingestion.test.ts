import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  computeStripeLikeSignature,
  processLafsStripeWebhook,
  verifyStripeLikeSignature,
} from "../../src/core/lafs/stripeWebhook";

describe("LAFS Pack 03/08 Stripe webhook safe ingestion", () => {
  it("verifies raw-body Stripe-like signatures", () => {
    const rawBody = JSON.stringify({
      id: "evt_test_signature",
      type: "payment_intent.succeeded",
      data: { object: { id: "pi_test", amount: 1000, currency: "eur" } },
    });

    const signature = computeStripeLikeSignature(rawBody, "whsec_test_secret");

    expect(verifyStripeLikeSignature(rawBody, signature, "whsec_test_secret")).toBe(true);
    expect(verifyStripeLikeSignature(rawBody + "x", signature, "whsec_test_secret")).toBe(false);
  });

  it("processes valid payment_intent.succeeded into pending ledger-ready state", () => {
    const rawBody = JSON.stringify({
      id: "evt_test_valid_123",
      type: "payment_intent.succeeded",
      data: { object: { id: "pi_test_valid", amount: 2500, currency: "eur" } },
    });

    const signature = computeStripeLikeSignature(rawBody, "whsec_test_secret");
    const result = processLafsStripeWebhook({
      rawBody,
      signatureHeader: signature,
      webhookSecret: "whsec_test_secret",
    });

    expect(result.ok).toBe(true);
    expect(result.status).toBe("verified");
    expect(result.idempotencyKey).toBe("stripe:evt_test_valid_123");
    expect(result.ledgerReady).toBe(true);
  });

  it("rejects missing secret and invalid signatures", () => {
    const rawBody = JSON.stringify({
      id: "evt_test_invalid",
      type: "payment_intent.succeeded",
      data: { object: { id: "pi_test_invalid", amount: 2500, currency: "eur" } },
    });

    const signature = computeStripeLikeSignature(rawBody, "whsec_test_secret");

    expect(processLafsStripeWebhook({ rawBody, signatureHeader: signature }).status).toBe("missing_secret");
    expect(
      processLafsStripeWebhook({
        rawBody,
        signatureHeader: signature,
        webhookSecret: "wrong_secret",
      }).status
    ).toBe("invalid_signature");
  });

  it("acks duplicate events safely", () => {
    const seen = new Set<string>();
    const rawBody = JSON.stringify({
      id: "evt_test_duplicate",
      type: "payment_intent.succeeded",
      data: { object: { id: "pi_test_duplicate", amount: 2500, currency: "eur" } },
    });

    const signature = computeStripeLikeSignature(rawBody, "whsec_test_secret");

    const first = processLafsStripeWebhook({ rawBody, signatureHeader: signature, webhookSecret: "whsec_test_secret" }, seen);
    const second = processLafsStripeWebhook({ rawBody, signatureHeader: signature, webhookSecret: "whsec_test_secret" }, seen);

    expect(first.status).toBe("verified");
    expect(second.status).toBe("duplicate");
    expect(second.ok).toBe(true);
  });

  it("writes Stripe webhook ingestion audit artifacts", () => {
    expect(fs.existsSync(".lumora-audits/lafs-pack03-stripe-webhook-safe-ingestion.json")).toBe(true);
    expect(fs.existsSync("data/lafs/stripe-webhook-safe-ingestion.json")).toBe(true);
    expect(fs.existsSync("docs/lafs/pack03-stripe-webhook-safe-ingestion.md")).toBe(true);
    expect(fs.existsSync(".lumora_lafs_pack03_stripe_webhook_lock")).toBe(true);

    const audit = JSON.parse(fs.readFileSync(".lumora-audits/lafs-pack03-stripe-webhook-safe-ingestion.json", "utf8"));
    expect(audit.status).toBe("PASS");
    expect(audit.manifest.status).toBe("STRIPE_WEBHOOK_SAFE_INGESTION_READY");
    expect(audit.manifest.guards.requiresIdempotency).toBe(true);
  });
});
