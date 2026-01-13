# Offline Videos — Public API

This document defines the **stable public surface** for Offline Videos.

## Canonical import

    import * as OfflineVideos from "src/lib/offline/videos";

## Stable exports (contract)

- signFrame(frame, key?)
- verifyFrame(frame, key?)
- createInMemorySeenCache({ ttlMs?, max? })
- rateLimitConsume({ key, limit, windowMs }, nowMs?)

Notes:
- This doc intentionally uses **indented code blocks** instead of fenced blocks to avoid
  unclosed-fence issues during automated script generation and copy/paste.
