. "$(cd "$(dirname "$0")/../.."  pwd)/.lumora_safe_bootstrap.sh"
#!/usr/bin/env bash

# Resolve PORT (default 3040)
. "$(cd "$(dirname "$0")" && pwd)/port_resolve.sh" 2>/dev/null || . "scripts/dev/port_resolve.sh" 2>/dev/null || true
set +e

PORT="${PORT:-3040}"
URL="http://127.0.0.1:${PORT}/api/nexa/health"

TIMEOUT_SEC="${TIMEOUT_SEC:-10}"
RETRY="${RETRY:-2}"
RETRY_DELAY="${RETRY_DELAY:-1}"

echo "Ensure dev server is up — ${URL}"
echo "timeout=${TIMEOUT_SEC}s retry=${RETRY} retry_delay=${RETRY_DELAY}s"
echo

curl -sS -m "${TIMEOUT_SEC}" \
  --retry "${RETRY}" --retry-delay "${RETRY_DELAY}" --retry-all-errors \
  "${URL}" >/dev/null 2>&1

if [ "$?" -eq 0 ]; then
  echo "✓ Server up on port ${PORT}"
  exit 0
fi

echo "• Server not reachable yet (dev cold-compile or server down)."
echo
echo "RUN THIS IN A NEW TERMINAL:"
echo "  cd ~/lumora-web && PORT=${PORT} pnpm -s dev"
echo
echo "Then re-run:"
echo "  PORT=${PORT} TIMEOUT_SEC=${TIMEOUT_SEC} RETRY=${RETRY} sh scripts/dev/ensure_up.sh"
echo
exit 0
