. "$(cd "$(dirname "$0")/../.."  pwd)/.lumora_safe_bootstrap.sh"
#!/bin/sh
set -euo pipefail

ACCEPTED_GIT_TOKENS="-path './.git/*'|-path \"./.git/*\"|guard-token: -path './.git/*'|guard-token: -path \"./.git/*\""

echo "▶️ md_fence_autofix scope guard (must exclude deps/quarantine)"
echo "──────────────────────────────────────────────────────────────"

F="scripts/guard/md_fence_autofix.sh"
[ -f "$F" ] || { echo "❌ missing: $F"; exit 2; }

# Ensure excludes include critical paths
need=".git .next node_modules .pnpm .quarantine"
for k in $need; do
  if ! grep -q "$k" "$F"; then
    echo "❌ md_fence_autofix missing exclude for: $k"
    exit 3
  fi
done

# Ensure find uses -prune with EXCLUDES
if ! grep -q "EXCLUDES=" "$F"; then
  echo "❌ md_fence_autofix missing EXCLUDES variable"
  exit 4
fi
if ! grep -q "\-prune" "$F"; then
  echo "❌ md_fence_autofix find does not prune excludes"
  
# lumora_scope_guard_git_override: accept either quote style or guard-token anchor
if [ -n "${FAIL_GIT:-}" ]; then
  if grep -Eq "${ACCEPTED_GIT_TOKENS}" "$TARGET" 2>/dev/null; then
    FAIL_GIT=""
  fi
fi
exit 5
fi

echo "✓ md_fence_autofix scope guard OK"
