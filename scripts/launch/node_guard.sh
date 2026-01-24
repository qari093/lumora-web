#!/bin/sh
set -euo pipefail

# Enforce Node based on repo pins (.nvmrc preferred, fallback .node-version).
want=""
if [ -f ".nvmrc" ]; then
  want="$(tr -d ' \t\r\n' < .nvmrc || true)"
fi
if [ -z "${want:-}" ] && [ -f ".node-version" ]; then
  want="$(tr -d ' \t\r\n' < .node-version || true)"
fi

if [ -z "${want:-}" ]; then
  echo "❌ node_guard: missing .nvmrc/.node-version"
  exit 2
fi

# Load nvm if not already available (macOS common paths).
load_nvm() {
  if command -v nvm >/dev/null 2>&1; then return 0; fi
  if [ -s "$HOME/.nvm/nvm.sh" ]; then
    # shellcheck disable=SC1091
    . "$HOME/.nvm/nvm.sh"
    return 0
  fi
  if [ -s "/opt/homebrew/opt/nvm/nvm.sh" ]; then
    # shellcheck disable=SC1091
    . "/opt/homebrew/opt/nvm/nvm.sh"
    return 0
  fi
  if [ -s "/usr/local/opt/nvm/nvm.sh" ]; then
    # shellcheck disable=SC1091
    . "/usr/local/opt/nvm/nvm.sh"
    return 0
  fi
  return 1
}

if ! load_nvm; then
  echo "❌ node_guard: nvm not available; install nvm and retry"
  exit 2
fi

# Ensure & activate pinned node version
nvm install "$want" >/dev/null
nvm use "$want" >/dev/null

got="$(node -v 2>/dev/null | sed 's/^v//')"
if [ "$got" != "$want" ]; then
  echo "❌ node_guard: want=${want} got=${got}"
  exit 2
fi

echo "✓ node_guard: Node v${got} active"
