#!/bin/sh
set -euo pipefail
# Fails if any script contains "<<EOF", "<<'EOF'", "<<SH", "<<'SH'", etc.
# This is intentionally strict for launch scripts to avoid terminal paste traps.

ROOT="${1:-scripts}"
pat='<<[[:space:]]*'\''?(EOF|SH|DOC|EOT|END|HEREDOC)'\''?'

hits="$(grep -RIn --exclude-dir=node_modules --exclude-dir=.next --exclude=package-lock.json --exclude=pnpm-lock.yaml -E "$pat" "$ROOT" 2>/dev/null || true)"

if [ -n "${hits:-}" ]; then
  echo "❌ heredoc patterns detected under: $ROOT"
  echo "$hits"
  exit 2
fi

echo "no_heredoc_gate_ok"
