#!/bin/sh
set -euo pipefail
cd "$(dirname "$0")/../.." || exit 1

echo "Health CI Gate — Private Smoke"
if [ -x "ops/_runbooks/private_mode_smoke.sh" ]; then
  sh ops/_runbooks/private_mode_smoke.sh > ops/_analysis/private_mode_smoke.ci.out 2>&1
  echo "✓ private_mode_smoke OK"
else
  echo "⚠ private_mode_smoke missing; skipping"
fi
