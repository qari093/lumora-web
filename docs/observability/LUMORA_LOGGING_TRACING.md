# Lumora Logging & Tracing

## Base Modules
- logger.ts
- requestId.ts
- trace.ts

## Rules
- Every API route should emit structured logs
- Every critical request should carry x-request-id
- Every diagnostic route should be no-store
