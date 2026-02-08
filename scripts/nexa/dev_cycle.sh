#!/usr/bin/env bash
set +e

PORT="${PORT:-3040}"

echo "NEXA dev cycle — port ${PORT}"
echo

echo "1) Stop"
PORT="${PORT}" sh scripts/dev/stop_3040.sh
echo

echo "2) Start and wait ready"
PORT="${PORT}" sh scripts/dev/run_3040.sh
echo

echo "3) Smoke"
PORT="${PORT}" sh scripts/nexa/smoke.sh
echo

echo "✅ NEXA dev cycle — done"
exit 0
