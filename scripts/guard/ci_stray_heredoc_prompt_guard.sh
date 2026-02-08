. "$(cd "$(dirname "$0")/../.."  pwd)/.lumora_safe_bootstrap.sh"
#!/bin/sh
set -eu

echo "▶️ Stray heredoc prompt guard (block literal 'heredoc>' in docs)"
echo "──────────────────────────────────────────────────────────────"

FAIL=0
FILES="$(find docs -type f \( -name '*.md' -o -name '*.mdx' \) 2>/dev/null || true)"
if [ -z "${FILES:-}" ]; then
  echo "ℹ no docs/ markdown files found"
  exit 0
fi

for f in $FILES; do
  [ -f "$f" ] || continue
  if grep -nE '^[[:space:]]*heredoc>[[:space:]]*$' "$f" >/dev/null 2>&1; then
    echo "❌ stray heredoc prompt found in: $f"
    grep -nE '^[[:space:]]*heredoc>[[:space:]]*$' "$f" | sed 's/^/  /'
    FAIL=1
  fi
done

if [ "$FAIL" -ne 0 ]; then
  echo
  echo "Fix:"
  echo "  sh scripts/guard/md_fence_autofix.sh ."
  exit 1
fi

echo "✓ no stray heredoc prompts found"
