#!/usr/bin/env bash
set +e

PORT="${PORT:-3040}"
BASE="http://127.0.0.1:${PORT}"

echo "NEXA healthcheck — ${BASE}"
echo

curl_one() {
  local path="$1"
  echo "• GET ${path}"
  curl -sS -D /tmp/nexa_headers.txt "${BASE}${path}" | head -c 320
  echo
  echo "— headers (first 25) —"
  tr -d '\r' < /tmp/nexa_headers.txt | sed -n '1,25p' || true
  echo
}

curl_one "/api/nexa/health"
curl_one "/api/nexa/metrics"
curl_one "/api/nexa/diag"
curl_one "/api/nexa/info"
curl_one "/api/nexa"

echo "✅ NEXA healthcheck — done"
exit 0
