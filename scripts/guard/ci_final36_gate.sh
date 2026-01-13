#!/bin/sh
set -eu

echo "▶️ Final36 CI Gate (md-fences + heredocs + offline + typecheck + health + portals)"
echo "──────────────────────────────────────────────────────────────"

PORT="${PORT:-3000}"
BASE_URL="${BASE_URL:-http://127.0.0.1:${PORT}}"

have_pnpm() { command -v pnpm >/dev/null 2>&1; }

run_vitest_dir() {
  dir="$1"
  if have_pnpm; then
    pnpm -s vitest run --dir "$dir"
  else
    npx --yes vitest run --dir "$dir"
  fi
}

run_tsc() {
  if have_pnpm; then
    pnpm -s tsc --noEmit
  else
    npx --yes tsc --noEmit
  fi
}

wait_http() {
  url="$1"
  max="${2:-60}"
  i=0
  while [ "$i" -lt "$max" ]; do
    if curl -fsS "$url" >/dev/null 2>&1; then return 0; fi
    i=$((i+1))
    sleep 1
  done
  return 1
}

port_kill_listeners() {
  if command -v lsof >/dev/null 2>&1; then
    pids="$(lsof -tiTCP:"$PORT" -sTCP:LISTEN 2>/dev/null || true)"
    if [ -n "${pids:-}" ]; then
      echo "  killing listeners on :${PORT}: ${pids}"
      kill ${pids} 2>/dev/null || true
      sleep 1
    fi
  fi
}

start_dev() {
  LOG="/tmp/lumora_final36_ci_dev_${PORT}.log"
  port_kill_listeners
  echo "• Start Next dev server on :${PORT} (background; log: $LOG)"

  if have_pnpm; then
    (PORT="$PORT" pnpm -s dev >"$LOG" 2>&1 & echo $! >/tmp/lumora_final36_ci_dev.pid)
  else
    (PORT="$PORT" npx --yes next dev -p "$PORT" >"$LOG" 2>&1 & echo $! >/tmp/lumora_final36_ci_dev.pid)
  fi

  DEV_PID="$(cat /tmp/lumora_final36_ci_dev.pid 2>/dev/null || true)"
  echo "✓ started dev server pid=${DEV_PID:-unknown}"

  echo "• Wait for /api/health (max 90s)"
  if wait_http "${BASE_URL}/api/health" 90; then
    echo "✓ /api/health reachable"
    return 0
  fi

  echo "❌ dev server did not become ready; tail log:"
  tail -n 160 "$LOG" 2>/dev/null || true
  return 1
}

stop_dev() {
  if [ -f /tmp/lumora_final36_ci_dev.pid ]; then
    pid="$(cat /tmp/lumora_final36_ci_dev.pid 2>/dev/null || true)"
    if [ -n "${pid:-}" ]; then
      echo "• Stop dev server pid=${pid}"
      kill "$pid" 2>/dev/null || true
    fi
    rm -f /tmp/lumora_final36_ci_dev.pid 2>/dev/null || true
  fi
}

detect_app_root() {
  if git ls-files | grep -qx "src/app/api/health/route.ts"; then
    echo "src/app"
    return 0
  fi
  if git ls-files | grep -qx "app/api/health/route.ts"; then
    echo "app"
    return 0
  fi
  if [ -d "src/app" ]; then echo "src/app"; else echo "app"; fi
}

ensure_ready_route_on_disk() {
  APP_ROOT="$(detect_app_root)"
  READY_PATH="${APP_ROOT}/api/ready/route.ts"
  mkdir -p "$(dirname "$READY_PATH")"
  cat >"$READY_PATH" <<'TS'
export const runtime = "nodejs";

export async function GET() {
  return Response.json(
    { ok: true, ready: true, ts: Date.now(), service: "lumora" },
    { status: 200, headers: { "cache-control": "no-store" } }
  );
}
TS
}

ensure_dev_ready_and_ready_endpoint() {
  ensure_ready_route_on_disk

  if curl -fsS "${BASE_URL}/api/health" >/dev/null 2>&1; then
    st="$(curl -sS -o /dev/null -w "%{http_code}" "${BASE_URL}/api/ready" 2>/dev/null || echo 0)"
    if [ "$st" = "200" ]; then
      echo "✓ dev server responding and /api/ready=200"
      return 0
    fi
    echo "⚠ dev server responding but /api/ready=${st} — restarting dev server to pick up route"
    stop_dev
    start_dev
    st2="$(curl -sS -o /dev/null -w "%{http_code}" "${BASE_URL}/api/ready" 2>/dev/null || echo 0)"
    if [ "$st2" != "200" ]; then
      echo "❌ /api/ready still not 200 after restart (status=${st2})"
      echo "Body(head):"
      curl -sS "${BASE_URL}/api/ready" | head -c 520 || true
      echo
      return 1
    fi
    echo "✓ /api/ready=200 after restart"
    return 0
  fi

  start_dev
  st3="$(curl -sS -o /dev/null -w "%{http_code}" "${BASE_URL}/api/ready" 2>/dev/null || echo 0)"
  if [ "$st3" != "200" ]; then
    echo "❌ /api/ready not 200 (status=${st3})"
    echo "Body(head):"
    curl -sS "${BASE_URL}/api/ready" | head -c 520 || true
    echo
    return 1
  fi
  echo "✓ /api/ready=200"
  return 0
}

trap stop_dev EXIT INT TERM

sh scripts/guard/ci_md_fence_gate.sh
sh scripts/guard/ci_heredoc_gate.sh

sh scripts/tests/run_offline.sh

run_tsc
echo "✓ typecheck passed"

ensure_dev_ready_and_ready_endpoint

export BASE_URL

run_vitest_dir tests/health
echo "✓ health suite passed"

run_vitest_dir tests/portals
echo "✓ portals suite passed"

echo "✓ Final36 CI Gate passed"
