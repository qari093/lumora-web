# Fake Engagement Detection

## Purpose
Identify artificially inflated engagement signals.

## Rules
- abnormal like/view ratio
- excessive comments vs likes
- shares exceeding views
- spike anomalies

## Output
- suspicion score
- reasons
- boolean flag

## Endpoint
- GET /api/trust/fake-engagement
