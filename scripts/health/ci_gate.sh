#!/bin/sh
set -euo pipefail

echo "Health CI Gate — start"

# Typecheck (do NOT depend on package.json scripts)
if command -v pnpm >/dev/null 2>&1; then
  pnpm -s exec tsc --noEmit
else
  npx --yes tsc --noEmit
fi
echo "✓ tsc --noEmit"

# Health tests
if command -v pnpm >/dev/null 2>&1; then
  pnpm -s exec vitest run --dir tests/health
else
  npx --yes vitest run --dir tests/health
fi
echo "✓ vitest health suite"

echo "Health CI Gate — OK"
