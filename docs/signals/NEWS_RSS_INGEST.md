# News RSS Ingestion

## Scope
- RSS / news-signal ingestion
- Metadata only
- No media hosting
- Fallback to local fixture when provider is unavailable

## Environment
- NEWS_RSS_PROVIDER_URL
- NEWS_RSS_PROVIDER_TOKEN (optional)

## Endpoint
- GET /api/signals/news-rss?limit=10

## Contract
- Returns normalized LumoraSignal objects
- Source reports whether data came from provider or fixture
