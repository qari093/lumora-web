#!/bin/bash
# ────────────────────────────────────────────────
# Universal block-runner for Lumora (no parse errors)
# Usage: ./scripts/run.sh <<'CMD'
# any multi-line bash code
# CMD
# ────────────────────────────────────────────────
set -euo pipefail
tmpfile=$(mktemp)
cat > "$tmpfile"
bash "$tmpfile"
rm -f "$tmpfile"
