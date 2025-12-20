#!/bin/sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PORT="${POLAROID_PORT:-8088}"
LOCAL_HEALTH="http://127.0.0.1:${PORT}/polaroid-mvp/health"
LOCAL_URL="http://127.0.0.1:${PORT}/polaroid-mvp/index.html"
URL_FILE="${POLAROID_URL_FILE:-polaroid-mvp/LIVE_URL.txt}"

CFBIN="$(/usr/bin/command -v cloudflared || true)"
[ -n "${CFBIN:-}" ] || { echo "❌ cloudflared not found"; exit 2; }

echo "========== ▶️ POLAROID TUNNEL RUNBOOK ◀️ =========="
echo "ROOT=$ROOT"
echo "PORT=$PORT"
echo "LOCAL_URL=$LOCAL_URL"
echo "LOCAL_HEALTH=$LOCAL_HEALTH"
echo "URL_FILE=$URL_FILE"
echo

echo "• Ensure local server is healthy (start if needed)"
CODE="$(/usr/bin/curl -sS -o /dev/null -w '%{http_code}' "$LOCAL_HEALTH" || true)"
if [ "$CODE" != "200" ]; then
  echo "  - local health not ready (code=$CODE); starting local server via run-local-polaroid.sh"
  ./tools/run-local-polaroid.sh >/dev/null 2>&1 || true
  i=0
  while [ $i -lt 12 ]; do
    CODE="$(/usr/bin/curl -sS -o /dev/null -w '%{http_code}' "$LOCAL_HEALTH" || true)"
    [ "$CODE" = "200" ] && break
    i=$((i+1))
    /bin/sleep 1
  done
fi
[ "$CODE" = "200" ] || { echo "❌ local server not healthy (code=$CODE)"; exit 2; }
echo "✓ Local server healthy"
echo

echo "• Kill any old cloudflared (best-effort)"
/usr/bin/pkill -f cloudflared >/dev/null 2>&1 || true
/bin/sleep 1

LOG="/tmp/polaroid_cf_tunnel.log"
rm -f "$LOG" >/dev/null 2>&1 || true

echo "• Start quick tunnel (detached) to http://127.0.0.1:${PORT}"
nohup "$CFBIN" tunnel --url "http://127.0.0.1:${PORT}" >"$LOG" 2>&1 &
/bin/sleep 2

BASE_URL="$(/usr/bin/awk '/https:\/\/[a-z0-9-]+\.trycloudflare\.com/ {print $NF}' "$LOG" | /usr/bin/head -n1 | /usr/bin/tr -d '\r' || true)"
[ -n "${BASE_URL:-}" ] || {
  echo "❌ Could not capture tunnel base URL yet."
  echo "• log tail:"
  /usr/bin/tail -n 60 "$LOG" || true
  exit 2
}

FULL_URL="${BASE_URL%/}/polaroid-mvp/index.html"
echo "✓ Tunnel URL:"
echo "$FULL_URL"
echo

echo "• Persisting $URL_FILE"
echo "$FULL_URL" > "$URL_FILE"

echo "OPEN ON IPHONE:"
echo "  $FULL_URL"
echo
echo "TAIL TUNNEL LOG:"
echo "  tail -n 60 $LOG"
echo
