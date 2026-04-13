# Block Low-Trust Signals

## Purpose
Remove low and blocked trust signals from downstream feed-ready surfaces.

## Backing file
data/trust/trusted.signals.store.json

## Policy
Allowed:
- high
- medium

Blocked:
- low
- blocked

## Endpoint
- GET /api/trust/filter
- GET /api/trust/filter?mode=refresh
