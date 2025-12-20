#!/bin/sh
set -euo pipefail
cd "$(dirname "$0")/../.." || exit 1
PORT="${PORT:-8088}"
echo "Starting polaroid events receiver on http://127.0.0.1:${PORT}"
exec node polaroid-mvp/tools/events-receiver.mjs
