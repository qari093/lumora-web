# NSFW Hygiene Layer

## Purpose
Prevent explicit or unsafe content from entering Lumora feed.

## Strategy
- Text-based heuristic filter (Phase 1)
- On-device vision filtering (Phase 2 future)
- Audio moderation (Phase 3 future)

## Endpoint
- GET /api/safety/nsfw

## Threshold
Default block threshold: 0.7
