#!/bin/sh
set -euo pipefail

bad=0

scan() {
  dir="$1"
  [ -d "$dir" ] || return 0

  if grep -RIn \
      --exclude="no_heredoc_guard.sh" \
      --exclude="*.bak_step*" \
      --exclude="*.bak_*" \
      --exclude-dir="_bak" \
      "heredoc>" "$dir" >/dev/null 2>&1; then
    echo "❌ Found heredoc prompt artifacts under: $dir"
    grep -RIn \
      --exclude="no_heredoc_guard.sh" \
      --exclude="*.bak_step*" \
      --exclude="*.bak_*" \
      --exclude-dir="_bak" \
      "heredoc>" "$dir" || true
    bad=1
  fi
}

scan "scripts/live"
scan "docs/live"

if [ "$bad" -ne 0 ]; then
  exit 2
fi

echo "✓ no-heredoc guard OK"
