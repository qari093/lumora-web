#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
DB_URL="${DATABASE_URL:-file:./prisma/dev.db}"
if [[ "$DB_URL" != file:* ]]; then
  echo "Only file-based sqlite supported (got: $DB_URL)"; exit 1
fi
DB_PATH="${DB_URL#file:}"
STAMP="$(date +%Y%m%d-%H%M%S)"
mkdir -p backups
cp "$DB_PATH" "backups/dev-$STAMP.db"
echo "Backup written: backups/dev-$STAMP.db"
