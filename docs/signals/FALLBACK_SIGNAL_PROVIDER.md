# Fallback Signal Provider

## Purpose
Prevent empty feed or upstream outage failure by providing verified internal fallback signals.

## Modules
- src/lib/signals/fallback/defaultSignals.ts
- src/lib/signals/fallback/getFallbackSignals.ts

## Endpoint
- GET /api/signals/fallback?limit=10

## Rule
Fallback signals are only used when provider freshness, availability, or quality fails downstream thresholds.
