# FYP94 Legacy Compatibility Wrappers

Status: applied

Rule: `/api/fyp94/*` is legacy and must not be expanded.

Canonical namespace: `/api/fyp/*`

- `app/api/fyp94/feed/route.ts` -> `/api/fyp/feed`
- `app/api/fyp94/health/route.ts` -> `/api/fyp/health`
- `app/api/fyp94/library/route.ts` -> `/api/fyp/native-feed`
- `app/api/fyp94/production-health/route.ts` -> `/api/fyp/healthz`
