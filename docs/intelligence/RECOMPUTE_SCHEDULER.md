# Recompute Scheduler

## Purpose
Refresh ranked, enriched, and cached intelligence artifacts on a timed interval.

## Backing file
data/intelligence/recompute.scheduler.state.json

## Modes
- status
- run
- start
- stop

## Endpoint
- GET /api/intelligence/recompute
- GET /api/intelligence/recompute?mode=run
- GET /api/intelligence/recompute?mode=start&intervalMs=300000
- GET /api/intelligence/recompute?mode=stop
