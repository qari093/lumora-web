#!/bin/sh
set -euo pipefail

cd ~/lumora-web || { echo "❌ project not found"; exit 1; }

CF_BIN="/usr/local/bin/cloudflared"
[ -x "$CF_BIN" ] || CF_BIN="$(command -v cloudflared || true)"
[ -n "${CF_BIN:-}" ] || { echo "❌ cloudflared not found"; exit 2; }

DATE_BIN="/bin/date"
SLEEP_BIN="/bin/sleep"
KILL_BIN="/bin/kill"
PS_BIN="/bin/ps"
GREP_BIN="/usr/bin/grep"; [ -x "$GREP_BIN" ] || GREP_BIN="/bin/grep"
TAIL_BIN="/usr/bin/tail"; [ -x "$TAIL_BIN" ] || TAIL_BIN="/bin/tail"
AWK_BIN="/usr/bin/awk"; [ -x "$AWK_BIN" ] || AWK_BIN="/usr/bin/awk"

RUNBOOK_DIR="polaroid-mvp/tools"
LOG="polaroid-mvp/tunnel.log"
PIDF="polaroid-mvp/tunnel.pid"
URLF="polaroid-mvp/LIVE_URL.txt"

mkdir -p "$RUNBOOK_DIR"

# Best-effort stop old tunnel (only if it was our last PID)
if [ -f "$PIDF" ]; then
  oldpid="$(cat "$PIDF" 2>/dev/null || true)"
  if [ -n "${oldpid:-}" ] && "$PS_BIN" -p "$oldpid" >/dev/null 2>&1; then
    "$KILL_BIN" -TERM "$oldpid" >/dev/null 2>&1 || true
    "$SLEEP_BIN" 0.5 || true
  fi
fi

# Clear previous URL (avoid stale reads)
: > "$URLF"

# Start new quick tunnel (account-less), force edge IPv4 and http2 to reduce QUIC/DNS weirdness
ts="$("$DATE_BIN" -u +"%Y-%m-%dT%H:%M:%SZ")"
{
  echo "[$ts] starting quick tunnel → http://127.0.0.1:8088"
} >> "$LOG"

"$CF_BIN" tunnel --edge-ip-version 4 --protocol http2 --no-autoupdate --url http://127.0.0.1:8088 >>"$LOG" 2>&1 &
pid="$!"
echo "$pid" > "$PIDF"

# Extract URL from log (retry up to ~12s)
i=0
url=""
while [ "$i" -lt 24 ]; do
  url="$("$GREP_BIN" -Eo 'https://[a-z0-9-]+\.trycloudflare\.com' "$LOG" 2>/dev/null | "$TAIL_BIN" -n 1 || true)"
  if [ -n "${url:-}" ]; then break; fi
  "$SLEEP_BIN" 0.5
  i=$((i+1))
done

[ -n "${url:-}" ] || { echo "❌ Could not extract trycloudflare URL from log: $LOG"; exit 3; }

# Persist full URL including path
echo "${url}/polaroid-mvp/index.html" > "$URLF"

echo "LIVE_URL=$(cat "$URLF")"
echo "TUNNEL_PID=$pid"
