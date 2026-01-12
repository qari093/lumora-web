# Offline Videos — Public API Surface

This document records the **public** (stable) API surface of the Offline Videos runtime.

**Canonical module path:**
- `src/lib/offline/videos/index.ts`

**Core exports (must remain stable):**
- `signFrame(frame, cfg)`
- `verifyFrame(frame, cfg, nowMs)`
- `createInMemorySeenCache(opts?)`
- `createInMemoryRateLimiter(opts?)`

**Notes:**
- Internal helpers/types may change without notice.
- Tests should import only from the canonical index (or explicitly from the canonical runtime file when needed).
