#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

HOOKS_DIR="$(git config --get core.hooksPath 2>/dev/null || echo "")"
[ -n "$HOOKS_DIR" ] || HOOKS_DIR=".githooks"

PRE="$ROOT/$HOOKS_DIR/pre-commit"
if [ ! -f "$PRE" ]; then
  echo "githooks_guardrail_check: missing pre-commit at $PRE" >&2
  exit 1
fi

if ! grep -q "LUMORA_HARDENING_GITHOOKS_GUARDRAIL" "$PRE"; then
  echo "githooks_guardrail_check: guardrail marker missing in $PRE" >&2
  exit 1
fi

echo "githooks_guardrail_check: OK ($PRE)"
