. "$(cd "$(dirname "$0")/../.."  pwd)/.lumora_safe_bootstrap.sh"
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


# Snapshot mirroring (generic + port-specific)
PORT_CLEAN="$(printf "%s" "${PORT:-3040}" | tr -cd '0-9')"
[ -n "${PORT_CLEAN}" ] || PORT_CLEAN="3040"
GENERIC_OUT="${OUT:-/tmp/lumora_nexa_ops.json}"
PORT_OUT="/tmp/lumora_nexa_ops_${PORT_CLEAN}.json"

# Ensure generic exists; if OUT was custom, also mirror to generic
if [ -f "${GENERIC_OUT}" ]; then
  cp -f "${GENERIC_OUT}" "${PORT_OUT}" 2>/dev/null || true
else
  # If custom OUT is used, mirror it to generic path
  if [ -n "${OUT:-}" ] && [ -f "${OUT}" ]; then
    cp -f "${OUT}" "${GENERIC_OUT}" 2>/dev/null || true
    cp -f "${OUT}" "${PORT_OUT}" 2>/dev/null || true
  fi
fi
echo "✓ snapshot mirror: ${GENERIC_OUT} -> ${PORT_OUT}"


echo "✅ NEXA ops bundle v2 — done"
