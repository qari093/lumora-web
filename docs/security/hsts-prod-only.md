# HSTS (Strict-Transport-Security) — Prod-only, Env-gated

Lumora uses **HSTS** only in production-like environments and only when explicitly enabled.

## Why
- HSTS must **not** be sent from local/dev servers (it can “brick” http access in browsers for a hostname).
- Local development runs over HTTP and should never advertise HTTPS-only policy.

## How it works
-  conditionally injects  only when:
  -  (explicit opt-in)

## Defaults
- Dev / local: **OFF** (no header)
- Prod (behind HTTPS) when enabled: **ON**

## Recommended production setting
Set:
- 

Example:

    LUMORA_ENABLE_HSTS=1 node server.js

## Test coverage
-  verifies:
  - Dev: header absent
  - Prod-simulated (env enabled): header present
