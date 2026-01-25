# Launch — Step 31 Sub-Track (31A–31F)

This file isolates Step 31 into a controlled sub-track to eliminate repeated retries.

## 31A — Freeze + Toolchain Lock + Test Split
- Capture Step 31 freeze snapshot (git + diffs + runtime pins)
- Lock toolchain decision:
  - Node: v20.x (repo standard)
  - pnpm: v10.x (per `engines.pnpm`)
  - Enforce via `package.json#packageManager` + Corepack pathing

## 31B — Single Test Strategy Decision
- Default: **Unit baseline** runs without a booted Next server
- Integration tests explicitly opt-in (environment gate)

## 31C — Split Vitest Suites
- Unit suite: fast, deterministic, no server dependency
- Integration suite: boots Next in a controlled runner; shuts down cleanly

## 31D — Gate Integration Tests (Temporary)
- Integration suites disabled by default (unit suite must remain green)

## 31E — Restore Green Unit Baseline
- Unit suite must pass in isolation before any integration re-introduction

## 31F — Re-introduce Integration Tests Incrementally
- Add integration suites back one-by-one
- Validate independently:
  - SSE tests
  - Health / portal contracts
  - Security headers
- Mark Step 31 DONE when all integration suites are green under the dedicated runner
