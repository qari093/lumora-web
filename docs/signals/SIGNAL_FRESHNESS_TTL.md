# Signal Freshness TTL Logic

## Lifecycle TTLs
- rising: 2h
- peaking: 6h
- decaying: 24h
- archived: 72h

## Endpoint
- GET /api/signals/freshness
- GET /api/signals/freshness?mode=all

## Purpose
Ensure downstream ranking and feed assembly only consume fresh signals by default.
