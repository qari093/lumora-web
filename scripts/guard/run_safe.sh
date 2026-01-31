#!/bin/sh
set -u

# Usage:
#   sh scripts/guard/run_safe.sh -- <command...>
# Behavior:
# - Runs the command, captures stdout/stderr
# - NEVER exits nonzero (prevents "Terminal terminated with exit code X")
# - Prints the failing command + last 120 lines of logs if it fails

if [ "${1:-}" = "--" ]; then shift; fi
if [ "$#" -lt 1 ]; then
  echo "usage: sh scripts/guard/run_safe.sh -- <command...>"
  exit 0
fi

LOG="/tmp/lumora_safe_run.$$.log"
ERR="/tmp/lumora_safe_run.$$.err"
: > "$LOG" 2>/dev/null || true
: > "$ERR" 2>/dev/null || true

echo "▶️ SAFE-RUN: $*"
echo "pwd: $(pwd)"
echo "time: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "──────────────────────────────────────────────────────────────"

# Run without -e to avoid abrupt termination
"$@" >"$LOG" 2>"$ERR"
EC=$?

if [ "$EC" -ne 0 ]; then
  echo "❌ command failed (exit=$EC): $*"
  echo "— stderr (tail 120) —"
  tail -n 120 "$ERR" 2>/dev/null || true
  echo "— stdout (tail 120) —"
  tail -n 120 "$LOG" 2>/dev/null || true
  echo "— end —"
else
  echo "✓ command ok"
fi

rm -f "$LOG" "$ERR" 2>/dev/null || true
echo "✅ SAFE-RUN — done"
exit 0
