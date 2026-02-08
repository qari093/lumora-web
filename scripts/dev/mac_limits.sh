. "$(cd "$(dirname "$0")/../.."  pwd)/.lumora_safe_bootstrap.sh"
#!/bin/sh
set -euo pipefail

# mac_limits.sh
# Goal: prevent Next dev from thrashing on macOS laptops by keeping limits sane.
# Notes:
# - This is best-effort; it does not require sudo.
# - It prints what it did and exits 0 always unless project missing.

cd "$HOME/lumora-web" || { echo "❌ project not found: ~/lumora-web"; exit 1; }

: "${PORT:=3040}"
export PORT

echo "mac_limits — applying best-effort limits (no sudo)"

# File descriptor limit (helps dev server + many files)
if command -v ulimit >/dev/null 2>&1; then
  # Try to raise within allowed max
  (ulimit -n 8192 >/dev/null 2>&1 && echo "✓ ulimit -n 8192") || echo "• ulimit -n unchanged (permission/max)"
fi

# Reduce Next telemetry noise
export NEXT_TELEMETRY_DISABLED=1

# Node memory ceiling (avoid runaway)
# 2048–3072 is usually safe on 8GB; tune via NODE_MEM_MB env.
: "${NODE_MEM_MB:=3072}"
export NODE_OPTIONS="${NODE_OPTIONS:-} --max-old-space-size=${NODE_MEM_MB}"

# Watchpack tuning (chokidar) to reduce CPU spikes
# - polling off; rely on fsevents where possible
export CHOKIDAR_USEPOLLING="${CHOKIDAR_USEPOLLING:-0}"
export WATCHPACK_POLLING="${WATCHPACK_POLLING:-0}"

echo "✓ NEXT_TELEMETRY_DISABLED=1"
echo "✓ NODE_OPTIONS += --max-old-space-size=${NODE_MEM_MB}"
echo "✓ CHOKIDAR_USEPOLLING=${CHOKIDAR_USEPOLLING} WATCHPACK_POLLING=${WATCHPACK_POLLING}"
echo "OPEN: http://127.0.0.1:${PORT}/nexa/ops"
