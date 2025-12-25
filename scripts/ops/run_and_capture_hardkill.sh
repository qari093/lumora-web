#!/bin/sh
set -eu

TARGET="${1:-}"
TIMEOUT_S="${2:-90}"
TAIL_N="${3:-260}"

if [ -z "${TARGET:-}" ] || [ ! -f "$TARGET" ]; then
  echo "❌ Usage: sh scripts/ops/run_and_capture_hardkill.sh <target.sh> [timeout_s] [tail_lines]"
  exit 2
fi

# Recursion / fork-bomb guard:
# If target contains a call to this wrapper, refuse (it will recurse and fork explode).
if grep -Eq "scripts/ops/run_and_capture_hardkill\.sh" "$TARGET" 2>/dev/null; then
  echo "❌ Refusing to run: target references hardkill wrapper (recursion risk)"
  echo "   target: $TARGET"
  exit 3
fi

LOG_DIR="${LOG_DIR:-ops/_analysis}"
mkdir -p "$LOG_DIR"

TS="$(date -u +"%Y%m%dT%H%M%SZ")"
LOG="$LOG_DIR/hardkill_capture_${TS}.log"

echo "▶️ Running (hardkill): $TARGET"
echo "▶️ Timeout: ${TIMEOUT_S}s"
echo "▶️ Trace: /bin/sh -x"
echo "▶️ Log: $LOG"
echo "------------------------------------------------------------"

# Start traced execution in background; capture stdout+stderr to log
# Use a subshell to avoid polluting parent env.
(
  /bin/sh -x "$TARGET"
) >"$LOG" 2>&1 &
PID="$!"

# Busy-wait with sleep (portable) until timeout
i=0
while kill -0 "$PID" 2>/dev/null; do
  if [ "$i" -ge "$TIMEOUT_S" ]; then
    echo "⛔ Timeout reached; killing PID $PID" >>"$LOG"
    kill -TERM "$PID" 2>/dev/null || true
    # give it a moment
    sleep 1
    kill -KILL "$PID" 2>/dev/null || true
    break
  fi
  i=$((i+1))
  sleep 1
done

# Collect exit code (best-effort)
RC=0
if wait "$PID" 2>/dev/null; then
  RC=0
else
  RC=$?
fi

echo "------------------------------------------------------------"
echo "▶️ Exit code: $RC"
echo
echo "▶️ Tail (${TAIL_N} lines):"
echo "------------------------------------------------------------"
tail -n "$TAIL_N" "$LOG" 2>/dev/null || true
echo "------------------------------------------------------------"
echo "▶️ Exit code: $RC"

exit "$RC"
