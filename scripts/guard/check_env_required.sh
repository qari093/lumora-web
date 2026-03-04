#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
REQ_FILE="${ROOT}/artifacts/deploy/env_required.txt"
[ -f "$REQ_FILE" ] || { echo "❌ missing $REQ_FILE (run node scripts/guard/env_required.mjs)"; exit 2; }

# Load .env.production.local if present (do not overwrite existing env)
ENV_FILE="${ROOT}/.env.production.local"
if [ -f "$ENV_FILE" ]; then
  # shellcheck disable=SC2163
  export $(grep -v '^\s*#' "$ENV_FILE" | grep -E '^[A-Za-z_][A-Za-z0-9_]*=' | xargs -0 2>/dev/null || true) || true
  while IFS= read -r line; do
    [ -n "$line" ] || continue
    key="${line%%=*}"
    val="${line#*=}"
    # strip quotes
    val="${val%\"}"; val="${val#\"}"
    val="${val%\'}"; val="${val#\'}"
    if [ -z "${!key:-}" ] && [ -n "${val:-}" ]; then export "$key=$val"; fi
  done < <(grep -v '^\s*#' "$ENV_FILE" | grep -E '^[A-Za-z_][A-Za-z0-9_]*=' || true)
fi

missing=0
while IFS= read -r key; do
  [ -n "$key" ] || continue
  if [ -z "${!key:-}" ]; then
    echo "❌ missing required env: $key"
    missing=1
  fi
done < "$REQ_FILE"

if [ "$missing" -ne 0 ]; then
  echo "❌ required envs missing; set them in hosting provider secrets or .env.production.local"
  exit 3
fi

echo "✅ env required check ok"
