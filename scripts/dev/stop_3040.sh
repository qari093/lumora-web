#!/usr/bin/env bash
set +e

PORT="${PORT:-3040}"
PID_FILE=".lumora_dev_${PORT}.pid"

echo "Stop dev server — port ${PORT}"
echo

if [ ! -f "${PID_FILE}" ]; then
  echo "✓ No pid file (${PID_FILE}). Nothing to stop."
  exit 0
fi

pid="$(cat "${PID_FILE}" 2>/dev/null)"

if [ -z "${pid:-}" ]; then
  echo "• Empty pid file. Removing."
  rm -f "${PID_FILE}" >/dev/null 2>&1 || true
  echo "✓ done"
  exit 0
fi

if kill -0 "${pid}" >/dev/null 2>&1; then
  echo "• Killing pid=${pid}"
  kill "${pid}" >/dev/null 2>&1 || true
  # wait a bit
  for i in 1 2 3 4 5; do
    kill -0 "${pid}" >/dev/null 2>&1 || break
    sleep 1
  done
  if kill -0 "${pid}" >/dev/null 2>&1; then
    echo "• Still alive; sending SIGKILL"
    kill -9 "${pid}" >/dev/null 2>&1 || true
  fi
else
  echo "• pid=${pid} not running"
fi

rm -f "${PID_FILE}" >/dev/null 2>&1 || true
echo "✓ stopped (pid file removed)"
exit 0
