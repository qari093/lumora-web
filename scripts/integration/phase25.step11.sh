#!/usr/bin/env bash
# Step 25.11 — LumaSpace /api/lumaspace/state contract verifier (with schemaVersion)
set -euo pipefail

ROOT="${LUMORA_ROOT:-$HOME/lumora-web}"
cd "$ROOT" || { echo "❌ Project not found at $ROOT"; exit 1; }

LOG_FILE="logs/phase25.step11.lumaspace-state-contract.log"
PORT="${PORT:-3000}"

mkdir -p logs
echo "Step 25.11 — LumaSpace state contract verifier (PORT=$PORT)" | tee "$LOG_FILE"

URL="http://127.0.0.1:$PORT/api/lumaspace/state"
echo "Checking $URL" | tee -a "$LOG_FILE"

TMP_HDR="/tmp/phase25.step11.hdr.$$"
TMP_BODY="/tmp/phase25.step11.body.$$"

if ! curl -fsS -D "$TMP_HDR" -o "$TMP_BODY" "$URL" 2>>"$LOG_FILE"; then
  echo "❌ Request to $URL failed (see $LOG_FILE)" | tee -a "$LOG_FILE"
  rm -f "$TMP_HDR" "$TMP_BODY" 2>/dev/null || true
  exit 1;
fi

echo "Response headers:" | tee -a "$LOG_FILE"
head -n 10 "$TMP_HDR" | tee -a "$LOG_FILE"

echo "--- raw body (first 260 bytes) ---" | tee -a "$LOG_FILE"
head -c 260 "$TMP_BODY" 2>/dev/null | tee -a "$LOG_FILE"
echo | tee -a "$LOG_FILE"

if command -v jq >/dev/null 2>&1; then
  echo "Running jq-based shape checks..." | tee -a "$LOG_FILE"

  if ! jq -e '.ok == true' "$TMP_BODY" >/dev/null 2>&1; then
    echo "❌ Contract: .ok != true" | tee -a "$LOG_FILE"
    rm -f "$TMP_HDR" "$TMP_BODY" 2>/dev/null || true
    exit 1
  fi

  if ! jq -e '.schemaVersion == 1' "$TMP_BODY" >/dev/null 2>&1; then
    echo "❌ Contract: .schemaVersion != 1" | tee -a "$LOG_FILE"
    rm -f "$TMP_HDR" "$TMP_BODY" 2>/dev/null || true
    exit 1
  fi

  if ! jq -e '.mode == "demo" or .mode == "beta" or .mode == "live"' "$TMP_BODY" >/dev/null 2>&1; then
    echo "❌ Contract: .mode is not demo|beta|live" | tee -a "$LOG_FILE"
    rm -f "$TMP_HDR" "$TMP_BODY" 2>/dev/null || true
    exit 1
  fi

  if ! jq -e '(.sections | type=="array") and (.sections | length > 0)' "$TMP_BODY" >/dev/null 2>&1; then
    echo "❌ Contract: .sections not a non-empty array" | tee -a "$LOG_FILE"
    rm -f "$TMP_HDR" "$TMP_BODY" 2>/dev/null || true
    exit 1
  fi

  if ! jq -e 'all(.sections[]; has("id") and has("label") and has("enabled") and has("weight"))' "$TMP_BODY" >/dev/null 2>&1; then
    echo "❌ Contract: one or more sections missing required keys" | tee -a "$LOG_FILE"
    rm -f "$TMP_HDR" "$TMP_BODY" 2>/dev/null || true
    exit 1
  fi

  echo "✅ LumaSpace state contract OK (schemaVersion 1)" | tee -a "$LOG_FILE"
else
  echo "ℹ️ jq not installed — skipping strict JSON shape checks" | tee -a "$LOG_FILE"
fi

rm -f "$TMP_HDR" "$TMP_BODY" 2>/dev/null || true

echo "Integration notes:" | tee -a "$LOG_FILE"
echo "- This script now locks schemaVersion=1 for /api/lumaspace/state." | tee -a "$LOG_FILE"
echo "- Bump schemaVersion and adjust checks when evolving the payload format." | tee -a "$LOG_FILE"

echo "Optimization notes:" | tee -a "$LOG_FILE"
echo "- When introducing v2+, keep this endpoint backward compatible or expose /state/v2." | tee -a "$LOG_FILE"

echo "Step 25.11 — done" | tee -a "$LOG_FILE"
