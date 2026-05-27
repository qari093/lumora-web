#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

cat <<EOF
Manual refresh:
cd "$ROOT" && bash scripts/fyp94/run_refresh_engine.sh

Suggested cron:
0 */6 * * * cd "$ROOT" && bash scripts/fyp94/run_refresh_engine.sh >> /tmp/lumora_fyp94_refresh_engine.log 2>&1
EOF
