# Explicit Audio Moderation

## Purpose
Block signals that imply unsafe explicit audio/transcript content before feed usage.

## Strategy
- Text heuristic over title/summary/keywords/hashtags (Phase 1)
- External transcript moderation provider hook (Phase 2 future)
- Multi-lingual policy expansion (Phase 3 future)

## Endpoint
- GET /api/safety/audio

## Threshold
Default block threshold: 0.7
