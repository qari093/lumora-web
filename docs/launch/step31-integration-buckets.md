# Step 31 Integration Buckets (Re-introduction Order)

Run integration suite via:
- `sh scripts/launch/step31/vitest_integration.sh`

## Bucket A — SSE
- tests/live/events.sse.contract.test.ts
- tests/live/sse.publish.e2e.test.ts

## Bucket B — Health + Portals
- tests/health/health_api_smoke.test.ts
- tests/health/health_smoke.test.ts
- tests/health/ready_api_smoke.test.ts
- tests/health/version_api_smoke.test.ts
- tests/health/middleware_header_contract.test.ts
- tests/health/middleware_health.test.ts
- tests/portals/portals_routes_smoke.test.ts

## Bucket C — Security Headers
- tests/security/security_headers_smoke.test.ts
- tests/security/csp_header_smoke.test.ts
- tests/security/hsts_header_prod_only.test.ts

## Done Criteria
- Unit suite green (no server): `sh scripts/launch/step31/vitest_unit.sh`
- Integration suite green (server runner): `sh scripts/launch/step31/vitest_integration.sh`

## Persona / Manifest (Integration)
- tests/persona/persona_manifest.contract.test.ts
