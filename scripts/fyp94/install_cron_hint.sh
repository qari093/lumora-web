#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

cat <<EOF
Manual cron command:

0 */6 * * * cd "$ROOT" && PEXELS_API_KEY="\$PEXELS_API_KEY" PIXABAY_API_KEY="\$PIXABAY_API_KEY" bash scripts/fyp94/run_auto_refresh.sh >> /tmp/lumora_fyp94_refresh.log 2>&1

For now, run manually:
bash scripts/fyp94/run_auto_refresh.sh
EOF
