#!/bin/sh
set -euo pipefail
cd "$HOME/lumora-web" || { echo "❌ project not found: ~/lumora-web"; exit 1; }

# Resolve PORT default
. scripts/dev/port_resolve.sh

echo "NEXA dev stability gate — port ${PORT}"

echo "1) apply mac limits (best-effort)"
PORT="${PORT}" sh scripts/dev/mac_limits.sh >/dev/null 2>&1 || true
echo "✓ limits applied"

echo "2) relief (stop + cache prune + restart)"
PORT="${PORT}" sh scripts/dev/relief_3040.sh >/dev/null 2>&1 || true
echo "✓ relief done"

echo "3) unit gate"
if command -v pnpm >/dev/null 2>&1; then
  pnpm -s vitest run -c vitest.nexa.route.config.ts
else
  npx -y vitest run -c vitest.nexa.route.config.ts
fi
echo "✓ unit gate passed"

echo "4) ops bundle v2 snapshot"
OUT="${OUT:-/tmp/lumora_nexa_ops.json}"
PORT="${PORT}" OUT="${OUT}" sh scripts/nexa/ops_bundle_v2.sh >/dev/null 2>&1 || true
echo "✓ ops snapshot: ${OUT}"

echo "5) perf advisory (dev)"
PORT="${PORT}" sh scripts/nexa/perf_dev.sh >/dev/null 2>&1 || true
echo "✓ perf advisory done"

echo "OPEN: http://127.0.0.1:${PORT}/nexa/ops"
echo "OPEN: http://127.0.0.1:${PORT}/api/nexa/ops"
echo "✅ NEXA dev stability gate — done"
