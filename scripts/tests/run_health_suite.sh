#!/bin/sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

FILES="$(find tests/health -type f -name "*.test.ts" 2>/dev/null | sort || true)"
if [ -z "${FILES}" ]; then
  echo "❌ No tests found under tests/health (*.test.ts)"
  exit 2
fi

echo "• Health tests:"
echo "$FILES" | sed 's/^/  - /'

if command -v pnpm >/dev/null 2>&1; then
  # Pass explicit file list (avoids --dir / glob edge-cases)
  pnpm -s vitest run $(echo "$FILES")
else
  npx --yes vitest run $(echo "$FILES")
fi
