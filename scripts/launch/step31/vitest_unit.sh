. "$(cd "$(dirname "$0")/../.."  pwd)/.lumora_safe_bootstrap.sh"
#!/bin/sh
set -euo pipefail

# Always run from repo root (not from scripts/ or other dirs)
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [ -z "${ROOT:-}" ] || [ ! -d "$ROOT" ]; then
  ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
fi
cd "$ROOT" || { echo "❌ could not cd to repo root"; exit 2; }

# Unset any env var that could force vitest to use an old config path
unset VITEST_CONFIG
unset VITE_CONFIG
unset VITE_USER_NODE_ENV
unset NODE_OPTIONS

CFG="$ROOT/vitest.unit.config.ts"
if [ ! -f "$CFG" ]; then
  echo "❌ missing unit config: $CFG"
  exit 3
fi

# Clamp workers + hard timeout at runner-level (vitest may still set per-test)
export CI="${CI:-1}"
export VITEST_MAX_THREADS="${VITEST_MAX_THREADS:-1}"
export VITEST_MIN_THREADS="${VITEST_MIN_THREADS:-1}"

# Prefer pnpm if available, but do not rely on package scripts/relative config paths.
if command -v pnpm >/dev/null 2>&1; then
  # Run vitest directly with absolute config path
  pnpm -s vitest run --config "$CFG" --pool=forks --maxWorkers=1 --minWorkers=1
else
  npx --yes vitest run --config "$CFG" --pool=forks --maxWorkers=1 --minWorkers=1
fi
