# Zendoro/Payment Namespace Compatibility Wrappers

Status: applied

Canonical commerce namespace: `/api/zendoro/*`

Rule: legacy product/payment/shop endpoints must not receive new launch logic.

- `GET,POST` `app/api/products/route.ts` -> `/api/zendoro/products`
- `POST` `app/api/payments/checkout/route.ts` -> `/api/zendoro/checkout`
- `POST` `app/api/stripe/checkout/route.ts` -> `/api/zendoro/checkout`
- `POST` `app/api/stripe/create-checkout-session/route.ts` -> `/api/zendoro/checkout`
- `POST` `app/api/payments/webhook/route.ts` -> `/api/zendoro/webhook`
- `POST` `app/api/shop/webhook/route.ts` -> `/api/zendoro/webhook`
