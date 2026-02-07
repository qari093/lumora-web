#!/bin/sh
set -euo pipefail
# Strict gate: fails if any script contains heredoc openers like: <<EOF / <<'EOF' / <<SH / etc.
# Notes:
# - Ignores comment-only lines (starting with optional spaces then #)
# - Excludes this gate file itself to avoid self-flagging

ROOT="${1:-scripts}"

# Match common heredoc openers
pat='<<[[:space:]]*'\''?(EOF|SH|DOC|EOT|END|HEREDOC)'\''?'

# Grep candidates, excluding noise dirs/files; ignore comment lines
hits="$(grep -RIn \
  --exclude-dir=node_modules \
  --exclude-dir=.next \
  --exclude=package-lock.json \
  --exclude=pnpm-lock.yaml \
  --exclude=no_heredoc_gate.sh \
  -E "$pat" "$ROOT" 2>/dev/null \
  | grep -Ev '^[[:space:]]*#' \
  || true
)"

if [ -n "${hits:-}" ]; then
  echo "❌ heredoc patterns detected under: $ROOT"
  echo "$hits"
  exit 2
fi

echo "no_heredoc_gate_ok"
