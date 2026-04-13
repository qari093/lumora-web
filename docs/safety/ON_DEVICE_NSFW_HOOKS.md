# On-Device NSFW Detection Hooks

## Purpose
Prepare platform-aware hooks for client-side NSFW scanning before media upload or reaction submission.

## Platforms
- iOS -> Apple Vision hook
- Android -> ML Kit hook
- Web -> disabled fallback

## Endpoint
- GET /api/safety/device-nsfw

## Status
Server-side hook contract ready. Client native integration follows later.
