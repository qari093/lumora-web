#!/usr/bin/env bash
set -e
set -u
set -o pipefail

# Wrapper kept for backward compatibility with existing package.json scripts.
# Must be non-fatal and must not reference external bootstrap files.

if [ -x "scripts/guard/node_engine_warn.sh" ]; then
  bash scripts/guard/node_engine_warn.sh || true
else
  echo "⚠ scripts/guard/node_engine_warn.sh missing"
fi

exit 0
