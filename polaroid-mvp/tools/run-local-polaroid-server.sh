#!/bin/sh
set -euo pipefail
cd "$(dirname "$0")/../.." || exit 1
HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-8088}"
exec node polaroid-mvp/tools/local-polaroid-server.mjs
