cd "$HOME/lumora-web" || { echo "project missing at ~/lumora-web"; exit 1; }
mkdir -p docs/lumaspace

cat > docs/lumaspace/state-contract.md <<'MD'
LumaSpace State Contract v1
===========================

Defines the current contract for the LumaSpace state layer and its UI + CI wiring.

1) HTTP Endpoints
-----------------

1.1  /api/lumaspace/ping
    - Purpose: lightweight uptime / health endpoint
    - Method: GET
    - Response example (200 OK):
      { "ok": true, "service": "LumaSpace", "role": "health-ping", "ts": "2025-11-10T15:07:21Z", "unix": 1762787241, "env": "development" }

1.2  /api/lumaspace/state
    - Purpose: single source of truth for feature flags and sections
    - Method: GET
    - Schema: schemaVersion = 1
    - Response example (200 OK):
      {
        "ok": true,
        "schemaVersion": 1,
        "mode": "demo",
        "version": "1.0.0",
        "updatedAt": "2025-11-10T15:25:13Z",
        "sections": [
          { "id": "reflection-journal", "label": "Reflection Journal", "enabled": true, "weight": 1.0 },
          { "id": "shadow-journal", "label": "Shadow Journal", "enabled": true, "weight": 0.95 },
          { "id": "emotion-heatmap", "label": "Emotion Heatmap", "enabled": true, "weight": 0.9 },
          { "id": "breath-room", "label": "Breath Room", "enabled": true, "weight": 0.85 }
        ]
      }

2) Consumers
------------

Server:
  - app/lumaspace/debug/page.tsx
  - Fetches /api/lumaspace/state (no-store) and renders:
    - mode, version, updatedAt
    - list of sections with enabled/disabled and weight
    - raw payload for debugging

Client:
  - app/_components/lumaspace/state-banner.tsx
  - Fetches /api/lumaspace/state on the client and renders:
    - compact banner (mode + version)
    - full banner (mode, version, updatedAt, enabled modules list)
  - Used in:
    - app/lumaspace/page.tsx  (compact)
    - app/me/space/page.tsx   (full)

3) Tests
--------

Vitest specs:
  - tests/api.lumaspace.ping.spec.ts
  - tests/api.lumaspace.state.spec.ts
  - tests/lumaspace.state-banner.util.spec.ts

Commands:
  - npm test
  - npm run test:lumaspace

4) CI Integration
-----------------

  - scripts/integration/phase25.step11.sh
      HTTP-level contract verifier for /api/lumaspace/state

  - scripts/integration/phase25.step13.sh
      Wrapper to run LumaSpace-related tests

  - .github/workflows/lumaspace-ci.yml
      Starts Next dev server, runs state contract verifier and test:lumaspace

5) Versioning Rules
-------------------

  - schemaVersion is currently 1
  - Any breaking change to /api/lumaspace/state must:
      * bump schemaVersion (1 -> 2 -> 3, ...)
      * update:
          - tests/api.lumaspace.state.spec.ts
          - scripts/integration/phase25.step11.sh
          - any consumers that depend on the old shape

  - Additive, backwards-compatible changes may keep schemaVersion at 1

6) Future Notes
---------------

  - Consider adding /api/lumaspace/state/summary for lightweight dashboards
  - Gate /lumaspace/debug behind admin or dev auth in non-internal environments
MD

echo "Step 25.15 — docs/lumaspace/state-contract.md created"