#!/usr/bin/env bash

# Resolve PORT (default 3040)
. "$(cd "$(dirname "$0")" && pwd)/port_resolve.sh" 2>/dev/null || . "scripts/dev/port_resolve.sh" 2>/dev/null || true
set +e

PORT="${PORT:-3040}"

echo "NEXA smoke — port ${PORT}"
echo

echo "1) Ensure server up"
sh scripts/dev/ensure_up.sh
echo

echo "2) Run NEXA healthcheck"
PORT="${PORT}" sh scripts/nexa/healthcheck.sh
echo

echo "✅ NEXA smoke — done"
exit 0
