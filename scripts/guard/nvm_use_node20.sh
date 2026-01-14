#!/bin/sh
set -euo pipefail

want_major="20"

# Try to locate nvm
if [ -n "${NVM_DIR:-}" ] && [ -s "${NVM_DIR}/nvm.sh" ]; then
  # shellcheck disable=SC1090
  . "${NVM_DIR}/nvm.sh"
elif [ -s "$HOME/.nvm/nvm.sh" ]; then
  # shellcheck disable=SC1090
  . "$HOME/.nvm/nvm.sh"
elif command -v nvm >/dev/null 2>&1; then
  : # nvm function may be available already
else
  echo "⚠ nvm not found; skipping auto Node $want_major bootstrap"
  node -v || true
  exit 0
fi

# Ensure node 20 exists + activate
nvm install "$want_major" >/dev/null
nvm use "$want_major" >/dev/null

echo "✓ using Node $(node -v)"
