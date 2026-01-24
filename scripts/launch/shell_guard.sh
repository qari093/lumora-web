#!/bin/sh
set -euo pipefail

# Non-interactive defaults
export CI=1
export GIT_PAGER=cat
export PAGER=cat
export LESS="-FRSX"
export TERM="${TERM:-xterm-256color}"

# Force git to never page or prompt
export GIT_TERMINAL_PROMPT=0
export GIT_OPTIONAL_LOCKS=0

# Prefer stable node bin on macOS zsh sessions that drop PATH
if command -v node >/dev/null 2>&1; then
  :
elif [ -d "$HOME/.nvm" ] && [ -s "$HOME/.nvm/nvm.sh" ]; then
  # shellcheck disable=SC1090
  . "$HOME/.nvm/nvm.sh" >/dev/null 2>&1 || true
fi

# Provide a stable git function
g() {
  if [ -x "scripts/launch/git_safe.sh" ]; then
    scripts/launch/git_safe.sh "$@"
  else
    git --no-pager "$@"
  fi
}
