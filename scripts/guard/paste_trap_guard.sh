#!/bin/sh
set -euo pipefail
# Detect being in a stuck paste prompt like: "$ >...." / "bquote>" / "dquote>" / "heredoc>"
# and recover by printing a newline + resetting terminal.
# Usage: sh scripts/guard/paste_trap_guard.sh

# best-effort newline (break out of any pending multiline state in many shells)
printf '\n' || true

# terminal reset (safe even if non-interactive)
reset >/dev/null 2>&1 || true

echo "paste_trap_guard_ok"
