#!/bin/sh
set -euo pipefail

# Enforce Node 20 for a single command invocation.
# Works even when invoked from non-interactive shells by sourcing nvm explicitly.

need() { command -v "$1" >/dev/null 2>&1; }

if [ "${1:-}" = "" ]; then
  echo "usage: $0 <command...>" >&2
  exit 2
fi

# Resolve NVM_DIR
if [ -n "${NVM_DIR:-}" ]; then
  :
elif [ -d "$HOME/.nvm" ]; then
  NVM_DIR="$HOME/.nvm"
elif [ -d "/usr/local/opt/nvm" ]; then
  NVM_DIR="$HOME/.nvm"
else
  NVM_DIR="$HOME/.nvm"
fi
export NVM_DIR

# Load nvm
if [ -s "$NVM_DIR/nvm.sh" ]; then
  # shellcheck disable=SC1090
  . "$NVM_DIR/nvm.sh"
else
  echo "❌ nvm.sh not found at: $NVM_DIR/nvm.sh" >&2
  echo "   Install nvm or set NVM_DIR correctly." >&2
  exit 3
fi

# Install/use Node 20 and run command in that environment
nvm install 20 >/dev/null
nvm use 20 >/dev/null

echo "✓ exec under Node $(node -v) ($(command -v node))"
exec "$@"
