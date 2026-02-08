. "$(cd "$(dirname "$0")/../.."  pwd)/.lumora_safe_bootstrap.sh"
#!/bin/sh
set -euo pipefail

echo "▶️ Final36 CI Gate (md-fences + heredocs + node-e-quoting + scope + stray-heredoc + mode + offline + typecheck + health + security + portals)"
echo "──────────────────────────────────────────────────────────────"

# Guard gates (each guard prints its own heading)
sh scripts/guard/ci_md_fence_gate.sh
sh scripts/guard/ci_heredoc_gate.sh
sh scripts/guard/ci_node_e_quoting_guard.sh
sh scripts/guard/ci_md_fence_autofix_scope_guard.sh
sh scripts/guard/ci_stray_heredoc_prompt_guard.sh
sh scripts/guard/ci_guard_mode_guard.sh

# Offline tests (if present)
OFFLINE_DIR="tests/offline"
if [ -d "$OFFLINE_DIR" ]; then
  echo "• Offline tests discovered:"
  ls -1 "$OFFLINE_DIR"/*.test.ts 2>/dev/null | sed "s/^/  - /" || true
  echo
  if command -v pnpm >/dev/null 2>&1; then
    pnpm -s vitest run --dir "$OFFLINE_DIR"
  else
    npx --yes vitest run --dir "$OFFLINE_DIR"
  fi
fi

# typecheck
if command -v pnpm >/dev/null 2>&1; then
  pnpm -s tsc --noEmit
else
  npx --yes tsc --noEmit
fi
echo "✓ typecheck passed"

# Start Next dev server (background) for integration suites
PORT="${PORT:-3000}"
LOG="/tmp/lumora_final36_ci_dev_${PORT}.log"

# Kill anything already listening on PORT (best-effort)
if command -v lsof >/dev/null 2>&1; then
  pids="$(lsof -ti tcp:"$PORT" 2>/dev/null || true)"
  if [ -n "${pids:-}" ]; then
    echo "• Preflight: killing listeners on :$PORT: ${pids}"
    kill -9 $pids 2>/dev/null || true
  fi
fi

echo "• Start Next dev server on :$PORT (background; log: $LOG)"
(PORT="$PORT" nohup sh -c 'if command -v pnpm >/dev/null 2>&1; then pnpm -s dev --port "$PORT"; else npm run -s dev -- --port "$PORT"; fi' >"$LOG" 2>&1 &) >/dev/null 2>&1 || true
sleep 0.4
pid="$(pgrep -f "next dev.*--port[= ]$PORT|next dev.*\s$PORT" 2>/dev/null | head -n1 || true)"
if [ -z "${pid:-}" ]; then
  pid="$(lsof -ti tcp:"$PORT" 2>/dev/null | head -n1 || true)"
fi
if [ -n "${pid:-}" ]; then echo "✓ started dev server pid=$pid"; else echo "ℹ dev server pid not detected (continuing)"; fi

echo "• Wait for /api/health (max 90s)"
i=0
ok=0
while [ $i -lt 90 ]; do
  if curl -fsS "http://127.0.0.1:$PORT/api/health" >/dev/null 2>&1; then ok=1; break; fi
  i=$((i+1))
  sleep 1
done
if [ $ok -ne 1 ]; then
  echo "❌ dev server did not become ready; tail log:"
  tail -n 60 "$LOG" 2>/dev/null | sed "s/^/  /" || true
  # best-effort stop
  if [ -n "${pid:-}" ]; then kill -9 "$pid" 2>/dev/null || true; fi
  exit 1
fi
echo "✓ /api/health reachable"
curl -fsS "http://127.0.0.1:$PORT/api/ready" >/dev/null 2>&1 && echo "✓ /api/ready=200"

# FINAL36_PREWARM_HEALTH_START
echo "• Prewarm health routes (avoid first-hit compile stalls)"
PORT="${PORT:-3000}"
BASE="http://127.0.0.1:${PORT}"
for path in /api/_health /api/healthz /api/health; do
  # Best-effort warmup; never fail the gate for warmup
  curl -sS -m 10 "${BASE}${path}" >/dev/null 2>&1 || true
done
echo "✓ prewarm attempted"

# Prewarm core portals (best-effort): reduces first-hit compilation stalls in security/portal tests
echo "• Prewarm core portals (best-effort; non-fatal)"
BASE="http://127.0.0.1:${PORT}"
for path in "/" "/gmar" "/movies" "/nexa" "/videos" "/video" "/live" "/api/_health"; do
  if [ "$path" = "/live" ]; then
    curl -sS -I --max-time 120 "${BASE}${path}" >/dev/null 2>&1 || true
  else
    curl -sS -I --max-time 45 "${BASE}${path}" >/dev/null 2>&1 || true
  fi
done
echo "✓ portal prewarm attempted"
# FINAL36_PREWARM_HEALTH_END || true

# Health suite
if command -v pnpm >/dev/null 2>&1; then
  pnpm -s vitest run --dir tests/health
else
  npx --yes vitest run --dir tests/health
fi
echo "✓ health suite passed"

# Security suite
if command -v pnpm >/dev/null 2>&1; then
  pnpm -s vitest run --dir tests/security
else
  npx --yes vitest run --dir tests/security
fi
echo "✓ security suite passed"

# Portals suite
if command -v pnpm >/dev/null 2>&1; then
  pnpm -s vitest run --dir tests/portals
else
  npx --yes vitest run --dir tests/portals
fi
echo "✓ portals suite passed"

# Stop dev server (best-effort)
if [ -n "${pid:-}" ]; then
  echo "• Stop dev server pid=$pid"
  kill -9 "$pid" 2>/dev/null || true
fi

echo "✓ Final36 CI Gate passed"
