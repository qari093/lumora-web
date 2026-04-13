# Signal Scoring Engine

## Purpose
Rank signals using Lumora Attention Gravity.

## Formula
gravityScore =
  velocity * 0.4 +
  attention * 0.4 +
  freshness * 0.2 -
  saturation * 0.3

## Output
- gravityScore
- freshnessScore
- trustScore

## Endpoint
GET /api/signals/score
