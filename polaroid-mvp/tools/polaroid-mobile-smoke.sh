#!/bin/sh
set -euo pipefail

CDIR="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$CDIR" || exit 1

CURL="${CURL:-/usr/bin/curl}"
CATBIN="${CATBIN:-/bin/cat}"
DATEBIN="${DATEBIN:-/bin/date}"

STEP="${1:-}"
if [ -z "${STEP:-}" ]; then
  echo "❌ Usage: polaroid-mvp/tools/polaroid-mobile-smoke.sh <STEP_NUMBER>"
  exit 2
fi
case "$STEP" in
  *[!0-9]*)
    echo "❌ STEP must be numeric (got: $STEP)"
    exit 2
    ;;
esac

RUNBOOK="polaroid-mvp/tools/run-polaroid-tunnel.sh"
LIVE_FILE="polaroid-mvp/LIVE_URL.txt"

echo "========== ▶️ POLAROID MOBILE SMOKE (TOOL) ◀️ =========="

# Local origin health gate
LOCAL_HEALTH="$("$CURL" -sS -o /dev/null -w "%{http_code}" "http://127.0.0.1:8088/polaroid-mvp/health" || true)"
if [ "$LOCAL_HEALTH" != "200" ]; then
  echo "❌ Local origin unhealthy: /polaroid-mvp/health => ${LOCAL_HEALTH:-000}"
  exit 3
fi
echo "✓ Local origin healthy (200)"

# Issue/refresh tunnel URL
if [ ! -x "$RUNBOOK" ]; then
  echo "❌ Missing/executable runbook: $RUNBOOK"
  exit 4
fi
sh "$RUNBOOK" >/dev/null 2>&1 || true

LIVE_URL=""
if [ -f "$LIVE_FILE" ]; then
  LIVE_URL="$("$CATBIN" "$LIVE_FILE" 2>/dev/null | tr -d '\r' | head -n 1 || true)"
fi
if [ -z "${LIVE_URL:-}" ]; then
  echo "❌ LIVE_URL.txt missing/empty"
  exit 5
fi

echo "LIVE_URL=$LIVE_URL"
echo
echo "ACTION REQUIRED (DO NOW):"
echo "1) iPhone Safari open: $LIVE_URL"
echo "2) Tap color → Polaroid appears → Save PNG works"
echo "3) Record result (ONE):"
echo "   POLAROID_MOBILE_RESULT=PASS polaroid-mvp/tools/record-mobile-result.sh $STEP"
echo "   POLAROID_MOBILE_RESULT=FAIL polaroid-mvp/tools/record-mobile-result.sh $STEP"
echo
echo "Then lock (ONE):"
echo "   POLAROID_FINAL_RESULT=PASS polaroid-mvp/tools/lock-mobile-result.sh $STEP"
echo "   POLAROID_FINAL_RESULT=FAIL polaroid-mvp/tools/lock-mobile-result.sh $STEP"
echo
echo "========== ▲ END POLAROID MOBILE SMOKE (TOOL) ▲ =========="
