# Lumora Error Handling

## Base Pieces
- normalizeError.ts
- CrashBoundary.tsx
- app/error.tsx

## Rules
- UI crashes must render a safe fallback
- Global app errors must offer a retry path
- Structured error logging must be emitted to console/log pipeline
