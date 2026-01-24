#!/bin/sh
set -euo pipefail

LAUNCH_GIT_SAFE="scripts/launch/git_safe.sh"
g(){ if [ -x "$LAUNCH_GIT_SAFE" ]; then "$LAUNCH_GIT_SAFE" "$@"; else git --no-pager "$@"; fi }
export NODE_OPTIONS="${NODE_OPTIONS:-} --max-old-space-size=4096"
export UV_THREADPOOL_SIZE=1
export TINYPOOL_MIN_THREADS=1
export TINYPOOL_MAX_THREADS=1
export VITEST_MAX_THREADS=1
export VITEST_MIN_THREADS=1
export VITEST_MAX_WORKERS=1
export VITEST_MIN_WORKERS=1
# Always run sequentially
exec npx --yes vitest run --pool=forks --maxWorkers=1 --minWorkers=1 --hookTimeout=240000 --testTimeout=60000 "$@"
