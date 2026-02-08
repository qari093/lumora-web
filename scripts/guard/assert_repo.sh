. "$(cd "$(dirname "$0")/../.."  pwd)/.lumora_safe_bootstrap.sh"
#!/bin/sh
set -u
REPO="$HOME/lumora-web"
if [ "$(pwd)" != "$REPO" ]; then
  echo "❌ Not in repo root. Refusing to run."
  echo "   pwd: $(pwd)"
  echo "   expected: $REPO"
  exit 2
fi
exit 0
