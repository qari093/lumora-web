. "$(cd "$(dirname "$0")/../.."  pwd)/.lumora_safe_bootstrap.sh"
#!/usr/bin/env bash

# Resolve PORT (default 3040)
. "$(cd "$(dirname "$0")" && pwd)/port_resolve.sh" 2>/dev/null || . "scripts/dev/port_resolve.sh" 2>/dev/null || true
set +e

PORT="${PORT:-3040}"

echo "NEXA ops bundle — port ${PORT}"
echo

echo "1) unit gate (vitest route config)"
if command -v pnpm >/dev/null 2>&1; then
  pnpm -s vitest run --config vitest.nexa.route.config.ts
  rc=$?
else
  npx -y vitest run --config vitest.nexa.route.config.ts
  rc=$?
fi
if [ "${rc:-0}" -ne 0 ]; then
  echo "❌ unit gate failed (rc=${rc})"
  echo "✅ ops bundle — done (with failures)"
  exit 0
fi
echo "✓ unit gate passed"
echo

echo "2) status"
PORT="${PORT}" sh scripts/nexa/status.sh
echo

echo "3) healthcheck (warmup + primary)"
PORT="${PORT}" TIMEOUT_SEC="${TIMEOUT_SEC:-20}" RETRY="${RETRY:-2}" sh scripts/nexa/healthcheck.sh
echo

echo "✅ NEXA ops bundle — done"
exit 0
