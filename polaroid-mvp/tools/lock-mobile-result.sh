#!/bin/sh
set -euo pipefail

cd ~/lumora-web || { echo "❌ project not found"; exit 1; }

GIT="${GIT:-/usr/bin/git}"
[ -x "$GIT" ] || GIT="$(command -v git || true)"
[ -n "${GIT:-}" ] || { echo "❌ git not found"; exit 2; }

GREP_BIN="/usr/bin/grep"; [ -x "$GREP_BIN" ] || GREP_BIN="/bin/grep"
SED_BIN="/usr/bin/sed"; [ -x "$SED_BIN" ] || SED_BIN="/bin/sed"
DATE_BIN="/bin/date"

MARKER=".lumora_resume_marker"
[ -f "$MARKER" ] || { echo "❌ Missing $MARKER"; exit 2; }

STEP="${POLAROID_MOBILE_STEP:-}"
FINAL="${POLAROID_FINAL_RESULT:-}"
[ -n "${STEP:-}" ] || { echo "❌ Set POLAROID_MOBILE_STEP (e.g. 86)"; exit 3; }

case "${FINAL:-}" in
  PASS|FAIL) : ;;
  *)
    echo "ACTION REQUIRED:"
    echo "Run EXACTLY ONE:"
    echo "  POLAROID_MOBILE_STEP=$STEP POLAROID_FINAL_RESULT=PASS $0"
    echo "  POLAROID_MOBILE_STEP=$STEP POLAROID_FINAL_RESULT=FAIL $0"
    exit 4
    ;;
esac

LOCK_KEY="POST_MEGA_PHASE1_STEP${STEP}_LOCKED_SINGLE=true"
if "$GREP_BIN" -q "^${LOCK_KEY}$" "$MARKER" 2>/dev/null; then
  ALREADY="$("$GREP_BIN" "^POST_MEGA_PHASE1_STEP${STEP}_FINAL_MOBILE_RESULT=" "$MARKER" | tail -n 1 | "$SED_BIN" "s/^POST_MEGA_PHASE1_STEP${STEP}_FINAL_MOBILE_RESULT=//" || true)"
  echo "❌ Step $STEP already locked (FINAL=${ALREADY:-unknown})."
  exit 5
fi

PASS_CT="$("$GREP_BIN" -c "^POST_MEGA_PHASE1_STEP${STEP}_MOBILE_RESULT=PASS$" "$MARKER" 2>/dev/null || true)"
FAIL_CT="$("$GREP_BIN" -c "^POST_MEGA_PHASE1_STEP${STEP}_MOBILE_RESULT=FAIL$" "$MARKER" 2>/dev/null || true)"

echo "• Detected Step${STEP} results in marker:"
echo "  PASS entries: ${PASS_CT:-0}"
echo "  FAIL entries: ${FAIL_CT:-0}"
echo

if [ "${PASS_CT:-0}" -gt 0 ] && [ "${FAIL_CT:-0}" -gt 0 ]; then
  echo "⚠ Conflicting entries exist; locking FINAL=${FINAL} as truth."
elif [ "${PASS_CT:-0}" -eq 0 ] && [ "${FAIL_CT:-0}" -eq 0 ]; then
  echo "❌ No recorded mobile results found for Step $STEP. Record first, then lock."
  exit 6
fi

ts="$("$DATE_BIN" -u +"%Y-%m-%dT%H:%M:%SZ")"
{
  echo "POST_MEGA_PHASE1_STEP${STEP}_FINAL_MOBILE_RESULT=$FINAL"
  echo "POST_MEGA_PHASE1_STEP${STEP}_LOCKED_SINGLE=true"
  echo "POST_MEGA_PHASE1_STEP${STEP}_LOCKED_UTC=$ts"
} >> "$MARKER"

"$GIT" add "$MARKER" >/dev/null 2>&1 || true
if ! "$GIT" diff --cached --quiet 2>/dev/null; then
  "$GIT" commit -m "Polaroid: lock mobile truth for Step ${STEP} (${FINAL})" >/dev/null || true
  echo "✓ Commit created"
else
  echo "ℹ Nothing to commit"
fi

gs="$("$GIT" status --porcelain || true)"
[ -z "$gs" ] || { echo "❌ Working tree not clean:"; echo "$gs"; exit 7; }
echo "✓ Working tree clean"

echo "✓ Locked Step ${STEP} final mobile result: ${FINAL}"
