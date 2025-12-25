#!/bin/sh
set -euo pipefail
PORT="${PORT:-3000}"
BASE="http://127.0.0.1:$PORT"
PIDFILE="/tmp/lumora_final_prod_daemon_${PORT}.pid"
LOG="/tmp/lumora_final_prod_daemon_${PORT}.log"

pid="$(cat "$PIDFILE" 2>/dev/null || true)"
echo "PORT=$PORT"
echo "PIDFILE=$PIDFILE"
echo "LOG=$LOG"
echo "PID=${pid:-none}"
if [ -n "${pid:-}" ] && kill -0 "$pid" >/dev/null 2>&1; then
  echo "PROC=alive"
else
  echo "PROC=dead"
fi
code="$(curl -sS -o /dev/null -w "%{http_code}" "$BASE/api/health" 2>/dev/null || true)"
[ -n "${code:-}" ] || code="000"
echo "HEALTH_HTTP=$code"
