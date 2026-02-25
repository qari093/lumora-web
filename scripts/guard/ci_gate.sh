#!/usr/bin/env bash

# Hard-scope guard execution through run_safe (enforces repo_scope_guard)
RUN_SAFE="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)/scripts/guard/run_safe.sh"


# Repo scope hard gate (prevents HOME/root drift)
bash "$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)/scripts/guard/repo_scope_guard.sh"

set -e
set -u
set -o pipefail

cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

echo "• guard:node (non-fatal)"
if [ -x "scripts/guard/check_node_engine.sh" ]; then
  bash scripts/guard/check_node_engine.sh || true
else
  echo "⚠ missing scripts/guard/check_node_engine.sh"
fi
echo

echo "• prisma validate"
if [ -f "prisma/schema.prisma" ]; then
  npx -y prisma validate
else
  echo "⚠ prisma/schema.prisma not found (skipping)"
fi
echo

echo "• typecheck"
if command -v pnpm >/dev/null 2>&1; then
  pnpm -s tsc --noEmit
else
  npx -y tsc --noEmit
fi
echo "✓ typecheck ok"
echo

echo "• next build"
if command -v pnpm >/dev/null 2>&1; then
  pnpm -s next build
else
  npx -y next build
fi
echo "✓ build ok"

# Default: pass-through via run_safe
"$RUN_SAFE" -- "$@"
