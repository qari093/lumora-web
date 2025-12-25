#!/bin/sh
set -euo pipefail
PORT="${PORT:-3000}"
PIDFILE="/tmp/lumora_final_prod_daemon_${PORT}.pid"
if [ -f "$PIDFILE" ]; then
  pid="$(cat "$PIDFILE" 2>/dev/null || true)"
  if [ -n "${pid:-}" ]; then
    kill "$pid" >/dev/null 2>&1 || true
    sleep 1
    kill -9 "$pid" >/dev/null 2>&1 || true
    echo "✓ stopped PID=$pid"
  fi
  rm -f "$PIDFILE" >/dev/null 2>&1 || true
else
  echo "ℹ no pidfile: $PIDFILE"
fi
pkill -f "next start" >/dev/null 2>&1 || true
