#!/bin/bash
set -e
set -o pipefail 2>/dev/null || true

# Usage:
#   sh scripts/ops/phase_runner_safe.sh /tmp/phase_step.sh
#   sh scripts/ops/phase_runner_safe.sh --timeout-seconds 180 /tmp/phase_step.sh
#
# Exit codes:
#   2 missing script
#   124 timeout (best-effort)

TIMEOUT_SECS=""
SCRIPT=""

if [ "${1:-}" = "--timeout-seconds" ]; then
  TIMEOUT_SECS="${2:-}"
  SCRIPT="${3:-}"
else
  SCRIPT="${1:-/tmp/phase_step.sh}"
fi

if [ -z "$SCRIPT" ] || [ ! -f "$SCRIPT" ]; then
  echo "❌ Missing script: $SCRIPT"
  exit 2
fi

# Normalize CRLF -> LF (paste-safe)
TMP="$(mktemp)"
tr -d '\r' < "$SCRIPT" > "$TMP"
mv "$TMP" "$SCRIPT"

# Ensure a shebang exists; rewrite to chosen shell to avoid exec mismatch
FIRST="$(head -n1 "$SCRIPT" 2>/dev/null || true)"
case "$FIRST" in
  "#!"*) : ;;
  *)
    TMP="$(mktemp)"
    printf "%s\n" "#!/bin/bash" > "$TMP"
    cat "$SCRIPT" >> "$TMP"
    mv "$TMP" "$SCRIPT"
    ;;
esac

TMP="$(mktemp)"
{ printf "%s\n" "#!/bin/bash"; tail -n +2 "$SCRIPT"; } > "$TMP"
mv "$TMP" "$SCRIPT"
chmod +x "$SCRIPT" 2>/dev/null || true

# Advisory: detect stray standalone heredoc closers that often cause "command not found"
BAD=$(grep -nE '^(EOF|DOC|JSON|MD|SH)$' "$SCRIPT" 2>/dev/null | head -n 1 || true)
if [ -n "$BAD" ]; then
  echo "⚠ Possible stray heredoc closer in $SCRIPT: $BAD"
fi

run_direct() {
  exec "/bin/bash" "$SCRIPT"
}

# Best-effort timeout:
# - Use coreutils timeout if available
# - Else use perl alarm if available
# - Else run directly (no timeout)
if [ -n "$TIMEOUT_SECS" ]; then
  case "$TIMEOUT_SECS" in
    ''|*[!0-9]*)
      echo "❌ Invalid --timeout-seconds value: $TIMEOUT_SECS"
      exit 2
      ;;
  esac

  if command -v timeout >/dev/null 2>&1; then
    exec timeout "$TIMEOUT_SECS" "/bin/bash" "$SCRIPT" || {
      rc=$?
      [ "$rc" -eq 124 ] && echo "❌ Timeout after ${TIMEOUT_SECS}s" >&2
      exit "$rc"
    }
  elif command -v perl >/dev/null 2>&1; then
    exec perl -e '
      my $t = shift @ARGV;
      my $sh = shift @ARGV;
      my $sc = shift @ARGV;
      alarm $t;
      exec($sh, $sc) or exit 127;
    ' "$TIMEOUT_SECS" "/bin/bash" "$SCRIPT" || {
      rc=$?
      [ "$rc" -eq 14 ] && { echo "❌ Timeout after ${TIMEOUT_SECS}s" >&2; exit 124; }
      exit "$rc"
    }
  else
    echo "⚠ No timeout utility available; running without timeout"
    run_direct
  fi
else
  run_direct
fi
