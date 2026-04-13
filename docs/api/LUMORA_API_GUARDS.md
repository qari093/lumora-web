# Lumora API Guards

## Base modules
- src/lib/api/rateLimit.ts
- src/lib/api/requestClientKey.ts
- src/lib/api/guardedJson.ts

## Rules
- API routes should default to no-store
- API routes should emit x-ratelimit-* headers
- Rate-limited routes should return 429 with reset time
