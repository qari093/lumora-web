# Unified Signal Normalization

## Purpose
All platform ingests must resolve to the single LumoraSignal schema.

## Modules
- src/lib/signals/core/normalize.ts
- src/lib/signals/core/providerRegistry.ts

## Endpoint
- GET /api/signals/normalize?limit=2

## Rule
No downstream system should consume provider-specific raw shapes.
