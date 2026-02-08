#!/bin/sh
set -euo pipefail

PORT="${PORT:-3040}"
OUT="${OUT:-/tmp/lumora_nexa_ops.json}"
export PORT OUT
export NEXA_BASE_URL="${NEXA_BASE_URL:-http://127.0.0.1:${PORT}}"

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
  
echo "• ensure dev server up (PORT=${PORT})"
if [ -f "scripts/dev/ensure_up.sh" ]; then
  if ! PORT="${PORT}" sh scripts/dev/ensure_up.sh >/dev/null 2>&1; then
    echo "  • ensure_up says server down; attempting run_3040"
    if [ -f "scripts/dev/run_3040.sh" ]; then
      PORT="${PORT}" sh scripts/dev/run_3040.sh >/dev/null 2>&1 || true
    fi
    PORT="${PORT}" sh scripts/dev/ensure_up.sh >/dev/null 2>&1 || true
  fi
fi
echo "✓ ensure step done"
echo
PORT="${PORT}" NEXA_BASE_URL="${NEXA_BASE_URL}" pnpm -s vitest run -c vitest.nexa.route.config.ts
else
  PORT="${PORT}" NEXA_BASE_URL="${NEXA_BASE_URL}" npx -y vitest run -c vitest.nexa.route.config.ts
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
