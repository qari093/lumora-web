# Zendoro Payment Validation

Scope:
- Canonical checkout route: `/api/zendoro/checkout`
- Canonical webhook route: `/api/zendoro/webhook`
- Compatibility wrappers:
  - `/api/payments/checkout`
  - `/api/payments/webhook`
  - `/api/shop/webhook`
  - `/api/stripe/checkout`
  - `/api/stripe/create-checkout-session`

Rule:
- Canonical Zendoro payment routes must exist before live payment testing.
- Legacy payment routes must not contain launch-critical payment logic.
- Webhook signature verification must be checked before real Stripe activation.
