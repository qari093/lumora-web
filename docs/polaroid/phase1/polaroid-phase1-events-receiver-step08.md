# Polaroid — Phase 1 Local Events Receiver (Step 08)

UTC: 2025-12-20T11:53:38Z

## What this adds
A minimal local HTTP server that:
- Serves `/polaroid-mvp/index.html` from repo root
- Accepts POST beacons to `/polaroid-mvp/events.ndjson` (and `/events.ndjson`) and appends to:
  `polaroid-mvp/events.ndjson`

## Run
```sh
PORT=8088 polaroid-mvp/tools/run-events-receiver.sh
```

## Verify
1) Open: http://127.0.0.1:8088/polaroid-mvp/index.html
2) Tap colors + Save PNG
3) Check: `tail -n 20 polaroid-mvp/events.ndjson`
