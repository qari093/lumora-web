# Instagram Signal Ingestion (Metadata Only)

## Scope
- Metadata-only ingestion
- No media download
- No direct video hosting
- Fallback to local fixture when provider is unavailable

## Environment
- INSTAGRAM_SIGNAL_PROVIDER_URL
- INSTAGRAM_SIGNAL_PROVIDER_TOKEN (optional)

## Endpoint
- GET /api/signals/instagram?limit=10

## Contract
- Returns normalized LumoraSignal objects
- Source reports whether data came from provider or fixture
