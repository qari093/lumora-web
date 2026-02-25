#!/usr/bin/env bash
set -euo pipefail

# bash-3.2 compatible guardrail: ensure git-clean previews never include .lumora_* locks.

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

say(){ printf "%s\n" "$*"; }

# Prefer project-safe wrapper if present
CLEAN_CMD=(git clean)
if [ -x "scripts/guard/git_clean_safe.sh" ]; then
  CLEAN_CMD=(bash "scripts/guard/git_clean_safe.sh")
fi

# Use preview flags passed by caller (default -ndx)
ARGS=("$@")
if [ "${#ARGS[@]}" -eq 0 ]; then
  ARGS=(-ndx)
fi

OUT="$("${CLEAN_CMD[@]}" "${ARGS[@]}" 2>/dev/null || true)"

# If preview lists any .lumora_*, fail hard.
# (strip CR in case of weird formatting)
if printf "%s\n" "$OUT" | tr -d '\r' | grep -E '\.lumora_' >/dev/null 2>&1; then
  say "❌ guardrail: preview contains .lumora_* entries"
  printf "%s\n" "$OUT" | tr -d '\r' | grep -E '\.lumora_' | head -n 80
  exit 1
fi

say "✓ guardrail: preview excludes .lumora_*"
exit 0
