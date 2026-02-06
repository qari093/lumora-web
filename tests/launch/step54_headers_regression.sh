#!/bin/sh
set -eu

STEP=54
TOTAL=91
PORT="${PORT:-3040}"
HOST="http://127.0.0.1:${PORT}"

echo "▶️ Step ${STEP}/${TOTAL} — Headers regression (prod curl matrix)"
echo "──────────────────────────────────────────────────────────────"

NEXT=""
if [ -x "./node_modules/.bin/next" ]; then
  NEXT="./node_modules/.bin/next"
elif command -v pnpm >/dev/null 2>&1; then
  NEXT="pnpm -s next"
else
  NEXT="npx --yes next"
fi

LOG="/tmp/lumora_step54_prod_${PORT}.log"
SV_PID=""

need_hdrs="
content-security-policy
x-content-type-options
x-frame-options
referrer-policy
permissions-policy
"

routes="
/
 /wallet
 /private-access
"

# Build if needed
if [ ! -d ".next" ]; then
  echo "• build"
  $NEXT build
  echo "✓ build ok"
else
  echo "✓ .next present"
fi

# Start prod server
if curl -fsS "${HOST}/api/health" >/dev/null 2>&1; then
  echo "✓ server already running on :${PORT}"
else
  echo "• start server :${PORT}"
  rm -f "$LOG" 2>/dev/null || true
  $NEXT start -p "$PORT" >"$LOG" 2>&1 &
  SV_PID="$!"
  echo "✓ pid: $SV_PID"
  echo "• wait for /api/health"
  i=0
  ok=0
  while [ "$i" -lt 40 ]; do
    if curl -fsS "${HOST}/api/health" >/dev/null 2>&1; then ok=1; break; fi
    sleep 1
    i=$((i+1))
  done
  if [ "$ok" -ne 1 ]; then
    echo "❌ /api/health not reachable"
    tail -n 160 "$LOG" 2>/dev/null || true
    kill "$SV_PID" 2>/dev/null || true
    exit 2
  fi
  echo "✓ /api/health reachable"
fi

OUT="/tmp/step54_headers_regression_matrix.txt"
: >"$OUT"
fail=0

echo
echo "• HEAD checks (follow redirects)"
for r in $routes; do
  rr="$(echo "$r" | tr -d ' ')"
  [ -n "$rr" ] || continue
  echo "— ${rr} —" | tee -a "$OUT"
  hdrs="$(curl -fsS -L -I "${HOST}${rr}" 2>/dev/null | tr -d '\r' || true)"
  echo "$hdrs" >>"$OUT"
  echo >>"$OUT"

  if [ -z "$hdrs" ]; then
    echo "❌ empty headers for ${rr}"
    fail=1
    continue
  fi

  for h in $need_hdrs; do
    echo "$hdrs" | grep -qi "^${h}:" || { echo "❌ missing ${h} on ${rr}"; fail=1; }
  done
done

echo
echo "• artifact: $OUT"

# Stop server if we started it
if [ -n "${SV_PID:-}" ]; then
  echo
  echo "• stop server"
  kill "$SV_PID" 2>/dev/null || true
  sleep 1
fi

if [ "$fail" -ne 0 ]; then
  echo "❌ Step ${STEP}/${TOTAL} — FAILED"
  exit 2
fi

echo "✅ Step ${STEP}/${TOTAL} — passed"
