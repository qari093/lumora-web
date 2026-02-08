. "$(cd "$(dirname "$0")/../.."  pwd)/.lumora_safe_bootstrap.sh"
#!/bin/sh
set -euo pipefail

LAUNCH_GIT_SAFE="scripts/launch/git_safe.sh"
g(){ if [ -x "$LAUNCH_GIT_SAFE" ]; then "$LAUNCH_GIT_SAFE" "$@"; else git --no-pager "$@"; fi }
want="20.20.0"
got="$(node -v | sed 's/^v//')"
if [ "$got" != "$want" ]; then
  echo "❌ Node mismatch: want=$want got=$got"
  echo "   Fix: nvm install $want && nvm use $want"
  exit 2
fi
echo "✓ Node OK: $got"
