#!/bin/sh
set -euo pipefail

cd ~/lumora-web || { echo "❌ project not found"; exit 1; }

GIT="${GIT:-/usr/bin/git}"
[ -x "$GIT" ] || GIT="$(command -v git || true)"
[ -n "${GIT:-}" ] || { echo "❌ git not found"; exit 2; }

GREP_BIN="/usr/bin/grep"; [ -x "$GREP_BIN" ] || GREP_BIN="/bin/grep"
DATE_BIN="/bin/date"

MARKER=".lumora_resume_marker"
[ -f "$MARKER" ] || { echo "❌ Missing $MARKER"; exit 2; }

RESULT="${POLAROID_MOBILE_RESULT:-}"
STEP="${POLAROID_MOBILE_STEP:-}"
[ -n "${STEP:-}" ] || { echo "❌ Set POLAROID_MOBILE_STEP (e.g. 86)"; exit 3; }

case "$RESULT" in
  PASS|FAIL) : ;;
  *)
    echo "ACTION REQUIRED:"
    echo "Run EXACTLY ONE:"
    echo "  POLAROID_MOBILE_STEP=$STEP POLAROID_MOBILE_RESULT=PASS $0"
    echo "  POLAROID_MOBILE_STEP=$STEP POLAROID_MOBILE_RESULT=FAIL $0"
    exit 4
    ;;
esac

LOCK_KEY="POST_MEGA_PHASE1_STEP${STEP}_LOCKED_SINGLE=true"
if "$GREP_BIN" -q "^${LOCK_KEY}$" "$MARKER" 2>/dev/null; then
  FINAL="$("$GREP_BIN" "^POST_MEGA_PHASE1_STEP${STEP}_FINAL_MOBILE_RESULT=" "$MARKER" | tail -n 1 | sed "s/^POST_MEGA_PHASE1_STEP${STEP}_FINAL_MOBILE_RESULT=//" || true)"
  echo "❌ Step $STEP is already locked (FINAL=${FINAL:-unknown}). Refusing to record another result."
  exit 5
fi

ts="$("$DATE_BIN" -u +"%Y-%m-%dT%H:%M:%SZ")"

{
  echo "POST_MEGA_PHASE1_STEP${STEP}"
  echo "POST_MEGA_PHASE1_STEP${STEP}_UTC=$ts"
  echo "POST_MEGA_PHASE1_STEP${STEP}_MOBILE_RESULT=$RESULT"
} >> "$MARKER"

"$GIT" add "$MARKER" >/dev/null 2>&1 || true
if ! "$GIT" diff --cached --quiet 2>/dev/null; then
  "$GIT" commit -m "Polaroid: record mobile result for Step ${STEP} (${RESULT})" >/dev/null || true
  echo "✓ Commit created"
else
  echo "ℹ Nothing to commit"
fi

gs="$("$GIT" status --porcelain || true)"
[ -z "$gs" ] || { echo "❌ Working tree not clean:"; echo "$gs"; exit 6; }
echo "✓ Working tree clean"

echo "✓ Recorded Step ${STEP} mobile result: ${RESULT}"
