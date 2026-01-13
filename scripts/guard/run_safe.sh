#!/bin/sh
set -euo pipefail

# Minimal safe runner wrapper (POSIX).
# Usage: sh scripts/guard/run_safe.sh -- /path/to/script.sh

if [ "${1:-}" != "--" ]; then
  echo "usage: sh scripts/guard/run_safe.sh -- /path/to/script.sh" >&2
  exit 2
fi
shift
SCRIPT="${1:-}"
if [ -z "${SCRIPT:-}" ] || [ ! -f "$SCRIPT" ]; then
  echo "❌ missing script: $SCRIPT" >&2
  exit 2
fi
if [ ! -x "$SCRIPT" ]; then
  chmod +x "$SCRIPT"
fi

# Refuse to run if script contains an unterminated heredoc marker line "heredoc>"
# (This indicates a copy/paste hang was captured into the file.)
if grep -n "heredoc>" "$SCRIPT" >/dev/null 2>&1; then
  echo "❌ refusing to run: script contains 'heredoc>' marker (paste-hang artifact)" >&2
  echo "   file: $SCRIPT" >&2
  exit 3
fi

exec "$SCRIPT"
