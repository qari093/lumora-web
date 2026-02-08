. "$(cd "$(dirname "$0")/../.."  pwd)/.lumora_safe_bootstrap.sh"
#!/bin/sh
set -eu
# Run a command without letting pasted leading "#" lines hit zsh interactively.
# Usage: sh scripts/guard/run_clean.sh -- <cmd> [args...]
if [ "${1:-}" != "--" ]; then
  echo "usage: sh scripts/guard/run_clean.sh -- <cmd> [args...]"
  exit 2
fi
shift
if [ $# -lt 1 ]; then
  echo "missing command"
  exit 2
fi
exec "$@"
