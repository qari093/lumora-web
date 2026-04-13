# Audit Logs

## Purpose
Persist trust-layer events for traceability and compliance.

## Backing file
data/trust/audit.log.json

## Event types
- fake_engagement_check
- bot_pattern_check
- anomaly_check
- semantic_check
- toxic_velocity_check
- scam_check
- misinformation_check
- trust_score_compute
- trust_filter_refresh

## Endpoint
- GET /api/trust/audit
- GET /api/trust/audit?mode=seed
