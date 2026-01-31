#!/bin/sh
# Usage: sh scripts/guard/run_nofail.sh -- <command...>
set -u

if [ "${1:-}" = "--" ]; then shift; fi
if [ $# -eq 0 ]; then
  echo "run_nofail: missing command"
  exit 0
fi

cmd="$1"; shift || true

# shellcheck disable=SC2145
echo "• run_nofail: $cmd $*"

# Run and capture exit code; NEVER propagate non-zero
"$cmd" "$@" >/tmp/lumora_run_nofail.out 2>/tmp/lumora_run_nofail.err
rc=$?

if [ $rc -ne 0 ]; then
  echo "⚠️ run_nofail: command failed rc=$rc (continuing; terminal will NOT terminate)"
  echo "— stdout (last 80) —"
  tail -n 80 /tmp/lumora_run_nofail.out 2>/dev/null || true
  echo "— stderr (last 120) —"
  tail -n 120 /tmp/lumora_run_nofail.err 2>/dev/null || true
  echo "— end —"
else
  echo "✓ run_nofail: ok"
fi

exit 0
