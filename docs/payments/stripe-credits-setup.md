# Stripe Credits — Canonical Setup (Locked)

## Required env vars (dev/stage)
- `APP_URL=http://127.0.0.1:3000`
- `STRIPE_SECRET_KEY=sk_test_...`
- `STRIPE_WEBHOOK_SECRET=whsec_...`

## Live-mode safety (mandatory)
To prevent accidental production charges during testing:

- If `STRIPE_SECRET_KEY` starts with `sk_live_`, requests are **blocked** unless:
  - `STRIPE_ALLOW_LIVE_MODE=true`

This guard is enforced in:
- `POST /api/stripe/checkout`
- `POST /api/stripe/webhook`

## Flow summary
1) Client calls `POST /api/stripe/checkout` with `{ userId, credits }`
2) Route creates Stripe Checkout session and persists `StripeCheckoutSession(status="created")`
3) Stripe sends `checkout.session.completed` to `POST /api/stripe/webhook`
4) Webhook reads `session.metadata.userId` + `session.metadata.credits`
5) Credits wallet exactly-once via `WalletLedger` unique `(source, refId)`
6) Updates `StripeCheckoutSession`: `paid` → `fulfilled`

## Invariants (Gate 1)
- No duplicate ledger rows per `(source, refId)`
- Wallet balance equals sum of ledger credits (current model assumes only credits)
- `StripeCheckoutSession.status ∈ {created, paid, fulfilled, canceled, failed}`
