#!/bin/sh
set -euo pipefail

want_major="20"

# nvm hates npm_config_prefix (often set by brew/global installs). Neutralize it.
unset npm_config_prefix NPM_CONFIG_PREFIX PREFIX

# Locate + source nvm
if [ -n "${NVM_DIR:-}" ] && [ -s "${NVM_DIR}/nvm.sh" ]; then
  # shellcheck disable=SC1090
  . "${NVM_DIR}/nvm.sh"
elif [ -s "$HOME/.nvm/nvm.sh" ]; then
  # shellcheck disable=SC1090
  . "$HOME/.nvm/nvm.sh"
elif command -v nvm >/dev/null 2>&1; then
  : # nvm function may already be available
else
  echo "❌ nvm not found; cannot ensure Node $want_major for this command"
  node -v || true
  exit 2
fi

# Install/use Node 20 in *this process*, then exec the requested command under it.
nvm install "$want_major" >/dev/null
nvm use "$want_major" >/dev/null

echo "✓ exec under Node $(node -v)"
exec "$@"
