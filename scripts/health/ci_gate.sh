#!/bin/sh
set -u

echo "Health CI Gate — start"

cd "$HOME/lumora-web" 2>/dev/null || { echo "❌ project not found"; exit 1; }

have(){ command -v "$1" >/dev/null 2>&1; }
have curl || { echo "❌ curl missing"; exit 1; }

# Prefer pnpm if present; otherwise npx
run_vitest() {
  if command -v pnpm >/dev/null 2>&1; then
    pnpm -s vitest run "$@"
  else
    npx --yes vitest run "$@"
  fi
}

# Pick a free port (avoid flaky :3000 collisions)
pick_port() {
  node <<'NODE'
const net = require("net");
const srv = net.createServer();
srv.listen(0, "127.0.0.1", () => {
  const { port } = srv.address();
  srv.close(() => process.stdout.write(String(port)));
});
NODE
}

PORT="$(pick_port)"
BASE="http://127.0.0.1:${PORT}"
export PORT BASE NEXT_TEST_BASE_URL="$BASE"

LOG="/tmp/lumora_ci_gate_dev_${PORT}.log"
PIDFILE="/tmp/lumora_ci_gate_dev_${PORT}.pid"

echo "• Boot Next dev for integration tests (PORT=${PORT})"
rm -f "$PIDFILE" >/dev/null 2>&1 || true

# Start dev server and capture PID reliably
# Use sh -c so $! is the Next process PID (not a subshell from tool wrappers)
sh -c "PORT=${PORT} NEXT_TELEMETRY_DISABLED=1 NODE_ENV=test npx --yes next dev -p ${PORT} >\"${LOG}\" 2>&1 & echo \$! >\"${PIDFILE}\""

if [ ! -s "$PIDFILE" ]; then
  echo "❌ Failed to capture dev server PID"
  echo "• log tail:"
  tail -n 120 "$LOG" 2>/dev/null || true
  exit 1
fi

PID="$(cat "$PIDFILE" 2>/dev/null || echo "")"
echo "✓ dev pid: ${PID}"

cleanup() {
  if [ -n "${PID:-}" ]; then
    kill "$PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT INT TERM

echo "• Wait for server readiness (GET /api/health) ..."
i=0
while [ $i -lt 180 ]; do
  # Ready when /api/health returns JSON 200
  code="$(curl -sS -o /tmp/lumora_ci_gate_health_${PORT}.json -w "%{http_code}" "${BASE}/api/health" 2>/dev/null || echo 000)"
  if [ "$code" = "200" ]; then
    echo "✓ Next dev ready"
    break
  fi
  i=$((i+1))
  sleep 0.5
done

if [ "$code" != "200" ]; then
  echo "❌ Server not ready on ${BASE} (last http:${code})"
  echo "• log tail:"
  tail -n 200 "$LOG" 2>/dev/null || true
  exit 1
fi

echo
echo "• Run vitest health suite"
run_vitest --dir tests/health
echo "✓ vitest health suite"

echo
echo "• Run vitest create markers suite"
run_vitest tests/create/create.rsc-markers.test.ts
echo "✓ vitest create markers suite"

echo
echo "Health CI Gate — OK"
