#!/bin/sh
set -euo pipefail

echo "Health CI Gate — start"

cd "$(dirname "$0")/../.." || { echo "❌ repo root not found"; exit 1; }

PORT="${PORT:-3000}"
OUT_LAST="/tmp/ci_gate_last.out"

# Always capture gate output to the canonical file as well (used by determinism script)
: > "$OUT_LAST"

cleanup() {
  pkill -f "next dev" >/dev/null 2>&1 || true
}
trap cleanup EXIT INT TERM

boot_next() {
  echo "• Boot Next dev for integration tests (PORT=$PORT)"
  pkill -f "next dev" >/dev/null 2>&1 || true

  nohup sh -c "PORT=$PORT npx next dev" >/tmp/next-dev.out 2>&1 &
  i=0
  echo "• Wait for server readiness..."
  while [ $i -lt 45 ]; do
    if curl -fsS "http://127.0.0.1:$PORT/api/_health" >/dev/null 2>&1; then
      echo "✓ Next dev ready"
      return 0
    fi
    i=$((i+1))
    sleep 1
  done

  echo "❌ Next dev not ready (timeout)"
  echo "• Tail /tmp/next-dev.out:"
  tail -n 120 /tmp/next-dev.out 2>/dev/null || true
  return 1
}

run_vitest_dir() {
  dir="$1"
  if command -v pnpm >/dev/null 2>&1; then
    pnpm -s vitest run --dir "$dir"
  else
    npx --yes vitest run --dir "$dir"
  fi
}

# Run everything, tee to OUT_LAST (single run, single output)
{
  boot_next

  echo
  echo "• Run vitest health suite"
  run_vitest_dir tests/health
  echo "✓ vitest health suite"

  echo
  echo "• Run vitest create markers suite"
  run_vitest_dir tests/create
  echo "✓ vitest create markers suite"

  echo
  echo "Health CI Gate — OK"
} 2>&1 | tee "$OUT_LAST"

