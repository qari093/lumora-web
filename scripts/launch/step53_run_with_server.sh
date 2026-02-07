#!/bin/sh
set -eu

STEP=53
TOTAL=91
PORT="${PORT:-3040}"
HOST="http://127.0.0.1:${PORT}"

echo "▶️ Step ${STEP}/${TOTAL} — RUN Step53 with prod server"
echo "──────────────────────────────────────────────────────────────"

NEXT=""
if [ -x "./node_modules/.bin/next" ]; then
  NEXT="./node_modules/.bin/next"
elif command -v pnpm >/dev/null 2>&1; then
  NEXT="pnpm -s next"
else
  NEXT="npx --yes next"
fi

LOG="/tmp/lumora_step53_prod_${PORT}.log"
SV_PID=""

if [ ! -d ".next" ]; then
  echo "• build"
  $NEXT build
fi

if curl -fsS "${HOST}/api/health" >/dev/null 2>&1; then
  echo "✓ server already running"
else
  echo "• start server"
  rm -f "$LOG" || true
  $NEXT start -p "$PORT" >"$LOG" 2>&1 &
  SV_PID="$!"
  echo "✓ pid: $SV_PID"

  echo "• wait for health"
  i=0
  while [ "$i" -lt 40 ]; do
    curl -fsS "${HOST}/api/health" >/dev/null 2>&1 && break
    sleep 1
    i=$((i+1))
  done
fi

echo
echo "• run verifier"
PORT="$PORT" sh scripts/launch/step53_verify.sh > /tmp/step53_verifier.out 2>&1 || true
tail -n 120 /tmp/step53_verifier.out || true

if [ -n "${SV_PID:-}" ]; then
  echo
  echo "• stop server"
  kill "$SV_PID" 2>/dev/null || true
fi

echo
echo "✅ Step ${STEP}/${TOTAL} — done"
