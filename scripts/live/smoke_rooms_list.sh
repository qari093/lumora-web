#!/bin/sh
set -euo pipefail

PORT="${PORT:-3000}"
BASE="${LIVE_BASE_URL:-http://127.0.0.1:${PORT}}"

echo "Live Smoke — Rooms List"
echo "BASE=$BASE"
echo

req() {
  path="$1"
  expect="$2"
  echo "• GET $path (expect $expect)"
  code="$(curl -sS --max-time 2 -D "/tmp/lumora_live_rooms_smoke_headers_$(echo "$path" | tr '/:' '__').txt" \
    -o "/tmp/lumora_live_rooms_smoke_body_$(echo "$path" | tr '/:' '__').txt" \
    -w "%{http_code}" \
    "$BASE$path" || true)"
  echo "HTTP $code"
  tr -d '\r' < "/tmp/lumora_live_rooms_smoke_headers_$(echo "$path" | tr '/:' '__').txt" | sed -n '1,18p' || true
  echo "— body head —"
  head -c 360 "/tmp/lumora_live_rooms_smoke_body_$(echo "$path" | tr '/:' '__').txt" || true
  echo
  if [ "$code" != "$expect" ]; then
    echo "❌ Unexpected status for $path: got $code expected $expect"
    exit 2
  fi
}

req "/api/live/rooms" "200"
req "/api/live/room-list" "410"
req "/api/live/rooms/list" "410"
req "/api/live/rooms/public" "410"

echo "✓ Smoke done"
