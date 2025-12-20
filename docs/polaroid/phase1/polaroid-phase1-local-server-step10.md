# Polaroid — Phase 1 Local Server + Events Pipeline Smoke (Step 10)

UTC: 2025-12-20T11:58:15Z

## Local server
Runs a single server that:
- Serves: http://127.0.0.1:8088/polaroid-mvp/index.html
- Receives: POST /polaroid-mvp/events.ndjson
- Writes: polaroid-mvp/events.ndjson

### Run
```sh
HOST=127.0.0.1 PORT=8088 polaroid-mvp/tools/run-local-polaroid-server.sh
```

## Smoke test
```sh
polaroid-mvp/tools/smoke-events-pipeline.sh
```
