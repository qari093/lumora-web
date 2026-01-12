#!/bin/sh
set -euo pipefail
cd "$(dirname "$0")/../.." || { echo "❌ repo root not found"; exit 1; }

OFFDIR="tests/offline"
if [ ! -d "$OFFDIR" ]; then
  echo "❌ offline tests dir missing: $OFFDIR"
  exit 2
fi

# Enumerate tests deterministically (avoid shell glob pitfalls).
FILES="$(find "$OFFDIR" -type f \( -name '*.test.ts' -o -name '*.test.tsx' -o -name '*.spec.ts' -o -name '*.spec.tsx' \) | sort || true)"
if [ -z "${FILES:-}" ]; then
  echo "❌ No offline tests found under: $OFFDIR"
  exit 3
fi

echo "• Offline tests discovered:"
echo "$FILES" | sed 's/^/  - /'
echo

if command -v pnpm >/dev/null 2>&1; then
  # shellcheck disable=SC2086
  pnpm -s vitest run $FILES
else
  # shellcheck disable=SC2086
  npx --yes vitest run $FILES
fi
