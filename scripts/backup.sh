#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.."; pwd)"
SRC="$ROOT/prisma/dev.db"
if [ ! -f "$SRC" ]; then
  echo "No database at $SRC"
  exit 0
fi
ts="$(date +%Y%m%d-%H%M%S)"
dst="$ROOT/backups/dev-$ts.db"
cp "$SRC" "$dst"
gzip -f "$dst"
echo "Backup: $dst.gz"
