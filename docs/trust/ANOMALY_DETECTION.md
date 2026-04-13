# Anomaly Detection

## Purpose
Detect suspicious metric combinations and ranking inconsistencies.

## Rules
- velocity/attention divergence
- gravity/weight mismatch
- saturation/velocity conflict
- trailer priority mismatch
- attention without velocity
- score out of bounds

## Output
- anomalyScore
- isAnomalous
- reasons

## Endpoint
- GET /api/trust/anomalies
