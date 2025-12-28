# Live — Current Status Snapshot (Step 90/122)

Generated: 2025-12-27T10:16:43.165Z

## Canonical endpoints
- /api/live/portal-hubs (200 + ratelimit headers + requestId envelope)
- /api/live/rooms (200 + ratelimit headers + requestId envelope)

## Deprecated aliases (must be fast 410)
- /api/live/room-list
- /api/live/rooms/list
- /api/live/rooms/public

## Scripts
- scripts/live/ci_gate.sh
- scripts/live/health_macro.sh
- scripts/live/no_heredoc_guard.sh

## Tests
- tests/live/portal_hubs.contract.test.ts
- tests/live/rooms.contract.test.ts
- tests/live/live_rooms_list.contract.test.ts

## package.json scripts
- ci:live
- health:live
- test:live
- guard:no-heredoc

## Notes
- All Live docs/scripts now written without terminal heredocs (Node writer approach).
- Guard excludes backups and _bak directory.
