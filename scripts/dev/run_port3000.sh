#!/bin/sh
set -euo pipefail
cd ~/lumora-web || { echo "❌ project not found"; exit 1; }

PORT="${PORT:-3000}"
LOG="${LOG:-/tmp/lumora_dev_port3000.log}"

# Free port (macOS-friendly)
if command -v lsof >/dev/null 2>&1; then
  PIDS="$(lsof -ti tcp:${PORT} 2>/dev/null || true)"
  if [ -n "${PIDS:-}" ]; then
    kill $PIDS || true
    sleep 0.6
  fi
fi

rm -f "$LOG" || true
export PORT

if command -v pnpm >/dev/null 2>&1; then
  (pnpm -s dev >"$LOG" 2>&1 &)
else
  (npm run -s dev >"$LOG" 2>&1 &)
fi

BASE="http://127.0.0.1:${PORT}"
i=0
while [ $i -lt 120 ]; do
  code="$(curl -sS --max-time 2 -o /dev/null -w "%{http_code}" "${BASE}/live/healthz" || true)"
  if [ "$code" = "200" ]; then
    echo "$BASE"
    echo "✓ Dev ready (log: $LOG)"
    exit 0
  fi
  i=$((i+1)); sleep 1
done

echo "❌ Dev not ready on ${BASE} (log: $LOG)" >&2
tail -n 220 "$LOG" 2>/dev/null || true
exit 1
