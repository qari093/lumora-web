#!/bin/sh
set -euo pipefail
PORT="${PORT:-3000}"
BASE="http://127.0.0.1:${PORT}"

echo "Lumora Final Smoke (PORT=${PORT})"

check() {
  p="$1"
  # IMPORTANT: use %%{http_code} so the shell doesn't treat %{...} as printf format later (we don't use printf anyway)
  c="$(curl -sS -o /dev/null -w "%{http_code}" "${BASE}${p}" 2>/dev/null || true)"
  [ "${c:-000}" = "200" ] || { echo "❌ ${p} -> ${c:-000}"; exit 2; }
  echo "✓ ${p} -> ${c}"
}

check "/api/health"
check "/"
check "/fyp"
check "/videos"
check "/watch/demo-1"
check "/gmar"
check "/nexa"
check "/movies/portal"
check "/celebrations"
check "/share"
check "/live"

echo "✓ final smoke OK"
