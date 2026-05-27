#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../.." || exit 1

node scripts/fyp94/auto_refresh.mjs

echo "LUMORA_FYP94_AUTO_REFRESH_LAST_RUN=$(date -u +%Y-%m-%dT%H:%M:%SZ)" > .lumora_fyp94_auto_refresh_last_run
echo "STATUS=PASS"
