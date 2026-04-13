# Enriched Signal Store

## Purpose
Persist fully enriched, precomputed signals for downstream engines.

## Backing file
data/intelligence/enriched.signals.store.json

## Endpoint
- GET /api/intelligence/enriched-store
- GET /api/intelligence/enriched-store?mode=refresh

## Rule
Feed, personalization, and FOMO systems should prefer enriched-store over raw signal-store.
