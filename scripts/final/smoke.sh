#!/bin/sh
set -euo pipefail

PORT="${PORT:-3000}"
BASE="http://127.0.0.1:$PORT"

echo "Lumora Final Smoke (PORT=$PORT)"
for p in "/api/health" "/" "/fyp" "/share" "/gmar" "/nexa" "/movies/portal" "/api/admin/testers/summary"; do
  c="$(curl -sS -o /dev/null -w "%{http_code}" "$BASE$p" 2>/dev/null || true)"
  [ "$c" = "200" ] || { echo "❌ $p -> $c"; exit 2; }
  echo "✓ $p -> $c"
done
echo "✓ final smoke OK"
