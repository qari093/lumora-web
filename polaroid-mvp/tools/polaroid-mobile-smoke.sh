#!/bin/sh
set -euo pipefail

cd ~/lumora-web || { echo "❌ project not found"; exit 1; }

CURL="${CURL:-/usr/bin/curl}"
DATEBIN="${DATEBIN:-/bin/date}"

RUN_LOCAL="polaroid-mvp/tools/run-local-polaroid.sh"
RUN_TUNNEL="polaroid-mvp/tools/run-polaroid-tunnel.sh"
LIVE_FILE="polaroid-mvp/LIVE_URL.txt"

echo "========== ▶️ POLAROID MOBILE SMOKE (TOOL) ◀️ =========="

# Ensure origin is healthy (local runbook is authoritative)
sh "$RUN_LOCAL" >/dev/null 2>&1 || true

# Local health gate
CODE="$("$CURL" -sS -o /dev/null -w "%{http_code}" "http://127.0.0.1:8088/polaroid-mvp/health" || true)"
if [ "$CODE" != "200" ]; then
  echo "❌ Local origin unhealthy: /polaroid-mvp/health => $CODE"
  exit 2
fi
echo "✓ Local origin healthy (200)"

# Issue tunnel via standard runbook
sh "$RUN_TUNNEL" >/dev/null 2>&1 || true

LIVE_URL=""
if [ -f "$LIVE_FILE" ]; then
  LIVE_URL="$(cat "$LIVE_FILE" 2>/dev/null | tr -d '\r' | head -n1 || true)"
fi

if [ -z "${LIVE_URL:-}" ]; then
  echo "❌ LIVE_URL.txt missing/empty after tunnel runbook"
  exit 3
fi

echo "LIVE_URL=$LIVE_URL"
echo
echo "ACTION REQUIRED (DO NOW):"
echo "1) iPhone Safari open: $LIVE_URL"
echo "2) Tap color → Polaroid appears → Save PNG works"
echo "3) Record result (ONE):"
echo "   POLAROID_MOBILE_RESULT=PASS polaroid-mvp/tools/record-mobile-result.sh 95"
echo "   POLAROID_MOBILE_RESULT=FAIL polaroid-mvp/tools/record-mobile-result.sh 95"
echo
echo "Then lock (ONE):"
echo "   POLAROID_FINAL_RESULT=PASS polaroid-mvp/tools/lock-mobile-result.sh 95"
echo "   POLAROID_FINAL_RESULT=FAIL polaroid-mvp/tools/lock-mobile-result.sh 95"
echo
echo "========== ▲ END POLAROID MOBILE SMOKE (TOOL) ▲ =========="
