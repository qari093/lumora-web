#!/usr/bin/env bash
set -euo pipefail

# Guardrail:
# - Disallow direct "git clean" usage in repo scripts unless routed via git_clean_safe.sh
# - This prevents accidental deletion of lock markers when -x/-X is used.
#
# Allowed:
#   scripts/guard/git_clean_safe.sh ...
#   bash scripts/guard/git_clean_safe.sh ...
#
# Forbidden:
#   git clean ...
#   command git clean ...

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

# Scan only shell scripts + guard scripts (fast + targeted)
mapfile -t files < <(cd "$ROOT" && {
  find scripts -type f \( -name "*.sh" -o -name "*.bash" \) 2>/dev/null || true
} | sed 's|^\./||')

bad=0
for f in "${files[@]}"; do
  # Skip the safe wrapper itself
  [[ "$f" == "scripts/guard/git_clean_safe.sh" ]] && continue
  # Match raw git clean invocations; ignore lines that already use git_clean_safe.sh
  if grep -nE '(^|[[:space:];&|])((command[[:space:]]+)?git[[:space:]]+clean)([[:space:]]|$)' "$ROOT/$f" >/dev/null 2>&1; then
    if ! grep -nE 'scripts/guard/git_clean_safe\.sh' "$ROOT/$f" >/dev/null 2>&1; then
      echo "FORBIDDEN_GIT_CLEAN::$f"
      grep -nE '(^|[[:space:];&|])((command[[:space:]]+)?git[[:space:]]+clean)([[:space:]]|$)' "$ROOT/$f" | head -n 20
      echo
      bad=1
    fi
  fi
done

if [[ $bad -ne 0 ]]; then
  echo "❌ git clean guardrail violated. Use: scripts/guard/git_clean_safe.sh"
  exit 1
fi

echo "✓ git clean guardrail check passed"
