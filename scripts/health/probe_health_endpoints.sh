#!/usr/bin/env sh
set -euo pipefail

PORT="${PORT:-8088}"
BASE="${BASE:-http://127.0.0.1:${PORT}}"

if command -v jq >/dev/null 2>&1; then
  JQ="jq"
else
  JQ=""
fi

probe() {
  path="$1"
  label="$2"
  echo "──────────────────────────────────────────────"
  echo "GET ${path}  (${label})"
  echo "BASE=${BASE}"
  echo "──────────────────────────────────────────────"
  # Print headers (first 20 lines) then body (first 20 lines)
  resp="$(curl -sS -i --max-time 8 "${BASE}${path}" || true)"
  echo "$resp" | sed -n '1,20p'
  echo
  body="$(printf "%s" "$resp" | awk 'BEGIN{h=1} {if(h && $0==""){h=0; next} if(!h) print}')"
  if [ -n "$JQ" ]; then
    printf "%s" "$body" | jq -c . 2>/dev/null || printf "%s\n" "$body" | sed -n '1,20p'
  else
    printf "%s\n" "$body" | sed -n '1,20p'
  fi
  echo
}

echo "Lumora Health Probe"
echo "ts_utc=$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo

probe "/api/_health" "_health alias (middleware rewrite expected)"
probe "/api/health" "primary health (no rewrite header expected)"
probe "/api/healthz" "healthz (no rewrite header expected)"
probe "/api/health?deep=1" "deep health (may be slower)"

echo "OK"
