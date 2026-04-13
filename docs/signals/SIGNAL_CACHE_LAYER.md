# Signal Cache Layer

## Purpose
Provide hot in-memory caching for scored signal batches.

## Modes
- read
- warm
- clear

## Endpoint
- GET /api/signals/cache
- GET /api/signals/cache?mode=warm
- GET /api/signals/cache?mode=clear&key=central_store_top

## Notes
This is the hot path before external cache/Redis is introduced.
