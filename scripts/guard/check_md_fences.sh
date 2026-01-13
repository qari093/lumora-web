#!/bin/sh
set -euo pipefail

# Fast, deterministic markdown fence integrity guard.
# - Uses git ls-files for tracked markdown (preferred).
# - Falls back to find with heavy pruning (no node_modules/.next/.git/.quarantine/etc).
# - Validates that triple-backtick fences are balanced per file.
# - Does NOT require code fences to exist; only checks balance when present.

is_git_repo() { git rev-parse --is-inside-work-tree >/dev/null 2>&1; }

list_files() {
  if is_git_repo; then
    # Tracked markdown only (fast; avoids scanning vendor dirs)
    git ls-files '*.md' '*.mdx' 2>/dev/null || true
  else
    # Fallback: prune heavy dirs
    find . \
      \( -path './.git' -o -path './.git/*' \
         -o -path './node_modules' -o -path './node_modules/*' \
         -o -path './.next' -o -path './.next/*' \
         -o -path './.turbo' -o -path './.turbo/*' \
         -o -path './dist' -o -path './dist/*' \
         -o -path './build' -o -path './build/*' \
         -o -path './coverage' -o -path './coverage/*' \
         -o -path './.quarantine' -o -path './.quarantine/*' \
         -o -path './.cache' -o -path './.cache/*' \
      \) -prune -o \
      \( -name '*.md' -o -name '*.mdx' \) -type f -print 2>/dev/null || true
  fi
}

# Count occurrences of literal triple-backtick fences at line-start or after optional spaces.
# We treat any line that begins with optional spaces then ``` as a fence marker.
count_fences() {
  # $1 file
  # awk is used for speed and portability; avoids grep backtick quirks.
  awk '
    BEGIN{c=0}
    /^[[:space:]]*```/ { c++ }
    END{ print c }
  ' "$1"
}

fail=0
checked=0

# Use NUL-separated list to be safe with filenames when git is available.
if is_git_repo; then
  git ls-files -z '*.md' '*.mdx' 2>/dev/null | while IFS= read -r -d '' f; do
    checked=$((checked+1))
    # Skip quarantine explicitly even if tracked (should not be, but safe)
    case "$f" in
      .quarantine/*) continue ;;
    esac
    n="$(count_fences "$f" || echo 0)"
    # Balanced if even count (0 is ok)
    if [ $((n % 2)) -ne 0 ]; then
      echo "❌ Unbalanced markdown fences in: $f (fence markers: $n)"
      fail=1
    fi
  done
else
  list_files | while IFS= read -r f; do
    [ -n "${f:-}" ] || continue
    checked=$((checked+1))
    case "$f" in
      ./.quarantine/*|./node_modules/*|./.next/*|./.git/*) continue ;;
    esac
    n="$(count_fences "$f" || echo 0)"
    if [ $((n % 2)) -ne 0 ]; then
      echo "❌ Unbalanced markdown fences in: $f (fence markers: $n)"
      fail=1
    fi
  done
fi

# NOTE: Because the loops above run in subshells on some shells, we must re-run in a
# non-subshell way to preserve fail/checked reliably. Use a file list snapshot.

tmp="$(mktemp)"
if is_git_repo; then
  git ls-files '*.md' '*.mdx' >"$tmp" 2>/dev/null || true
else
  list_files >"$tmp" || true
fi

fail=0
checked=0
while IFS= read -r f; do
  [ -n "${f:-}" ] || continue
  case "$f" in
    .quarantine/*|./.quarantine/*) continue ;;
    node_modules/*|./node_modules/*) continue ;;
    .next/*|./.next/*) continue ;;
    .git/*|./.git/*) continue ;;
  esac
  checked=$((checked+1))
  if [ ! -f "$f" ]; then
    # Ignore stale tracked path in weird states
    continue
  fi
  n="$(count_fences "$f" || echo 0)"
  if [ $((n % 2)) -ne 0 ]; then
    echo "❌ Unbalanced markdown fences in: $f (fence markers: $n)"
    fail=1
  fi
done <"$tmp"
rm -f "$tmp"

if [ "$checked" -eq 0 ]; then
  echo "ℹ No markdown files discovered; skipping."
  exit 0
fi

if [ "$fail" -ne 0 ]; then
  echo "❌ Markdown fence guard failed"
  exit 1
fi

echo "✓ Markdown fence guard OK (checked: $checked)"
