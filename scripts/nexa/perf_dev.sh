#!/bin/sh
set -euo pipefail
cd "${LUMORA_ROOT:-$HOME/lumora-web}" 2>/dev/null || cd "$HOME/lumora-web"
PORT="${PORT:-3040}"

# DEV defaults: advisory only; never auto-restart; do not use "free mem" as signal.
DEV_MODE=1 AUTO_RELIEF=0 FREE_CHECK=0 LOAD1_WARN="${LOAD1_WARN:-120}" FREE_PCT_WARN="${FREE_PCT_WARN:-1}" \
MAX_RELIEF=0 CONSEC_REQUIRED=3 COOLDOWN_SEC=60 MAX_RUN_SEC=60 \
PORT="$PORT" sh scripts/nexa/perf_sanity.sh || true
