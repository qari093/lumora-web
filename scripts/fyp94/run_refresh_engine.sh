#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../.." || exit 1

if [ -z "${PEXELS_API_KEY:-}" ]; then
  echo "❌ PEXELS_API_KEY missing"
  exit 1
fi

node scripts/fyp94/refresh_engine.mjs
