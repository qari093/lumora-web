#!/usr/bin/env bash
set +e

PORT="${PORT:-3040}"

echo "Dev relief — port ${PORT}"
echo

echo "1) Stop dev server"
PORT="${PORT}" sh scripts/dev/stop_3040.sh
echo

echo "2) Clear Next dev cache (safe)"
# Next.js cache directories commonly include .next/cache; removing cache can reduce memory churn.
if [ -d ".next/cache" ]; then
  rm -rf .next/cache >/dev/null 2>&1 || true
  echo "✓ cleared .next/cache"
else
  echo "✓ no .next/cache to clear"
fi
echo

echo "3) Restart and wait ready"
PORT="${PORT}" sh scripts/dev/run_3040.sh
echo

echo "4) Quick status"
PORT="${PORT}" sh scripts/nexa/status.sh
echo

echo "✅ Dev relief — done"
exit 0
