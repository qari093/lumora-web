# Signal Deduplication

## Purpose
Remove near-identical signals across providers before downstream ranking.

## Strategy
- fingerprint title + summary + keywords + region + language
- keep stronger / fresher candidate
- preserve normalized LumoraSignal shape

## Endpoint
- GET /api/signals/dedupe?limit=3
