#!/bin/sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PORT="${POLAROID_PORT:-8088}"
URL="http://127.0.0.1:${PORT}/polaroid-mvp/index.html"
HEALTH="http://127.0.0.1:${PORT}/polaroid-mvp/health"

echo "========== ▶️ POLAROID LOCAL RUNBOOK ◀️ =========="
echo "ROOT=$ROOT"
echo "PORT=$PORT"
echo "URL=$URL"
echo "HEALTH=$HEALTH"
echo

# Free port (best-effort)
if /usr/sbin/lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  PIDS="$(/usr/sbin/lsof -nP -iTCP:"$PORT" -sTCP:LISTEN 2>/dev/null | /usr/bin/awk 'NR>1{print $2}' | /usr/bin/sort -u | /usr/bin/tr '\n' ' ')"
  if [ -n "${PIDS:-}" ]; then
    echo "• Freeing port $PORT (pids: $PIDS)"
    /bin/kill -TERM $PIDS >/dev/null 2>&1 || true
    /bin/sleep 1
  fi
fi

echo "• Starting server in background"
# Use node from PATH; fallback to /usr/local/bin/node if present
NODEBIN="$(/usr/bin/command -v node || true)"
[ -n "${NODEBIN:-}" ] || NODEBIN="/usr/local/bin/node"

nohup "$NODEBIN" "tools/local-polaroid-server.mjs" >/tmp/polaroid_local_server.log 2>&1 &
PID="$!"
echo "✓ server pid=$PID"
echo

echo "• Waiting for health (up to 12s)"
i=0
while [ $i -lt 12 ]; do
  CODE="$(/usr/bin/curl -sS -o /dev/null -w '%{http_code}' "$HEALTH" || true)"
  if [ "$CODE" = "200" ]; then
    echo "✓ health ok"
    echo
    echo "OPEN:"
    echo "  $URL"
    echo
    echo "TAIL LOG:"
    echo "  tail -n 40 /tmp/polaroid_local_server.log"
    echo
    exit 0
  fi
  i=$((i+1))
  /bin/sleep 1
done

echo "❌ health not ready (last code=$CODE)"
echo "• log tail:"
/usr/bin/tail -n 80 /tmp/polaroid_local_server.log 2>/dev/null || true
exit 2
