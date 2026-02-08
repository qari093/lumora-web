. "$(cd "$(dirname "$0")/../.."  pwd)/.lumora_safe_bootstrap.sh"
#!/usr/bin/env bash

# Resolve PORT (default 3040)
. "$(cd "$(dirname "$0")" && pwd)/port_resolve.sh" 2>/dev/null || . "scripts/dev/port_resolve.sh" 2>/dev/null || true
set +e

PORT="${PORT:-3040}"
BASE="http://127.0.0.1:${PORT}"

# Next.js dev may cold-compile each route on first hit; keep timeouts generous.
TIMEOUT_SEC="${TIMEOUT_SEC:-20}"
RETRY="${RETRY:-2}"
RETRY_DELAY="${RETRY_DELAY:-1}"

echo "NEXA healthcheck — ${BASE}"
echo "timeout=${TIMEOUT_SEC}s retry=${RETRY} retry_delay=${RETRY_DELAY}s"
echo

curl_one() {
  local path="$1"
  local url="${BASE}${path}"
  local hdr="/tmp/nexa_headers.txt"
  local body="/tmp/nexa_body.txt"

  : >"$hdr"
  : >"$body"

  echo "• GET ${path}"
  # --retry-all-errors is supported in modern curl; if not, curl will still run and return nonzero.
  curl -sS -m "${TIMEOUT_SEC}" \
    --retry "${RETRY}" --retry-delay "${RETRY_DELAY}" --retry-all-errors \
    -D "$hdr" "$url" >"$body"
  local rc=$?

  local status_line
  status_line="$(tr -d '\r' < "$hdr" | sed -n '1p')"

  if [ "$rc" -ne 0 ]; then
    echo "  ❌ curl rc=${rc}"
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
  return 0
}

# Warmup pass (helps avoid rc=28 on first compile-heavy endpoints)
echo "• Warmup pass (route compilation)"
curl_one "/api/nexa/metrics"
curl_one "/api/nexa/diag"
curl_one "/api/nexa/info"
curl_one "/api/nexa"
echo "✓ warmup done"
echo

# Primary pass (should now be fast and stable)
echo "• Primary pass"
curl_one "/api/nexa/health"
curl_one "/api/nexa/metrics"
curl_one "/api/nexa/diag"
curl_one "/api/nexa/info"
curl_one "/api/nexa"

echo "✅ NEXA healthcheck — done"
exit 0
