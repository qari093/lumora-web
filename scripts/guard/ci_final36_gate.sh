#!/bin/sh
set -eu

echo "▶️ Final36 CI Gate (md-fences + heredocs + offline + typecheck)"

# 1) Markdown fences
sh scripts/guard/ci_md_fence_gate.sh

# 2) Heredocs
sh scripts/guard/ci_heredoc_gate.sh

# 3) Offline suite
sh scripts/tests/run_offline.sh

# 4) Typecheck
if command -v pnpm >/dev/null 2>&1; then
  pnpm -s tsc --noEmit
else
  npx --yes tsc --noEmit
fi

echo "✓ Final36 CI Gate passed"
