#!/bin/sh
set -u

SCRIPT="${1:-/tmp/phase_step.sh}"
TAIL_LINES="${2:-200}"

if [ ! -f "$SCRIPT" ]; then
  echo "❌ Missing script: $SCRIPT"
  exit 2
fi

# Normalize CRLF -> LF (paste-safe)
TMP="$(mktemp)"
tr -d '\r' < "$SCRIPT" > "$TMP"
mv "$TMP" "$SCRIPT"
chmod +x "$SCRIPT" 2>/dev/null || true

OUT_DIR="$HOME/lumora-web/ops/_analysis"
mkdir -p "$OUT_DIR"

STAMP="$(date -u +"%Y%m%dT%H%M%SZ" 2>/dev/null || date)"
OUT="$OUT_DIR/last_run_capture_${STAMP}.log"

echo "▶️ Running: $SCRIPT" | tee "$OUT"
echo "▶️ Shell: /bin/sh -x (trace enabled)" | tee -a "$OUT"
echo "------------------------------------------------------------" | tee -a "$OUT"

# Run with trace; DO NOT let wrapper hide the failing line.
set +e
/bin/sh -x "$SCRIPT" >>"$OUT" 2>&1
RC="$?"
set -e

echo "------------------------------------------------------------" | tee -a "$OUT"
echo "▶️ Exit code: $RC" | tee -a "$OUT"
echo "▶️ Log: $OUT"
echo
echo "▶️ Tail ($TAIL_LINES lines):"
echo "------------------------------------------------------------"
tail -n "$TAIL_LINES" "$OUT" || true
echo "------------------------------------------------------------"

exit "$RC"
