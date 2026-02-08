#!/usr/bin/env bash
set +e

PORT="${PORT:-3040}"
BASE="http://127.0.0.1:${PORT}"

echo "NEXA healthcheck — ${BASE}"
echo

curl_one() {
  local path="$1"
  local url="${BASE}${path}"
  local hdr="/tmp/nexa_headers.txt"
  local body="/tmp/nexa_body.txt"

  : >"$hdr"
  : >"$body"

  echo "• GET ${path}"
  curl -sS -m 2 -D "$hdr" "$url" >"$body"
  local rc=$?

  # status line (if any)
  local status_line
  status_line="$(tr -d '\r' < "$hdr" | sed -n '1p')"

  if [ "$rc" -ne 0 ]; then
    echo "  ❌ curl rc=${rc} (server down / connection / TLS / timeout)"
    echo "  url=${url}"
    echo "  status=${status_line:-none}"
  else
    echo "  ✓ curl ok"
    echo "  status=${status_line:-unknown}"
  fi

  echo "— headers (first 30) —"
  tr -d '\r' < "$hdr" | sed -n '1,30p' || true
  echo "— body (head 520) —"
  head -c 520 "$body" || true
  echo
}

curl_one "/api/nexa/health"
curl_one "/api/nexa/metrics"
curl_one "/api/nexa/diag"
curl_one "/api/nexa/info"
curl_one "/api/nexa"

echo "✅ NEXA healthcheck — done"
exit 0
