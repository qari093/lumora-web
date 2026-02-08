#!/usr/bin/env bash
set +e

PORT="${PORT:-3040}"
BASE="http://127.0.0.1:${PORT}"

echo "NEXA status — ${BASE}"
echo

echo "1) ensure server up"
PORT="${PORT}" sh scripts/dev/ensure_up.sh
echo

fetch() {
  local path="$1"
  local hdr="/tmp/nexa_status_headers.txt"
  local body="/tmp/nexa_status_body.txt"
  : >"$hdr"; : >"$body"

  curl -sS -m 10 --retry 2 --retry-delay 1 --retry-all-errors -D "$hdr" "${BASE}${path}" >"$body"
  rc=$?
  echo "• ${path} rc=${rc}"
  if [ "$rc" -eq 0 ]; then
    status="$(tr -d '\r' < "$hdr" | sed -n '1p')"
    echo "  ${status}"
    echo "  x-request-id: $(tr -d '\r' < "$hdr" | awk -F': ' 'tolower($1)=="x-request-id"{print $2; exit}')"
    echo "  x-ratelimit-remaining: $(tr -d '\r' < "$hdr" | awk -F': ' 'tolower($1)=="x-ratelimit-remaining"{print $2; exit}')"
    echo "  body:"
    head -c 380 "$body" || true
  else
    echo "  (failed)"
  fi
  echo
}

echo "2) index"
fetch "/api/nexa"

echo "3) health"
fetch "/api/nexa/health"

echo "✅ NEXA status — done"
exit 0
