#!/bin/sh
set -euo pipefail

cd "${LUMORA_ROOT:-$HOME/lumora-web}" 2>/dev/null || true

MARKER="${MARKER:-.lumora_resume_marker}"
STEP="${1:-}"

GREP="${GREP:-/usr/bin/grep}"
WC="${WC:-/usr/bin/wc}"
DATE="${DATE:-/bin/date}"

FINAL="${POLAROID_FINAL_RESULT:-}"
[ -f "$MARKER" ] || { echo "❌ Missing marker: $MARKER"; exit 2; }
[ -n "$STEP" ] || { echo "❌ Usage: POLAROID_FINAL_RESULT=PASS|FAIL $0 <stepNumber>"; exit 2; }
[ -n "$FINAL" ] || { echo "❌ POLAROID_FINAL_RESULT is required"; exit 2; }

case "$FINAL" in PASS|FAIL) : ;; *) echo "❌ Invalid POLAROID_FINAL_RESULT=$FINAL"; exit 2 ;; esac

# Accept either recorded mobile results, or allow "final lock without prior record" for recovery.
PASS_CNT="$("$GREP" -c "^POST_MEGA_PHASE1_STEP${STEP}_MOBILE_RESULT=PASS$" "$MARKER" 2>/dev/null || true)"
FAIL_CNT="$("$GREP" -c "^POST_MEGA_PHASE1_STEP${STEP}_MOBILE_RESULT=FAIL$" "$MARKER" 2>/dev/null || true)"
ANY_CNT=$((PASS_CNT + FAIL_CNT))

ts="$("$DATE" -u +"%Y-%m-%dT%H:%M:%SZ")"

{
  echo "POST_MEGA_PHASE1_STEP${STEP}_FINAL_MOBILE_RESULT=${FINAL}"
  echo "POST_MEGA_PHASE1_STEP${STEP}_FINAL_MOBILE_RESULT_UTC=${ts}"
  echo "POST_MEGA_PHASE1_STEP${STEP}_LOCKED_SINGLE=true"
  if [ "$ANY_CNT" -eq 0 ]; then
    echo "POST_MEGA_PHASE1_STEP${STEP}_FINAL_LOCK_NO_PRIOR_RECORD=true"
  fi
} >>"$MARKER"

echo "✓ Locked Step ${STEP} final mobile result: ${FINAL}"
exit 0
