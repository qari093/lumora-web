EXCLUDES="-path './.git/*' -o -path './.next/*' -o -path './node_modules/*' -o -path './.pnpm/*' -o -path './.quarantine/*' -o -path './dist/*' -o -path './build/*' -o -path './coverage/*'"

# Scope excludes (must include deps + quarantine + .git)
# guard-token: -path './.git/*'
# guard-token: -path "./.git/*"
#!/bin/sh
set -eu

ROOT="${1:-.}"

# Conservative fixer for common paste artifacts:
#  - removes lines that are exactly: heredoc>
#  - if a file has an odd number of markdown fence lines (```), appends a closing fence.
# NOTE: Avoid literal triple-backticks in this script to prevent shell parsing issues.

FENCE="$(printf '%s' '```')"

is_binary_ext() {
  case "$1" in
    *.png|*.jpg|*.jpeg|*.gif|*.webp|*.pdf|*.zip|*.gz|*.tgz|*.tar|*.7z) return 0 ;;
  esac
  return 1
}

fix_file() {
  f="$1"

  is_binary_ext "$f" && return 0
  [ -f "$f" ] || return 0

  # Drop exact "heredoc>" prompt lines.
  if grep -nE '^[[:space:]]*heredoc>[[:space:]]*$' "$f" >/dev/null 2>&1; then
    tmp="$(mktemp)"
    sed '/^[[:space:]]*heredoc>[[:space:]]*$/d' "$f" >"$tmp"
    if ! cmp -s "$tmp" "$f"; then
      mv "$tmp" "$f"
      echo "✓ cleaned heredoc prompt: $f"
    else
      rm -f "$tmp"
    fi
  fi

  # Count markdown fence lines (start-of-line optional whitespace + ```).
  # Use awk so we never embed the fence marker in a regex literal here.
  n="$(awk -v fence="$FENCE" '
    BEGIN{c=0}
    {
      line=$0
      sub(/^[[:space:]]+/, "", line)
      if (index(line, fence) == 1) c++
    }
    END{print c}
  ' "$f" 2>/dev/null || printf '%s' 0)"

  case "$n" in
    ''|*[!0-9]*) n=0 ;;
  esac

  if [ "$n" -gt 0 ]; then
    mod=$((n % 2))
    if [ "$mod" -ne 0 ]; then
      # Ensure a newline then close fence.
      printf "\n%s\n" "$FENCE" >>"$f"
      echo "✓ closed unmatched fence: $f"
    fi
  fi
}

FILES="$(find "$ROOT" \( $EXCLUDES \) -prune -o -type f \( -name '*.md' -o -name '*.mdx' \) 2>/dev/null || true)"
[ -n "${FILES:-}" ] || exit 0

for f in $FILES; do
  fix_file "$f"
done
