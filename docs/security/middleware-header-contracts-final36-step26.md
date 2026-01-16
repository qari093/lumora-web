# Middleware Header Contracts (Final36 Step 26)

This doc locks the **test-facing header contracts** that are safe to assert in CI.

## 1) Always-set stamp (non-sensitive)
- `x-lumora-middleware: 1`
  - Purpose: prove middleware ran for a request.
  - Must not include any user data.

## 2) Prod-sim contract (test-only)
Enabled only when request includes:
- `x-lumora-prod-sim: 1`

When enabled, middleware may also stamp:
- `x-lumora-prod-sim: 1`
- `x-lumora-hsts-enabled: 1` (only if the request enables HSTS; see below)

## 3) HSTS enable contract (test-only)
HSTS decision can be enabled for tests via request header:
- `x-lumora-enable-hsts: 1`

When BOTH:
- `x-lumora-prod-sim: 1` and
- `x-lumora-enable-hsts: 1`

Then middleware must set:
- `strict-transport-security: max-age=...` (non-empty; contains `max-age=`)

## 4) API bypass rule
All `/api/*` requests must bypass middleware logic (no rewrites, no header mutation),
to keep health/ready routes deterministic and prevent unit test interference.

## 5) Safety
No middleware contract header may encode JSON objects, secrets, cookies, tokens, or PII.
