# Zendoro Payment Webhook Signature Audit

Status: PASS

Current rule:
- `/api/zendoro/webhook` is canonical and safe-gated.
- `/api/stripe/webhook` currently contains Stripe `constructEvent` verification.
- Before real fulfillment, verified Stripe webhook logic must be migrated into `/api/zendoro/webhook` or `/api/zendoro/webhook` must delegate to the verified handler.
