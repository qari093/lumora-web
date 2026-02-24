#!/usr/bin/env bash
set -euo pipefail

ROOT="${LUMORA_ROOT:-$HOME/lumora-web}"
"$ROOT/scripts/guard/repo_scope_guard.sh" >/dev/null

cd "$ROOT"
exec "$@"
