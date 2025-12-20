#!/bin/sh
set -euo pipefail

CLOUDFLARED="${CLOUDFLARED_BIN:-/usr/local/bin/cloudflared}"
[ -x "$CLOUDFLARED" ] || { echo "❌ cloudflared not found/executable at: $CLOUDFLARED"; exit 1; }

BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
URL_FILE="$BASE_DIR/LIVE_URL.txt"
LOG="$BASE_DIR/tunnel.log"
PID="$BASE_DIR/tunnel.pid"

# Prefer HTTP2 when QUIC paths are flaky/blocked. Force IPv4 edge to avoid v6/DNS weirdness.
PROTOCOL="${CLOUDFLARED_PROTOCOL:-http2}"
EDGE_IP_VERSION="${CLOUDFLARED_EDGE_IP_VERSION:-4}"

# best-effort cleanup
pkill -f cloudflared >/dev/null 2>&1 || true
rm -f "$URL_FILE" "$PID" 2>/dev/null || true

echo "• Starting quick tunnel to http://127.0.0.1:8088 (background, log=$LOG)"
# Note: no named tunnel; quick tunnel only.
# --protocol http2 reduces QUIC-related 530s in some networks.
# --edge-ip-version 4 avoids v6-only resolution edge cases.
( "$CLOUDFLARED" tunnel --no-autoupdate --protocol "$PROTOCOL" --edge-ip-version "$EDGE_IP_VERSION" --url http://127.0.0.1:8088 >"$LOG" 2>&1 ) &
echo $! >"$PID"

# Extract base URL (trycloudflare) and write LIVE_URL.txt
# Wait up to 12s for the URL to appear.
i=0
BASE=""
while [ $i -lt 24 ]; do
  BASE="$(/usr/bin/grep -Eo 'https://[a-z0-9-]+\.trycloudflare\.com' "$LOG" | /usr/bin/head -n1 || true)"
  [ -n "${BASE:-}" ] && break
  /bin/sleep 0.5
  i=$((i+1))
done

[ -n "${BASE:-}" ] || { echo "❌ Could not extract trycloudflare URL from log"; /usr/bin/tail -n 80 "$LOG" || true; exit 2; }

echo "${BASE}/polaroid-mvp/index.html" >"$URL_FILE"
echo "✓ LIVE URL: $(/bin/cat "$URL_FILE")"
echo "✓ Tunnel PID running: $(/bin/cat "$PID")"
