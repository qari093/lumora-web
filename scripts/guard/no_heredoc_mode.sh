#!/usr/bin/env bash
set -euo pipefail
# Guard for interactive terminals:
# 1) Disable zsh history expansion to avoid `#!` triggering "event not found"
# 2) Encourage no-heredoc writing patterns for docs/scripts in terminal snippets

# Disable zsh history expansion if running under zsh or if shell supports it
set +H 2>/dev/null || true

# Safety: prevent accidental paste of "heredoc>" lines from interactive prompts
# If stdin contains "heredoc>" (common prompt artifact), fail fast.
if [ -t 0 ]; then
  : # interactive; no stdin check
else
  if grep -q "heredoc>" /dev/stdin; then
    echo "❌ Detected prompt artifact: heredoc> (abort)"
    exit 1
  fi
fi
