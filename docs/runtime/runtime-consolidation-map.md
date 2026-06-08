# Lumora Runtime Consolidation Map

## Current Production Reality

- App route files: 1186
- API route files: 997
- Page route files: 184
- Production deploy: live
- Domain: https://lumoraverse.io
- Current status: deployed and smoke-tested

## Canonical Runtime Ownership

### FYP
Canonical namespace:
- `/api/fyp/*`
- `/fyp`

Legacy / overlap candidates:
- `/api/fyp94/*`
- `/api/feed/*`
- `/api/cineverse/fyp`
- `/api/gmar/fyp/activity`
- `/api/ads/fyp-audit`

Action:
- Keep `/api/fyp/*` as canonical.
- Mark `/api/fyp94/*` as legacy candidate.
- Keep `/api/feed/*` only if used by non-FYP feed runtime.

### Live
Canonical namespace:
- `/api/live/*`
- `/live`

Duplicate candidates:
- `/api/live/room`
- `/api/live/room-list`
- `/api/live/roomlist`
- `/api/live/rooms`
- `/api/live/rooms-list`
- `/api/live/roomslist`
- `/api/live/rooms/list`
- `/api/live/rooms/public`

Action:
- Keep `/api/live/rooms` and `/api/live/rooms/[id]/*` as canonical.
- Convert old room-list aliases to compatibility wrappers or retire after tests.

### Wallet / Zencoin
Canonical namespace:
- `/api/zenwallet/*`

Overlap candidates:
- `/api/wallet/*`
- `/api/wallets/*`
- `/api/zencoin/*`
- `/api/ledger/*`
- `/api/coin/ledger`

Action:
- Treat `/api/zenwallet/*` as canonical launch wallet runtime.
- Keep `/api/wallet/*` only as compatibility if UI still depends on it.
- Mark `/api/wallets/*`, `/api/zencoin/*`, `/api/ledger/*` for ownership review.

### Zendoro / Commerce
Canonical namespace:
- `/api/zendoro/*`

Overlap candidates:
- `/api/products/*`
- `/api/orders/*`
- `/api/seller/*`
- `/api/payments/*`
- `/api/stripe/*`
- `/api/shop/*`
- `/api/webhooks/zendoro`
- `/api/admin/zendoro`

Action:
- Treat `/api/zendoro/*` as canonical commerce runtime.
- Treat `/api/stripe/*` as payment-provider-specific bridge.
- Review `/api/payments/*`, `/api/shop/*`, `/api/products/*`, `/api/orders/*`, `/api/seller/*` before deletion.

### LumaSpace
Canonical namespace:
- `/api/lumaspace/*`
- `/lumaspace`
- `/me/space`

Action:
- Keep active.
- Review debug page separately.

### NEXA
Canonical namespace:
- `/api/nexa/*`

Action:
- Keep active.
- Review `/api/nexa/diag` before production exposure.

## Production Risk Flags

### Dev/debug routes present
Examples:
- `/api/dev/routes`
- `/api/dev/testers/reset`
- `/api/debug/boot-metrics`
- `/api/diag/*`
- `/api/fyp/debug`
- `/api/hybrid/dev/*`
- `/api/stripe/dev/simulate`
- `/api/videos/debug/list`
- `/dev/routes`
- `/dev/testers`
- `/lumaspace/debug`
- `/pwa/diag`

Risk:
- Exposes internal state, reset helpers, debug views, diagnostics, or simulation tools.

Safe next action:
- Add production hardening gate for dev/debug/diag/mock/simulate/tester routes.
- Return 404 in production unless explicitly allowed by environment flag.

## Public Asset Risk

Residual public size:
- `public`: 158M
- `public/videos`: 102M
- `public/audio`: 41M

Action:
- Keep for now because deploy succeeded.
- Later externalize large videos/audio to R2/S3/Stream before traffic scaling.
