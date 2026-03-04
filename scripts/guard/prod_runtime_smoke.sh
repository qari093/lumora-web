#!/usr/bin/env bash
set -euo pipefail

LOG="${1:-/tmp/lumora_prod_runtime_smoke_$(date +%s).log}"
PORT="${PORT:-4019}"
HOST="127.0.0.1"

say(){ printf "%s\n" "$*" | tee -a "$LOG" >/dev/null; }
die(){ say "❌ $*"; exit 1; }

say "▶️ prod_runtime_smoke port=${PORT}"

# Build (ensures Next start uses fresh output)
say "• next build"
rm -rf .next
set +e
pnpm -s next build 2>&1 | tee -a "$LOG"
RC="${PIPESTATUS[0]}"
set -e
[ "$RC" -eq 0 ] || die "next_build_failed_rc=${RC}"
say "✓ build ok"

# Start server
OUT="/tmp/lumora_prod_runtime_smoke_server_${PORT}_$(date +%s).log"
say "• next start (background) → $OUT"
set +e
PORT="$PORT" pnpm -s next start -p "$PORT" >"$OUT" 2>&1 &
PID="$!"
set -e

cleanup(){
  if kill -0 "$PID" >/dev/null 2>&1; then
    say "• cleanup: SIGTERM pid=${PID}"
    kill -TERM "$PID" >/dev/null 2>&1 || true
    # wait up to 12s
    for _ in $(seq 1 24); do
      if ! kill -0 "$PID" >/dev/null 2>&1; then break; fi
      sleep 0.5
    done
    if kill -0 "$PID" >/dev/null 2>&1; then
      say "• cleanup: SIGKILL pid=${PID}"
      kill -KILL "$PID" >/dev/null 2>&1 || true
    fi
  fi
}
trap cleanup EXIT

wait_http(){
  local path="$1"
  local want="${2:-200}"
  local tries="${3:-60}"
  for _ in $(seq 1 "$tries"); do
    code="$(curl -sS -o /tmp/lumora_runtime_body.txt -w '%{http_code}' "http://${HOST}:${PORT}${path}" || true)"
    if [ "$code" = "$want" ]; then return 0; fi
    sleep 0.5
  done
  return 1
}

say "• wait readyz"
if ! wait_http "/api/readyz" "200" "80"; then
  say "— server output tail 120 —"
  tail -n 120 "$OUT" | tee -a "$LOG" >/dev/null || true
  die "readyz_not_200"
fi
say "✓ readyz ok"

say "• smoke /api/health"
if ! wait_http "/api/health" "200" "20"; then
  say "— body head —"
  head -c 500 /tmp/lumora_runtime_body.txt | tee -a "$LOG" >/dev/null || true
  die "health_not_200"
fi
say "✓ health ok"

say "• smoke /api/portals/alive"
if ! wait_http "/api/portals/alive" "200" "20"; then
  say "— body head —"
  head -c 900 /tmp/lumora_runtime_body.txt | tee -a "$LOG" >/dev/null || true
  die "portals_alive_not_200"
fi
say "✓ portals alive ok"

say "• graceful stop contract (SIGTERM → exits <= 12s)"
kill -TERM "$PID" >/dev/null 2>&1 || true
for _ in $(seq 1 24); do
  if ! kill -0 "$PID" >/dev/null 2>&1; then
    say "✓ server stopped"
    exit 0
  fi
  sleep 0.5
done

say "— server output tail 180 —"
tail -n 180 "$OUT" | tee -a "$LOG" >/dev/null || true
die "server_did_not_exit_on_sigterm"
