# Lifecycle Detection Engine

## Purpose
Derive signal lifecycle stage from live metrics and freshness.

## Derived states
- rising
- peaking
- decaying
- archived

## Inputs
- velocityScore
- attentionScore
- saturationScore
- updatedAt / createdAt

## Endpoint
- GET /api/intelligence/lifecycle
