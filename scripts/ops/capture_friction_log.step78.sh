#!/bin/sh
set -euo pipefail

PROJECT_ROOT="${PROJECT_ROOT:-$HOME/lumora-web}"
cd "$PROJECT_ROOT" || { echo "❌ project not found"; exit 1; }

TS="$(date -u +"%Y%m%dT%H%M%SZ")"
OUT_DIR="ops/_friction"
mkdir -p "$OUT_DIR"

OUT_FILE="$OUT_DIR/friction_dropoff_${TS}.md"
cp "ops/private_testers/friction_dropoff_log_template.step78.md" "$OUT_FILE"
chmod 644 "$OUT_FILE" 2>/dev/null || true

echo "✓ Created: $OUT_FILE"
echo "Step 78 — done"
