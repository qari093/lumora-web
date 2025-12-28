#!/bin/sh
set -euo pipefail

cd "$(dirname "$0")/../.." || exit 1

echo "Live CI Gate — START"
echo

echo "• Guard: no heredoc artifacts"
sh scripts/live/no_heredoc_guard.sh
echo "✓ guard"

echo "• Typecheck"
if command -v pnpm >/dev/null 2>&1; then
  pnpm -s tsc --noEmit
else
  npx --yes tsc --noEmit
fi
echo "✓ tsc"

echo "• Contracts + smoke"
sh scripts/live/contract_suite.sh
echo "✓ contract_suite"

echo
echo "Live CI Gate — OK"
