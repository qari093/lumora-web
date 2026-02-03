#!/usr/bin/env sh
set -euo pipefail

# Lumora DB Backup Script (Step 14 gate requirement)
# Creates a timestamped DB backup in ./backups/db/
# - Supports Postgres via DATABASE_URL (pg_dump)
# - Supports SQLite via DATABASE_URL=file:... or direct path (copy)
# - Never prints secrets

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT_DIR="${ROOT}/backups/db"
mkdir -p "$OUT_DIR"

ts="$(date -u +"%Y%m%dT%H%M%SZ")"

db_url="${DATABASE_URL:-}"
if [ -z "${db_url}" ]; then
  echo "❌ DATABASE_URL is not set"
  exit 1
fi

is_sqlite=0
sqlite_path=""

case "$db_url" in
  file:*|sqlite:* )
    is_sqlite=1
    sqlite_path="${db_url#file:}"
    sqlite_path="${sqlite_path#sqlite:}"
    ;;
  * )
    is_sqlite=0
    ;;
esac

if [ "$is_sqlite" -eq 1 ]; then
  # Normalize relative path against repo root
  case "$sqlite_path" in
    /*) : ;;
    *) sqlite_path="${ROOT}/${sqlite_path}" ;;
  esac

  if [ ! -f "$sqlite_path" ]; then
    echo "❌ SQLite file not found: $sqlite_path"
    exit 2
  fi

  out="${OUT_DIR}/sqlite_${ts}.db"
  cp -f "$sqlite_path" "$out"
  echo "✓ SQLite backup created: $out"
  exit 0
fi

# Assume Postgres-compatible pg_dump
if ! command -v pg_dump >/dev/null 2>&1; then
  echo "❌ pg_dump not found. Install PostgreSQL client tools (pg_dump) for backups."
  exit 3
fi

out="${OUT_DIR}/postgres_${ts}.dump"
# Use custom format for reliability and restore flexibility
# Do not echo DATABASE_URL
pg_dump --format=custom --no-owner --no-privileges "$db_url" -f "$out"
echo "✓ Postgres backup created: $out"
