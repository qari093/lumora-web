# Polaroid — Phase 1 Events Wiring (Step 09)

UTC: 2025-12-20T11:55:39Z

## What changed
- `polaroid-mvp/index.html` now sends NDJSON events to:
  - `/polaroid-mvp/events.ndjson`
- If offline / send fails, events are queued to `localStorage` key:
  - `lumora_polaroid_events_q_v1`
- Queue flushes on load and when network comes online.

## Local verify
1) Start receiver:
```sh
PORT=8088 polaroid-mvp/tools/run-events-receiver.sh
```
2) Open:
- http://127.0.0.1:8088/polaroid-mvp/index.html
3) Tap a color + Save PNG
4) Inspect:
```sh
tail -n 30 polaroid-mvp/events.ndjson
```
