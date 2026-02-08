#!/bin/sh

# Resolve PORT (default 3040)
. "$(cd "$(dirname "$0")" && pwd)/port_resolve.sh" 2>/dev/null || . "scripts/dev/port_resolve.sh" 2>/dev/null || true
set -euo pipefail

cd "${LUMORA_ROOT:-$HOME/lumora-web}"
PORT="${PORT:-3040}"
OUT="${OUT:-/tmp/lumora_nexa_ops.json}"

echo "NEXA ops bundle v2 — port ${PORT}"
echo

echo "1) dev cycle (stop->run->smoke)"
if [ -f "scripts/nexa/dev_cycle.sh" ]; then
  PORT="$PORT" sh scripts/nexa/dev_cycle.sh || true
else
  echo "• missing scripts/nexa/dev_cycle.sh (skipping)"
fi
echo

echo "2) ops bundle (tests + status + healthcheck)"
if [ -f "scripts/nexa/ops_bundle.sh" ]; then
  PORT="$PORT" sh scripts/nexa/ops_bundle.sh || true
else
  echo "• missing scripts/nexa/ops_bundle.sh (skipping)"
fi
echo

echo "3) perf (DEV advisory only)"
if [ -f "scripts/nexa/perf_dev.sh" ]; then
  PORT="$PORT" sh scripts/nexa/perf_dev.sh || true
else
  echo "• missing scripts/nexa/perf_dev.sh (skipping)"
fi
echo

echo "4) export ops json"
if [ -f "scripts/nexa/export_ops_json.sh" ]; then
  PORT="$PORT" OUT="$OUT" sh scripts/nexa/export_ops_json.sh || true
  echo "✓ ops json: $OUT"
else
  echo "• missing scripts/nexa/export_ops_json.sh (skipping)"
fi
echo

echo "✅ NEXA ops bundle v2 — done"
