#!/bin/sh
set -eu
TARGET="${1:-/tmp/phase_step_target.sh}"
TIMEOUT_S="${2:-90}"
TAIL_N="${3:-260}"

cd "$HOME/lumora-web" || exit 1
WRAP="scripts/ops/run_and_capture_hardkill.sh"
[ -f "$WRAP" ] || { echo "❌ Missing: $WRAP"; exit 2; }

if [ ! -f "$TARGET" ]; then
  echo "❌ Missing target: $TARGET"
  echo "→ Save ONLY the failing step (not the watchdog caller) into /tmp/phase_step_target.sh"
  exit 2
fi

echo "• Running once: $TARGET"
sh "$WRAP" "$TARGET" "$TIMEOUT_S" "$TAIL_N" || true
