# Decay Prediction Engine

## Purpose
Predict when a signal is likely to lose momentum so feed and FOMO systems can react early.

## Outputs
- decayRiskScore
- decayWindowHours
- decayState
- decayReason

## States
- stable
- watch
- decaying
- expired

## Endpoint
- GET /api/intelligence/decay
