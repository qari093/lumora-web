#!/bin/sh
set -euo pipefail

export CI="${CI:-1}"
export NEXT_TELEMETRY_DISABLED=1
export NODE_OPTIONS="${NODE_OPTIONS:-} --unhandled-rejections=strict"
export PORT="${PORT:-3000}"
export BASE_URL="${BASE_URL:-http://127.0.0.1:${PORT}}"

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT" || exit 1

LOG_DIR="docs/launch/step31-integration-logs"
mkdir -p "$LOG_DIR"

wait_for() {
  url="$1"
  max_ms="${2:-45000}"
  start="$(date +%s)"
  while :; do
    if curl -sS --max-time 2 "$url" >/dev/null 2>&1; then
      return 0
    fi
    now="$(date +%s)"
    elapsed_ms=$(( (now - start) * 1000 ))
    if [ "$elapsed_ms" -ge "$max_ms" ]; then
      return 1
    fi
    sleep 0.25
  done
}

kill_port() {
  p="$1"
  if command -v lsof >/dev/null 2>&1; then
    pid="$(lsof -ti tcp:"$p" 2>/dev/null | head -n1 || true)"
    if [ -n "${pid:-}" ]; then
      kill -TERM "$pid" >/dev/null 2>&1 || true
      sleep 0.5
      kill -KILL "$pid" >/dev/null 2>&1 || true
    fi
  fi
}

# Ensure port clean
kill_port "$PORT"

# Install deps if needed
if [ ! -d node_modules ]; then
  if command -v pnpm >/dev/null 2>&1; then
    pnpm -s install
  else
    npm ci
  fi
fi

# Build required for next start
if [ ! -f ".next/BUILD_ID" ]; then
  if command -v pnpm >/dev/null 2>&1; then
    pnpm -s build | tee "${LOG_DIR}/build.out.log"
  else
    npm run -s build | tee "${LOG_DIR}/build.out.log"
  fi
fi

# Start server
OUT="${LOG_DIR}/next_start.${PORT}.out.log"
ERR="${LOG_DIR}/next_start.${PORT}.err.log"

if command -v pnpm >/dev/null 2>&1; then
  (pnpm -s next start -p "$PORT" >"$OUT" 2>"$ERR") &
else
  (npx --yes next start -p "$PORT" >"$OUT" 2>"$ERR") &
fi
SV_PID="$!"

cleanup() {
  kill -TERM "$SV_PID" >/dev/null 2>&1 || true
  sleep 0.5
  kill -KILL "$SV_PID" >/dev/null 2>&1 || true
  kill_port "$PORT"
}
trap cleanup EXIT INT TERM

# Wait for health
if ! wait_for "${BASE_URL}/api/health" 60000; then
  echo "❌ Next test server not healthy at ${BASE_URL}/api/health"
  echo "— next out tail —"
  tail -n 120 "$OUT" || true
  echo "— next err tail —"
  tail -n 200 "$ERR" || true
  exit 2
fi

# Run integration vitest
if command -v pnpm >/dev/null 2>&1; then
  pnpm -s vitest run --config vitest.integration.config.ts -c vitest.integration.config.ts --testTimeout=240000 --hookTimeout=240000
else
  npx --yes vitest run --config vitest.integration.config.ts -c vitest.integration.config.ts --testTimeout=240000 --hookTimeout=240000
fi
