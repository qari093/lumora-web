# Central Signal Store

## Purpose
Persist normalized + deduped + scored signals in one canonical local store.

## Backing file
data/signals/central.signal.store.json

## Endpoint
- GET /api/signals/store
- GET /api/signals/store?mode=refresh

## Notes
This file-based store is the canonical bootstrap layer before database-backed storage.
