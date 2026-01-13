# Offline Videos — Public API (Heredoc-Safe)

This document defines the stable public surface for Offline Videos.

## Canonical import (stable)
Use the barrel only:

    import * as OfflineVideos from "src/lib/offline/videos";

Do not import deep runtime modules from app code:

    // avoid
    import * as Runtime from "src/lib/offline/videos/p2p_chunk_protocol";

## Guaranteed exports (contract)
The following symbols are stable and guarded by tests:

    OfflineVideos.signFrame
    OfflineVideos.verifyFrame
    OfflineVideos.createInMemorySeenCache
    OfflineVideos.rateLimitConsume

## Notes
- This doc intentionally avoids fenced code blocks to prevent terminal heredoc paste hangs.
