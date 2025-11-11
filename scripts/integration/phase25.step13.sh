#!/usr/bin/env bash
# Step 25.13 — LumaSpace focused Jest test wrapper (api + banner utils)
set -euo pipefail

ROOT="${LUMORA_ROOT:-$HOME/lumora-web}"
cd "$ROOT" || { echo "❌ Project not found at $ROOT"; exit 1; }

LOG_FILE="logs/phase25.step13.lumaspace-tests.log"
mkdir -p logs

echo "Step 25.13 — running LumaSpace-focused tests" | tee "$LOG_FILE"

# COMPLETE CODE — determine test runner and run only LumaSpace tests if possible
if npm run 2>/dev/null | grep -q "test"; then
  echo "Detected npm test script — running scoped LumaSpace tests…" | tee -a "$LOG_FILE"

  # Try to run only the relevant spec files; fall back to full test if needed.
  if [ -f "tests/api.lumaspace.state.spec.ts" ] || [ -f "tests/api.lumaspace.ping.spec.ts" ] || [ -f "tests/lumaspace.state-banner.util.spec.ts" ]; then
    # Try Jest with pattern if available
    if npx jest --help >/dev/null 2>&1; then
      echo "Using npx jest with pattern: lumaspace" | tee -a "$LOG_FILE"
      if ! npx jest --runInBand --color --testPathPattern="lumaspace" >>"$LOG_FILE" 2>&1; then
        echo "❌ Jest LumaSpace tests failed; see $LOG_FILE" | tee -a "$LOG_FILE"
        exit 1
      fi
    else
      # Fallback: npm test (unscoped)
      echo "npx jest not available; falling back to npm test (all suites)" | tee -a "$LOG_FILE"
      if ! npm test >>"$LOG_FILE" 2>&1; then
        echo "❌ npm test failed; see $LOG_FILE" | tee -a "$LOG_FILE"
        exit 1
      fi
    fi
  else
    echo "No LumaSpace-specific test files found; running generic npm test…" | tee -a "$LOG_FILE"
    if ! npm test >>"$LOG_FILE" 2>&1; then
      echo "❌ npm test failed; see $LOG_FILE" | tee -a "$LOG_FILE"
      exit 1
    fi
  fi
else
  echo "ℹ️ No npm test script found — skipping Jest run for now." | tee -a "$LOG_FILE"
fi

# INTEGRATION NOTES — log how to hook into CI
echo "Integration notes:" | tee -a "$LOG_FILE"
echo "- You can call scripts/integration/phase25.step13.sh in CI to run only LumaSpace tests." | tee -a "$LOG_FILE"
echo "- If Jest is present, it uses --testPathPattern=lumaspace to scope runs." | tee -a "$LOG_FILE"

# OPTIMIZATION RECOMMENDATIONS — log only
echo "Optimization notes:" | tee -a "$LOG_FILE"
echo "- Later: split LumaSpace tests into fast/slow groups and tag them via Jest projects." | tee -a "$LOG_FILE"
echo "- Consider adding snapshot tests for LumaSpaceStateBanner once UI stabilizes." | tee -a "$LOG_FILE"

echo "Step 25.13 — done" | tee -a "$LOG_FILE"
