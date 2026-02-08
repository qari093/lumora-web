#!/usr/bin/env bash
set +e

PORT="${PORT:-3040}"
URL="http://127.0.0.1:${PORT}/api/nexa/health"
PID_FILE=".lumora_dev_${PORT}.pid"
LOG_FILE="/tmp/lumora_dev_${PORT}.log"

echo "Lumora dev runner — port ${PORT}"
echo

# If already up, do nothing.
curl -sS -m 1 "${URL}" >/dev/null 2>&1
if [ "$?" -eq 0 ]; then
  echo "✓ Server already reachable: ${URL}"
  exit 0
fi

# If pid file exists, see if process still alive.
if [ -f "${PID_FILE}" ]; then
  pid="$(cat "${PID_FILE}" 2>/dev/null)"
  if [ -n "${pid:-}" ] && kill -0 "${pid}" >/dev/null 2>&1; then
    echo "• Found existing dev pid=${pid} (still running). Waiting for readiness..."
  else
    echo "• Removing stale pid file ${PID_FILE}"
    rm -f "${PID_FILE}" || true
  fi
fi

# Start dev server in background if not running.
if [ ! -f "${PID_FILE}" ]; then
  echo "• Starting dev server -> ${LOG_FILE}"
  echo "  cmd: PORT=${PORT} pnpm -s dev"
  if command -v pnpm >/dev/null 2>&1; then
    ( PORT="${PORT}" pnpm -s dev >>"${LOG_FILE}" 2>&1 ) &
  else
    # Next.js dev respects PORT env too
    ( PORT="${PORT}" npx -y next dev >>"${LOG_FILE}" 2>&1 ) &
  fi
  pid="$!"
  echo "${pid}" > "${PID_FILE}"
  echo "✓ started pid=${pid}"
fi

# Wait until reachable (max ~35s)
echo "• Waiting for ${URL}"
ok=0
for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35; do
  curl -sS -m 1 "${URL}" >/dev/null 2>&1
  if [ "$?" -eq 0 ]; then
    ok=1
    break
  fi
  sleep 1
done

if [ "$ok" -ne 1 ]; then
  echo "❌ Server not reachable after wait: ${URL}"
  echo "• Tail log (${LOG_FILE}):"
  tail -n 160 "${LOG_FILE}" || true
  echo "• Stop process:"
  echo "  kill $(cat "${PID_FILE}" 2>/dev/null)"
  exit 0
fi

echo "✓ Server READY: ${URL}"
echo "• PID file: ${PID_FILE}"
echo "• Log file: ${LOG_FILE}"
echo
echo "OPEN: http://127.0.0.1:${PORT}/nexa"
echo "✅ Dev runner — done"
exit 0
