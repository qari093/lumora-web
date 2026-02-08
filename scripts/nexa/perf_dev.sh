. "$(cd "$(dirname "$0")/../.."  pwd)/.lumora_safe_bootstrap.sh"
#!/bin/sh

# Resolve PORT (default 3040)
. "$(cd "$(dirname "$0")" && pwd)/port_resolve.sh" 2>/dev/null || . "scripts/dev/port_resolve.sh" 2>/dev/null || true
set -euo pipefail
cd "${LUMORA_ROOT:-$HOME/lumora-web}"
PORT="${PORT:-3040}"

# DEV: never auto-relief, never use macOS free-mem as a hard signal.
DEV_MODE=1 AUTO_RELIEF=0 FREE_CHECK=0 MAX_RELIEF=0 CONSEC_REQUIRED=3 COOLDOWN_SEC=60 MAX_RUN_SEC=60 \
PORT="$PORT" sh scripts/nexa/perf_sanity.sh || true
