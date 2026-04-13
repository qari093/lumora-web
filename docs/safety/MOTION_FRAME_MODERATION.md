# Motion / Frame Moderation

## Purpose
Moderate motion assets and frame-based previews before feed or trailer rendering.

## Current checks
- frame count presence
- suspicious fps
- oversized duration
- frame density anomaly
- risky metadata

## Actions
- allow
- review
- block

## Endpoint
- GET /api/safety/motion
