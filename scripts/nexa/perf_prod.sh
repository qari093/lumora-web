#!/bin/sh
set -euo pipefail
cd "${LUMORA_ROOT:-$HOME/lumora-web}" 2>/dev/null || cd "$HOME/lumora-web"
PORT="${PORT:-3040}"

# PROD defaults: stricter, may auto-relief if explicitly enabled.
DEV_MODE=0 AUTO_RELIEF="${AUTO_RELIEF:-0}" FREE_CHECK="${FREE_CHECK:-1}" LOAD1_WARN="${LOAD1_WARN:-60}" FREE_PCT_WARN="${FREE_PCT_WARN:-3}" \
MAX_RELIEF="${MAX_RELIEF:-1}" CONSEC_REQUIRED="${CONSEC_REQUIRED:-2}" COOLDOWN_SEC="${COOLDOWN_SEC:-45}" MAX_RUN_SEC="${MAX_RUN_SEC:-180}" \
PORT="$PORT" sh scripts/nexa/perf_sanity.sh || true
