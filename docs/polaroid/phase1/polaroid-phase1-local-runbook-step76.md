# Polaroid Phase 1 — Local Runbook (Step 76)

UTC: 2025-12-20T13:51:20Z

## Start local Polaroid server (port 8088 default)
```bash
polaroid-mvp/tools/run-local-polaroid.sh
```

## Smoke test (events pipeline)
```bash
polaroid-mvp/tools/smoke-events-pipeline.sh
```

## Notes
- Server implementation: `polaroid-mvp/tools/local-polaroid-server.mjs`
- Server log: `/tmp/polaroid_local_server.log`
- If port is in use, the runbook tries to free it safely.
