# Audio Transcript Moderation

## Purpose
Moderate audio transcripts before allowing audio/video content into feed or CineVerse.

## Checks
- missing transcript
- long audio duration
- risky keywords in transcript
- oversized transcript payload

## Actions
- allow
- review
- block

## Endpoint
- GET /api/safety/audio-transcript
