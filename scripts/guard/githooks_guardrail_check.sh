#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
HOOKS_DIR="$(git config --get core.hooksPath 2>/dev/null || echo "")"
[ -n "$HOOKS_DIR" ] || HOOKS_DIR=".githooks"
PRE="$ROOT/$HOOKS_DIR/pre-commit"
[ -f "$PRE" ] || { echo "githooks_guardrail_check: missing $PRE" >&2; exit 1; }
grep -q "LUMORA_HARDENING_GITHOOKS_GUARDRAIL" "$PRE" || { echo "githooks_guardrail_check: guardrail missing" >&2; exit 1; }
echo "githooks_guardrail_check: OK ($PRE)"
