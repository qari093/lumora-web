# Scoring Consistency Validation

## Purpose
Validate that ranking precompute outputs are structurally and numerically consistent.

## Checks
- finalRankScore exists and is numeric
- finalRankScore in expected range
- gravityScore exists
- weightedScore exists
- trailerPriorityScore exists
- sorted order remains descending by finalRankScore

## Endpoint
- GET /api/intelligence/consistency
