#!/bin/sh
set -euo pipefail

PORT="${PORT:-3000}"
BASE="${LIVE_BASE_URL:-http://127.0.0.1:${PORT}}"

echo "Live Health Macro — START"
echo "BASE=$BASE"
echo

echo "• GET /api/live/portal-hubs"
curl -sS --max-time 2 -o /tmp/live_health_portal_hubs.json -w "HTTP %{http_code}\n" "$BASE/api/live/portal-hubs" | grep -q "HTTP 200" || {
  echo "❌ portal-hubs not reachable"
  exit 2
}
echo "✓ portal-hubs 200"

echo "• GET /api/live/rooms"
curl -sS --max-time 2 -o /tmp/live_health_rooms.json -w "HTTP %{http_code}\n" "$BASE/api/live/rooms" | grep -q "HTTP 200" || {
  echo "❌ rooms not reachable"
  exit 3
}
echo "✓ rooms 200"

echo
echo "• Run live tests"
if command -v pnpm >/dev/null 2>&1; then
  pnpm -s vitest run tests/live
else
  npx --yes vitest run tests/live
fi
echo "✓ live tests"

echo "Live Health Macro — OK"
