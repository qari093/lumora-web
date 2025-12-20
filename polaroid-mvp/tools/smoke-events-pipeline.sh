#!/bin/sh
set -euo pipefail

cd "$(dirname "$0")/../.." || exit 1

HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-8088}"
BASE="http://$HOST:$PORT"
OUT="polaroid-mvp/events.ndjson"

echo "========== ▶️ POLAROID SMOKE (EVENTS PIPELINE) ◀️ =========="
echo "• Starting local server in background: $BASE/polaroid-mvp/index.html"
node polaroid-mvp/tools/local-polaroid-server.mjs >/tmp/polaroid_local_server.log 2>&1 &
PID="$!"

cleanup() {
  if kill -0 "$PID" >/dev/null 2>&1; then
    kill "$PID" >/dev/null 2>&1 || true
    sleep 0.2 || true
    kill -9 "$PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT INT TERM

# Wait for health
i=0
while [ "$i" -lt 30 ]; do
  code="$(curl -sS -o /dev/null -w "%{http_code}" "$BASE/polaroid-mvp/health" || true)"
  if [ "$code" = "200" ]; then break; fi
  i=$((i+1))
  sleep 0.2
done

code="$(curl -sS -o /dev/null -w "%{http_code}" "$BASE/polaroid-mvp/health" || true)"
[ "$code" = "200" ] || { echo "❌ health not ready (code=$code)"; tail -n 80 /tmp/polaroid_local_server.log || true; exit 2; }
echo "✓ Health OK"

# GET index
code="$(curl -sS -o /dev/null -w "%{http_code}" "$BASE/polaroid-mvp/index.html" || true)"
[ "$code" = "200" ] || { echo "❌ index not served (code=$code)"; exit 2; }
echo "✓ index served"

# POST NDJSON
ts="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
line="{\"v\":1,\"t\":\"$ts\",\"type\":\"smoke\",\"data\":{\"ok\":true}}"
code="$(printf "%s\n" "$line" | curl -sS -o /dev/null -w "%{http_code}" -X POST -H "content-type: application/x-ndjson" --data-binary @- "$BASE/polaroid-mvp/events.ndjson" || true)"
[ "$code" = "204" ] || { echo "❌ events POST failed (code=$code)"; exit 2; }
echo "✓ events POST 204"

# Verify file append
[ -f "$OUT" ] || { echo "❌ missing $OUT after POST"; exit 2; }
tail -n 5 "$OUT" | grep -q "\"type\":\"smoke\"" || { echo "❌ smoke line not found in $OUT"; echo "• tail:"; tail -n 10 "$OUT" || true; exit 2; }
echo "✓ events.ndjson appended"

echo "SMOKE_OK"
echo "========== ▲ END POLAROID SMOKE ▲ =========="
