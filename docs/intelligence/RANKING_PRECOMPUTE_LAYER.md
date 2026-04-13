# Ranking Pre-compute Layer

## Purpose
Precompute ranked signals so feed assembly can read from a hot, enriched snapshot.

## Backing file
data/intelligence/ranking.precompute.json

## Inputs
- gravity
- trailer priority
- saturation
- decay
- coherence
- culture
- emotions
- weighting

## Endpoint
- GET /api/intelligence/ranking-precompute
- GET /api/intelligence/ranking-precompute?mode=refresh
