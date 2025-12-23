#!/bin/sh
set -e

cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

echo "Health CI Gate — start"

# Ensure dev server is reachable for curl-based health probes if tests require it.
# (Vitest suite also covers contract checks, so we rely on it as truth.)
if command -v pnpm >/dev/null 2>&1; then
  pnpm -s vitest run --dir tests/health
else
  npx --yes vitest run --dir tests/health
fi

echo "Health CI Gate — OK"
