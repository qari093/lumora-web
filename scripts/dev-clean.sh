. "$(cd "$(dirname "$0")/../.."  pwd)/.lumora_safe_bootstrap.sh"
#!/usr/bin/env bash
set -euo pipefail
# Usage:
#   ./scripts/dev-clean.sh                 # opens homepage
#   ./scripts/dev-clean.sh /dev/zencoin/auto-test
#   PORT=4000 ./scripts/dev-clean.sh /aegis
#   OPEN=0 ./scripts/dev-clean.sh          # do not auto-open browser

PORT="${PORT:-3000}"
ROUTE="${1:-/}"
OPEN_BROWSER="${OPEN:-1}"

echo "🔹 Stopping any running Next.js dev servers..."
pkill -f "next dev" >/dev/null 2>&1 || true

echo "🔹 Ensuring project root: $(pwd)"
if [ ! -f "package.json" ]; then
  echo "❌ Run this from your project root (where package.json lives)."
  exit 1
fi

echo "🔹 Removing .next cache (may prompt for password)..."
if [ -d ".next" ]; then
  sudo rm -rf .next || { echo "❌ Failed to remove .next"; exit 1; }
fi

echo "🔹 Starting Next.js on port ${PORT}..."
( PORT="${PORT}" npx next dev ) &

NEXT_PID=$!
echo "   ↳ dev PID: ${NEXT_PID}"
echo "🔹 Waiting for server to boot..."
for i in {1..10}; do
  sleep 1
  if curl -fsS "http://localhost:${PORT}" >/dev/null 2>&1; then
    break
  fi
done

if [ "${OPEN_BROWSER}" = "1" ]; then
  TARGET="http://localhost:${PORT}${ROUTE}"
  echo "🔹 Opening ${TARGET}"
  if command -v open >/dev/null 2>&1; then
    open "${TARGET}"
  else
    echo "ℹ️  'open' not found; please navigate to ${TARGET}"
  fi
else
  echo "ℹ️  OPEN=0 set — not opening browser automatically."
fi

echo "✅ Dev server running on http://localhost:${PORT}  (press Ctrl+C to stop here; background PID ${NEXT_PID})"
wait ${NEXT_PID}
