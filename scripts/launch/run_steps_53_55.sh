#!/bin/sh
set -eu

echo "▶️ Launch — Run Steps 53–55 (prod headers + regression + paste-guard)"
echo "──────────────────────────────────────────────────────────────"

fail=0

run() {
  name="$1"; shift
  echo
  echo "• $name"
  if "$@"; then
    echo "✓ $name — OK"
  else
    echo "❌ $name — FAIL"
    fail=1
  fi
}

# Step 53: verify headers (starts server inside runner)
if [ -x "scripts/launch/step53_run_with_server.sh" ]; then
  run "Step 53 verifier" sh scripts/launch/step53_run_with_server.sh
else
  echo "❌ missing scripts/launch/step53_run_with_server.sh"
  fail=1
fi

# Step 54: regression matrix
if [ -x "scripts/launch/step54_run.sh" ]; then
  run "Step 54 regression" sh scripts/launch/step54_run.sh
else
  echo "❌ missing scripts/launch/step54_run.sh"
  fail=1
fi

# Step 55: paste-guard exists
if [ -x "scripts/guard/run_clean.sh" ]; then
  run "Step 55 paste-guard" sh scripts/guard/run_clean.sh -- sh -c 'echo paste_guard_ok'
else
  echo "❌ missing scripts/guard/run_clean.sh"
  fail=1
fi

echo
echo "• summary artifact"
OUT="/tmp/launch_steps_53_55_summary.txt"
{
  echo "Launch Steps 53–55 Summary"
  echo "ts_utc=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "pwd=$(pwd)"
  echo
  echo "step53_verifier_tail:"
  tail -n 60 /tmp/step53_verifier.out 2>/dev/null || echo "(missing /tmp/step53_verifier.out)"
  echo
  echo "step54_matrix_head:"
  head -n 80 /tmp/step54_headers_regression_matrix.txt 2>/dev/null || echo "(missing /tmp/step54_headers_regression_matrix.txt)"
} > "$OUT"
echo "✓ wrote: $OUT"

echo
if [ "$fail" -ne 0 ]; then
  echo "❌ Launch Steps 53–55 — FAILED"
  exit 2
fi

echo "✅ Launch Steps 53–55 — OK"
