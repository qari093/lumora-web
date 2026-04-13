# Twitter/X Signal Ingestion

## Scope
- API-based signal ingestion
- Metadata only
- No direct media hosting
- Fallback to local fixture when provider is unavailable

## Environment
- TWITTER_X_SIGNAL_PROVIDER_URL
- TWITTER_X_SIGNAL_PROVIDER_TOKEN (optional)

## Endpoint
- GET /api/signals/twitter-x?limit=10

## Contract
- Returns normalized LumoraSignal objects
- Source reports whether data came from provider or fixture
