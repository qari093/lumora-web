. "$(cd "$(dirname "$0")/../.."  pwd)/.lumora_safe_bootstrap.sh"
#!/usr/bin/env bash
# Step 25.4 — LumaSpace Integration Phase 25 Step 4
set -euo pipefail

# Resolve project root (default to ~/lumora-web)
ROOT="${LUMORA_ROOT:-$HOME/lumora-web}"
cd "$ROOT" || { echo "❌ Project not found at $ROOT"; exit 1; }

echo "▶️ Step 25.4 — preparing environment..."
export NODE_ENV=development
export PORT="${PORT:-3000}"

# ──────────────────────────────────────────────────────────────
# 1) Ensure support folders
# ──────────────────────────────────────────────────────────────
mkdir -p scripts/integration logs tmp

# Rotate previous log if present
if [ -f logs/phase25.step4.log ]; then
  mv "logs/phase25.step4.log" "logs/phase25.step4_$(date +%s).log"
fi

LOG_FILE="logs/phase25.step4.log"

# ──────────────────────────────────────────────────────────────
# 2) Lint + type-check (only if scripts exist)
# ──────────────────────────────────────────────────────────────
echo "🧹 Running lint & type-check (if available)..." | tee -a "$LOG_FILE"

if npm run 2>/dev/null | grep -q "lint"; then
  echo "→ npm run lint" | tee -a "$LOG_FILE"
  if ! npm run lint >>"$LOG_FILE" 2>&1; then
    echo "⚠️ Lint finished with errors; see $LOG_FILE" | tee -a "$LOG_FILE"
  fi
else
  echo "ℹ️ No lint script found, skipping" | tee -a "$LOG_FILE"
fi

if npm run 2>/dev/null | grep -q "type-check"; then
  echo "→ npm run type-check" | tee -a "$LOG_FILE"
  if ! npm run type-check >>"$LOG_FILE" 2>&1; then
    echo "⚠️ Type-check finished with errors; see $LOG_FILE" | tee -a "$LOG_FILE"
  fi
else
  echo "ℹ️ No type-check script found, skipping" | tee -a "$LOG_FILE"
fi

# ──────────────────────────────────────────────────────────────
# 3) Restart Next.js dev server
# ──────────────────────────────────────────────────────────────
echo "🚀 Restarting Next.js dev server on PORT=$PORT..." | tee -a "$LOG_FILE"
pkill -f "next dev" >/dev/null 2>&1 || true

# Clean old log for next dev
NEXT_LOG="/tmp/next-dev.out"
rm -f "$NEXT_LOG"

# Start dev server in background
PORT="$PORT" npx next dev >"$NEXT_LOG" 2>&1 & disown
sleep 8

echo "─ Next.js tail ─────────────────────────────────────────" | tee -a "$LOG_FILE"
tail -n 20 "$NEXT_LOG" 2>/dev/null | tee -a "$LOG_FILE" || echo "ℹ️ No Next.js log yet" | tee -a "$LOG_FILE"

# ──────────────────────────────────────────────────────────────
# 4) Smoke check homepage
# ──────────────────────────────────────────────────────────────
echo "🌐 Smoke check: http://127.0.0.1:$PORT" | tee -a "$LOG_FILE"
if curl -fsS "http://127.0.0.1:$PORT" >/tmp/phase25.step4.home.html 2>>"$LOG_FILE"; then
  head -c 220 /tmp/phase25.step4.home.html || true
  echo
  echo "✅ Homepage responded (see /tmp/phase25.step4.home.html)" | tee -a "$LOG_FILE"
else
  echo "⚠️ Homepage check failed; see $LOG_FILE and $NEXT_LOG" | tee -a "$LOG_FILE"
fi

echo "Step 25.4 — done"
