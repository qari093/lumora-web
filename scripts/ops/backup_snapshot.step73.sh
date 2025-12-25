#!/bin/sh
set -euo pipefail

PROJECT_ROOT="${PROJECT_ROOT:-$HOME/lumora-web}"
cd "$PROJECT_ROOT" || { echo "❌ project not found"; exit 1; }

TS="$(date -u +"%Y%m%dT%H%M%SZ")"
OUT_DIR="ops/_backups"
mkdir -p "$OUT_DIR"

NAME="lumora_web_snapshot_${TS}"
ZIP="${OUT_DIR}/${NAME}.zip"
MANIFEST="${OUT_DIR}/${NAME}.manifest.txt"

# Select minimal-but-useful artifacts (does NOT include secrets)
# NOTE: .env* are intentionally excluded.
SEL="
branding
ops/_locks
ops/_rollback
docs
prisma
app
scripts
package.json
pnpm-lock.yaml
package-lock.json
yarn.lock
tsconfig.json
next.config.*
"

# Build manifest of existing paths only
: > "$MANIFEST"
printf "%s\n" "$SEL" | while IFS= read -r p; do
  [ -n "$p" ] || continue
  # expand globs safely
  for m in $p; do
    if [ -e "$m" ]; then
      printf "%s\n" "$m" >> "$MANIFEST"
    fi
  done
done

if [ ! -s "$MANIFEST" ]; then
  echo "❌ Backup manifest empty."
  exit 1
fi

command -v zip >/dev/null 2>&1 || { echo "❌ zip not found"; exit 1; }

# Create zip from manifest list
zip -r -q "$ZIP" -@ < "$MANIFEST"

chmod 444 "$MANIFEST" "$ZIP" 2>/dev/null || true

echo "✓ Backup manifest: $MANIFEST"
echo "✓ Backup zip:      $ZIP"
echo "Step 73 — done"
