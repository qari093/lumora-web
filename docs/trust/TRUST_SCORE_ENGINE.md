# Trust Score Engine

## Purpose
Combine all trust signals into a unified trust score.

## Inputs
- anomalyScore
- semanticRiskScore
- toxicVelocityScore
- scamScore
- misinformationScore

## Output
- trustScore (0–100)
- trustLevel (high / medium / low / blocked)
- breakdown

## Endpoint
- GET /api/trust/score
