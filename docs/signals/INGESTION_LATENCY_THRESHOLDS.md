# Ingestion Latency Thresholds

## Purpose
Measure per-provider ingest latency and enforce budget visibility.

## Thresholds
- google_trends: 2500ms
- news_rss: 2500ms
- tiktok: 3000ms
- instagram: 3000ms
- twitter_x: 3000ms
- reddit: 3000ms
- twitch: 3000ms

## Endpoint
- GET /api/signals/latency?limit=1
