#!/bin/sh
set -euo pipefail

echo "========== ▶️ POLAROID SMOKE (EVENTS PIPELINE) ◀️ =========="

ROOT="$(pwd)"
HOST="127.0.0.1"
PORT="${PORT:-8088}"
BASE="http://${HOST}:${PORT}"
HEALTH1="${BASE}/polaroid-mvp/health"
PAGE="${BASE}/polaroid-mvp/index.html"
EVENTS_ENDPOINT="${BASE}/polaroid-mvp/events"
EVENTS_FILE="${ROOT}/polaroid-mvp/events.ndjson"
SRV="${ROOT}/polaroid-mvp/tools/local-polaroid-server.mjs"
LOG="/tmp/polaroid_server_${PORT}.log"

# Free port
if command -v lsof >/dev/null 2>&1; then
  PIDS="$(lsof -ti tcp:"$PORT" 2>/dev/null || true)"
  if [ -n "${PIDS:-}" ]; then
    echo "• Freeing port $PORT (pids: $PIDS)"
    for p in $PIDS; do kill -TERM "$p" 2>/dev/null || true; done
    sleep 1
  fi
fi

rm -f "$LOG" >/dev/null 2>&1 || true

echo "• Starting local server in background: $PAGE"
nohup node "$SRV" >"$LOG" 2>&1 &
SPID="$!"
sleep 1

cleanup() {
  kill -TERM "$SPID" >/dev/null 2>&1 || true
}
trap cleanup EXIT INT TERM

# Wait health
echo "• Waiting for health: $HEALTH1"
i=0
code="000"
while [ $i -lt 25 ]; do
  code="$(/usr/bin/curl -sS -o /dev/null -w "%{http_code}" "$HEALTH1" || true)"
  if [ "$code" = "200" ]; then break; fi
  i=$((i+1))
  sleep 1
done

if [ "$code" != "200" ]; then
  echo "❌ health not ready (code=$code)"
  echo "• Tail log:"
  tail -n 120 "$LOG" || true
  exit 2
fi
echo "✓ health ok"
echo

# Fetch page
pcode="$(/usr/bin/curl -sS -o /dev/null -w "%{http_code}" "$PAGE" || true)"
if [ "$pcode" != "200" ] && [ "$pcode" != "304" ]; then
  echo "❌ page not reachable (code=$pcode)"
  exit 3
fi
echo "✓ page reachable (code=$pcode)"
echo

# Post one event
ts="$(/bin/date -u +"%Y-%m-%dT%H:%M:%SZ")"
payload="{\"ts\":\"$ts\",\"type\":\"smoke\",\"name\":\"tap\",\"ok\":true}"
ecode="$(printf "%s" "$payload" | /usr/bin/curl -sS -o /dev/null -w "%{http_code}" -X POST -H "content-type: application/json" --data-binary @- "$EVENTS_ENDPOINT" || true)"
if [ "$ecode" != "200" ]; then
  echo "❌ event post failed (code=$ecode)"
  exit 4
fi
echo "✓ event posted"
echo

# Validate file has line
if [ ! -f "$EVENTS_FILE" ]; then
  echo "❌ events file missing: $EVENTS_FILE"
  exit 5
fi

lines="$(/usr/bin/wc -l < "$EVENTS_FILE" | /usr/bin/tr -d ' ' || true)"
case "$lines" in
  ''|*[!0-9]*) echo "❌ could not read events line count"; exit 6 ;;
esac
if [ "$lines" -lt 1 ]; then
  echo "❌ events file empty"
  exit 7
fi

echo "✓ events file ok (lines=$lines)"
echo "PASS"
