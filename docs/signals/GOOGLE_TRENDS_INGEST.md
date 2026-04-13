# Google Trends Ingestion

## Scope
- Trends / search-signal ingestion
- Metadata only
- No media hosting
- Fallback to local fixture when provider is unavailable

## Environment
- GOOGLE_TRENDS_PROVIDER_URL
- GOOGLE_TRENDS_PROVIDER_TOKEN (optional)

## Endpoint
- GET /api/signals/google-trends?limit=10

## Contract
- Returns normalized LumoraSignal objects
- Source reports whether data came from provider or fixture
