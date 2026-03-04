#!/usr/bin/env bash
set -euo pipefail
set +H 2>/dev/null || true

ROOT="${1:-.}"

# Fail ONLY when a line is exactly one of the known interactive paste prompts.
# Allow docs that *mention* these strings in prose.
#
# Matches (line-only, optional whitespace):
#   heredoc>
#   bquote>
#   dquote>
#   $ >....
#
# NOTE: we explicitly exclude .quarantine/ and common build dirs.
PATTERN='^[[:space:]]*(heredoc>|bquote>|dquote>|\\$[[:space:]]*>\\.{4,})[[:space:]]*$'

# Prefer ripgrep for speed/consistency; fallback to grep.
if command -v rg >/dev/null 2>&1; then
  if rg -n --hidden --no-ignore-vcs \
      --glob '!.quarantine/**' \
      --glob '!node_modules/**' \
      --glob '!.next/**' \
      --glob '!dist/**' \
      --glob '!build/**' \
      --glob '!coverage/**' \
      --regexp "$PATTERN" "$ROOT" >/dev/null 2>&1; then
    echo "❌ Found line-only prompt artifact(s):" >&2
    rg -n --hidden --no-ignore-vcs \
      --glob '!.quarantine/**' \
      --glob '!node_modules/**' \
      --glob '!.next/**' \
      --glob '!dist/**' \
      --glob '!build/**' \
      --glob '!coverage/**' \
      --regexp "$PATTERN" "$ROOT" >&2 || true
    exit 1
  fi
else
  # grep -R doesn't support globs like rg; we manually prune common dirs.
  # This fallback is best-effort (still line-only).
  if find "$ROOT" \
      -path "$ROOT/.quarantine" -prune -o \
      -path "$ROOT/node_modules" -prune -o \
      -path "$ROOT/.next" -prune -o \
      -path "$ROOT/dist" -prune -o \
      -path "$ROOT/build" -prune -o \
      -path "$ROOT/coverage" -prune -o \
      -type f -print0 2>/dev/null \
    | xargs -0 grep -nE "$PATTERN" >/dev/null 2>&1; then
    echo "❌ Found line-only prompt artifact(s):" >&2
    find "$ROOT" \
      -path "$ROOT/.quarantine" -prune -o \
      -path "$ROOT/node_modules" -prune -o \
      -path "$ROOT/.next" -prune -o \
      -path "$ROOT/dist" -prune -o \
      -path "$ROOT/build" -prune -o \
      -path "$ROOT/coverage" -prune -o \
      -type f -print0 2>/dev/null \
    | xargs -0 grep -nE "$PATTERN" >&2 || true
    exit 1
  fi
fi

echo "✓ scan ok (no line-only prompt artifacts)"
