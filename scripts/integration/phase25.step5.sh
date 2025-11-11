#!/usr/bin/env bash
# Step 25.5 — LumaSpace route smoke tests
set -euo pipefail

ROOT="${LUMORA_ROOT:-$HOME/lumora-web}"
cd "$ROOT" || { echo "❌ Project not found at $ROOT"; exit 1; }

export NODE_ENV=development
export PORT="${PORT:-3000}"
LOG_FILE="logs/phase25.step5.lumaspace.log"
mkdir -p logs tmp

echo "▶️ Step 25.5 — LumaSpace route smoke tests (PORT=$PORT)" | tee "$LOG_FILE"

check_route () {
  local path="$1"
  local label="$2"
  local url="http://127.0.0.1:${PORT}${path}"
  echo "" | tee -a "$LOG_FILE"
  echo "── $label  ($url)" | tee -a "$LOG_FILE"
  if curl -fsS -D /tmp/phase25.step5.hdr.$$ -o /tmp/phase25.step5.body.$$ "$url" 2>>"$LOG_FILE"; then
    head -n 8 /tmp/phase25.step5.hdr.$$ | tee -a "$LOG_FILE"
    echo "--- body preview ---" | tee -a "$LOG_FILE"
    head -c 260 /tmp/phase25.step5.body.$$ 2>/dev/null | tee -a "$LOG_FILE"
    echo | tee -a "$LOG_FILE"
  else
    echo "⚠️ Request failed for $url (see log)" | tee -a "$LOG_FILE"
  fi
  rm -f /tmp/phase25.step5.hdr.$$ /tmp/phase25.step5.body.$$ 2>/dev/null || true
}

# Ensure Next.js dev is running; if not, start it
if ! curl -fsS "http://127.0.0.1:$PORT" >/dev/null 2>&1; then
  echo "ℹ️ Next.js not responding, restarting dev server..." | tee -a "$LOG_FILE"
  pkill -f "next dev" >/dev/null 2>&1 || true
  NEXT_LOG="/tmp/next-dev.out"
  rm -f "$NEXT_LOG"
  PORT="$PORT" npx next dev >"$NEXT_LOG" 2>&1 & disown
  sleep 8
  echo "─ Next.js tail ─" | tee -a "$LOG_FILE"
  tail -n 16 "$NEXT_LOG" 2>/dev/null | tee -a "$LOG_FILE" || echo "ℹ️ No Next log yet" | tee -a "$LOG_FILE"
fi

# Core LumaSpace pages (non-fatal if 404; this is just mapping)
check_route "/lumaspace"          "LumaSpace index"
check_route "/me/space"           "My Space page"
check_route "/api/lumaspace/ping" "LumaSpace API ping"
check_route "/api/lumaspace/state" "LumaSpace state API"

echo
echo "Step 25.5 — done"
