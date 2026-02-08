. "$(cd "$(dirname "$0")/../.."  pwd)/.lumora_safe_bootstrap.sh"
#!/bin/sh
set -euo pipefail

# Vercel/CI-safe guard that also supports local runs:
# - On Vercel, env vars are injected (no file loading needed).
# - Locally, developers often rely on .env.* files; load them to avoid false failures.

cd "$(dirname "$0")/../.." || exit 1

echo "build_guard: starting"

# Load env files in priority order if present.
# This parser:
# - ignores blank lines and comments
# - supports KEY=VALUE and KEY="VALUE" and KEY='VALUE'
# - exports only if the variable is not already set in the process env
load_env_file() {
  f="$1"
  [ -f "$f" ] || return 0
  echo "build_guard: loading $f"
  # shellcheck disable=SC2162
  while IFS= read -r line || [ -n "$line" ]; do
    case "$line" in
      ''|\#*) continue ;;
    esac
    # Strip leading "export " if present
    line="${line#export }"
    # Only split on first '='
    key="${line%%=*}"
    val="${line#*=}"

    # Skip if key is empty
    [ -n "${key:-}" ] || continue

    # Trim whitespace around key
    key="$(printf "%s" "$key" | sed -e 's/^[[:space:]]\+//' -e 's/[[:space:]]\+$//')"
    [ -n "${key:-}" ] || continue

    # If already set, don't override
    eval "cur=\${$key-}"
    if [ -n "${cur:-}" ]; then
      continue
    fi

    # Trim whitespace around val
    val="$(printf "%s" "$val" | sed -e 's/^[[:space:]]\+//' -e 's/[[:space:]]\+$//')"

    # Unquote if wrapped in single/double quotes
    case "$val" in
      \"*\") val="${val#\"}"; val="${val%\"}" ;;
      \'*\') val="${val#\'}"; val="${val%\'}" ;;
    esac

    # Export
    # NOTE: we avoid eval on value; we assign via printf-safe export
    export "$key=$val"
  done <"$f"
}

# Load only if DATABASE_URL is not already set (common hard requirement)
if [ -z "${DATABASE_URL:-}" ]; then
  load_env_file ".env.production.local"
  load_env_file ".env.local"
  load_env_file ".env"
fi

# Hard requirements (extend as needed)
missing=0
require() {
  name="$1"
  # shellcheck disable=SC2154
  eval "v=\${$name-}"
  if [ -z "${v:-}" ]; then
    echo "❌ build_guard: missing required env: $name"
    missing=1
  else
    echo "✓ build_guard: $name present"
  fi
}

require "DATABASE_URL"

if [ "$missing" -ne 0 ]; then
  echo "❌ build_guard: failed"
  exit 3
fi

echo "✓ build_guard: ok"
