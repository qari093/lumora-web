#!/usr/bin/env bash
set -u

cd "$(dirname "$0")/../.." || exit 1

LOG="/tmp/lumora_stable_dev.log"
PORT="${PORT:-3000}"

echo "LUMORA_STABLE_DEV_START=$(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee "$LOG"

while true; do
  echo "🚀 Starting Lumora dev server on :$PORT" | tee -a "$LOG"

  rm -rf .next/cache 2>/dev/null || true

  pnpm dev 2>&1 | tee -a "$LOG"

  echo "⚠️ Dev server stopped. Restarting in 2 seconds..." | tee -a "$LOG"
  sleep 2
done
