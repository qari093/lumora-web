# Twitch Category Spike Ingestion

## Scope
- Category / viewership spike ingestion
- Metadata only
- No direct media hosting
- Fallback to local fixture when provider is unavailable

## Environment
- TWITCH_SIGNAL_PROVIDER_URL
- TWITCH_SIGNAL_PROVIDER_TOKEN (optional)

## Endpoint
- GET /api/signals/twitch?limit=10

## Contract
- Returns normalized LumoraSignal objects
- Source reports whether data came from provider or fixture
