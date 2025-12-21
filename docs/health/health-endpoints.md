# Lumora — Health Endpoints

This document defines the **official, stable health-check contract** for `lumora-web`.
Editor-safe. No generators. No heredocs.

────────────────────────────────────────────

## Primary

### GET /api/health
Main health endpoint for the Lumora web runtime.

Guarantees:
- Always returns JSON
- Never blocks on external I/O
- Safe for load balancers, uptime monitors, and CI probes

Example:
{
  "ok": true,
  "service": "lumora-web",
  "route": "/api/health",
  "ts": "2025-12-21T11:51:48.072Z",
  "node": "v24.7.0",
  "env": "development"
}

────────────────────────────────────────────

### GET /api/health?deep=1
Extended internal health probe.

Notes:
- May be slower than `/api/health`
- Base response is never blocked by deep checks
- Uses strict timeouts and safe fallbacks

Example:
{
  "ok": true,
  "service": "lumora-web",
  "route": "/api/health",
  "ts": "2025-12-21T11:51:48.824Z",
  "node": "v24.7.0",
  "env": "development",
  "deep": true,
  "timeout_ms": 1500,
  "base_url": "http://127.0.0.1:8088",
  "checks": {
    "self_healthz": {
      "ok": true,
      "status": 200
    }
  }
}

────────────────────────────────────────────

## Secondary

### GET /api/healthz
Lightweight JSON health endpoint.

Purpose:
- Internal probes
- Middleware rewrite target
- Lowest possible overhead

Example:
{
  "ok": true,
  "service": "lumora",
  "ts": 1766317908451
}

────────────────────────────────────────────

## Alias

### GET /api/_health
Alias for `/api/healthz`.

Important:
- Not a real API route
- Implemented exclusively via middleware rewrite

Reason:
Next.js App Router treats paths starting with `_` specially.
Direct API routes like `/api/_health` may emit HTML 404 responses.

Rewrite behavior:
/api/_health → /api/healthz

Observed:
- HTTP 200
- content-type: application/json
- x-middleware-rewrite: /api/healthz

────────────────────────────────────────────

## Local Probe

pnpm -s run health:probe

────────────────────────────────────────────

## Stability Contract

- `/api/health` never blocks
- `/api/health?deep=1` always returns base JSON
- `/api/_health` never emits HTML
- All endpoints are covered by automated tests

Status: LOCKED / PRODUCTION-SAFE
