#!/usr/bin/env bash

# Repo scope hard gate (prevents HOME/root drift)


# Hardening: prevent repo-root drift into $HOME
# Canonical Prisma provider is PostgreSQL. Never silently substitute SQLite.
if [ -z "${DATABASE_URL:-}" ]; then
  echo "CI_PREFLIGHT_DATABASE_URL_REQUIRED=true"
  echo "error=DATABASE_URL_REQUIRED_FOR_CANONICAL_POSTGRES_PRISMA"
  return 1 2>/dev/null || false
fi


bash "$(cd "$(dirname "$0")" && pwd)/repo_scope_guard.sh"

set -euo pipefail

# Repo scope hard gate (prevents HOME/root drift)
bash "$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)/scripts/guard/repo_scope_guard.sh"


echo "• guard: git clean guardrail"
bash scripts/guard/git_clean_guardrail_check.sh

# Lumora Hardening: ensure hooks guardrail is present
bash "$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)/scripts/guard/githooks_guardrail_check.sh"

echo "CI preflight: prisma validate + typecheck + eslint warning budget gate"

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
SCHEMA="$ROOT/prisma/schema.prisma"

if [ ! -f "$SCHEMA" ]; then
  echo "❌ prisma schema not found at: $SCHEMA"
  exit 1
fi

# Safe sqlite fallback if DATABASE_URL missing (so validate works in fresh shells)
echo "• prisma validate (schema: $SCHEMA)"
npx -y prisma validate --schema "$SCHEMA"

echo "• typecheck"
if command -v pnpm >/dev/null 2>&1; then
  pnpm -s tsc --noEmit
else
  npx -y tsc --noEmit
fi

echo "• eslint warning budget gate"
if command -v pnpm >/dev/null 2>&1; then
  pnpm -s run guard:eslint-warn
else
  npm -s run guard:eslint-warn
fi

echo "✓ CI preflight PASS"
