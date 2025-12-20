#!/bin/sh
set -euo pipefail

CLOUDFLARED="/usr/local/bin/cloudflared"
CURL="/usr/bin/curl"
GREP="/usr/bin/grep"
SED="/usr/bin/sed"
HEAD="/usr/bin/head"
CAT="/bin/cat"
PS="/bin/ps"
KILL="/bin/kill"

URL_FILE="polaroid-mvp/LIVE_URL.txt"
PID_FILE="polaroid-mvp/tunnel.pid"
LOG_FILE="polaroid-mvp/tunnel.log"

ORIGIN="http://127.0.0.1:8088"

[ -x "$CLOUDFLARED" ] || { echo "❌ cloudflared missing: $CLOUDFLARED"; exit 2; }

# Ensure origin is up
code="$("$CURL" -sS -o /dev/null -w '%{http_code}' "$ORIGIN/polaroid-mvp/health" || true)"
[ "$code" = "200" ] || { echo "❌ origin not healthy (code=$code)"; exit 3; }

# Kill previous tunnel (pid file) if alive
if [ -f "$PID_FILE" ]; then
  oldpid="$("$CAT" "$PID_FILE" 2>/dev/null || true)"
  if [ -n "${oldpid:-}" ] && "$PS" -p "$oldpid" >/dev/null 2>&1; then
    echo "• Stopping prior tunnel pid=$oldpid"
    "$KILL" -TERM "$oldpid" >/dev/null 2>&1 || true
    sleep 1
    "$KILL" -KILL "$oldpid" >/dev/null 2>&1 || true
  fi
fi

# Kill any stray quick tunnels (best-effort) – keep this minimal to avoid killing unrelated instances
/usr/bin/pkill -f "cloudflared tunnel --url $ORIGIN" >/dev/null 2>&1 || true

# Start a fresh quick tunnel and keep it alive
: > "$LOG_FILE"
echo "• Starting quick tunnel to $ORIGIN (background, log=$LOG_FILE)"
nohup "$CLOUDFLARED" tunnel --url "$ORIGIN" --no-autoupdate --protocol quic >"$LOG_FILE" 2>&1 &
pid="$!"
echo "$pid" > "$PID_FILE"

# Wait up to 20s for URL to appear in log
i=0
URL=""
while [ "$i" -lt 40 ]; do
  # Extract the first trycloudflare URL from logs
  URL="$("$GREP" -Eo 'https://[a-z0-9-]+\.trycloudflare\.com' "$LOG_FILE" 2>/dev/null | "$HEAD" -n1 || true)"
  if [ -n "${URL:-}" ]; then
    break
  fi
  # Ensure process still alive
  if ! "$PS" -p "$pid" >/dev/null 2>&1; then
    echo "❌ cloudflared exited early (pid=$pid). Tail log:"
    tail -n 80 "$LOG_FILE" || true
    exit 4
  fi
  i=$((i+1))
  sleep 0.5
done

[ -n "${URL:-}" ] || { echo "❌ Could not extract tunnel URL from log. Tail:"; tail -n 120 "$LOG_FILE" || true; exit 5; }

# Persist full app URL
FULL="$URL/polaroid-mvp/index.html"
printf "%s\n" "$FULL" > "$URL_FILE"
echo "✓ LIVE URL: $FULL"
