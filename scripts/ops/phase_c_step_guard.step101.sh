#!/bin/sh
set -euo pipefail

FILE="${1:-/tmp/phase_step.sh}"
CAP_FILE=".lumora_phase_c_cap.step101"
MAX="110"

if [ -f "$CAP_FILE" ]; then
  # cap file format: PHASE_C_MAX_STEP=110
  v="$(grep -E '^PHASE_C_MAX_STEP=' "$CAP_FILE" 2>/dev/null | tail -n1 | cut -d= -f2 | tr -d '[:space:]' || true)"
  [ -n "${v:-}" ] && MAX="$v"
fi

detect_step() {
  f="$1"
  [ -f "$f" ] || { echo "ℹ Phase C guard: missing file: $f (skipping)"; return 2; }

  # Prefer START STEP banner
  s="$(grep -m1 -E 'START STEP[[:space:]]+[0-9]+' "$f" 2>/dev/null || true)"
  if [ -n "${s:-}" ]; then
    echo "$s" | sed -n 's/.*START STEP[[:space:]]\([0-9][0-9]*\).*/\1/p'
    return 0
  fi

  # Accept PHASE C COMPLETE banner
  s="$(grep -m1 -E 'PHASE C COMPLETE[[:space:]]*\(CAP=[0-9]+' "$f" 2>/dev/null || true)"
  if [ -n "${s:-}" ]; then
    echo "$s" | sed -n 's/.*PHASE C COMPLETE[[:space:]]*(CAP=\([0-9][0-9]*\).*/\1/p'
    return 0
  fi

  return 1
}

STEP="$(detect_step "$FILE" || true)"

if [ -z "${STEP:-}" ]; then
  echo "ℹ Phase C guard: no START STEP or PHASE C COMPLETE banner found in $FILE (skipping)"
  exit 0
fi

# numeric compare (POSIX)
case "$STEP" in
  *[!0-9]*|"") echo "ℹ Phase C guard: unparseable step in $FILE (skipping)"; exit 0 ;;
esac
case "$MAX" in
  *[!0-9]*|"") MAX="110" ;;
esac

if [ "$STEP" -gt "$MAX" ]; then
  echo "❌ Phase C guard: found Step $STEP in $FILE (max allowed: $MAX)"
  exit 2
fi

echo "✓ Phase C guard ok for $FILE (detected step: $STEP, max: $MAX)"
exit 0
