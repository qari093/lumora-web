# Inference Cache

## Purpose
Provide a hot in-memory cache for enriched inference-ready outputs.

## Modes
- read
- warm
- clear

## Endpoint
- GET /api/intelligence/inference-cache
- GET /api/intelligence/inference-cache?mode=warm
- GET /api/intelligence/inference-cache?mode=clear&key=enriched_top_signals
