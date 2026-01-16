# Final36 — Release Environment Template (Step 29)

This file is a **template** to validate release environments without exposing secrets.

## 1) Required runtime (baseline)
- Node.js: **20+**
- Package manager: `pnpm` preferred (or `npm`)
- Database: as configured for your deployment (Prisma compatible)

## 2) Minimum required env vars (non-secret)
- `NODE_ENV=production`

## 3) Optional safety/test toggles (dev / CI only)
These **must not** be enabled in real production.
- `LUMORA_TEST_PROD_SIM=1` (enables prod-like middleware behavior in tests)
- `LUMORA_ENABLE_HSTS=1` (HSTS decision gated by prod/prod-sim contract)
- `LUMORA_ENABLE_HEADER_CONTRACT_DEBUG=1` (debug headers for tests)

## 4) Secrets (do not store here)
Populate these via your secret manager:
- OAuth / auth secrets
- Database URL(s)
- Stripe/CF Stream/LiveKit keys
- Any third-party API keys

## 5) Operator validation checklist (preflight)
Run:
- `pnpm -s run ci:final36`
- `sh scripts/final36/operator_quickcheck.sh`

Pass criteria:
- `ci:final36` is green
- quickcheck shows `/api/health`, `/api/healthz`, `/api/_health`, `/api/ready` all `200`
- portal routes respond `200` or redirect
- security headers present (CSP, XFO, Referrer-Policy). HSTS is **prod-only**.
