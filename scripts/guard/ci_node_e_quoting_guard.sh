. "$(cd "$(dirname "$0")/../.."  pwd)/.lumora_safe_bootstrap.sh"
#!/bin/sh
set -eu

echo "▶️ Node -e Quoting Guard (forbid backticks and dollar-paren inside double-quoted node -e)"
echo "──────────────────────────────────────────────────────────────"

# Why:
# In sh, using backticks or dollar-paren inside: node -e " ... " triggers command substitution *before* node runs.

FAIL=0

# Find candidate script files in repo
FILES="$(find scripts -type f \( -name '*.sh' -o -name '*.bash' -o -name '*.zsh' \) 2>/dev/null || true)"
if [ -z "${FILES:-}" ]; then
  echo "ℹ no scripts found under scripts/ — skipping"
  exit 0
fi

for f in $FILES; do
  [ -f "$f" ] || continue

  # Skip this guard file itself when scanning (avoid self-hit on explanatory comments)
  case "$f" in
    */ci_node_e_quoting_guard.sh) continue ;;
  esac

  # Flag: node -e " ... ` ... " on same line
  if grep -nE 'node[[:space:]]+-e[[:space:]]+"[^"]*`' "$f" >/dev/null 2>&1; then
    echo "❌ $f contains backticks inside node -e \"...\" (unsafe)."
    grep -nE 'node[[:space:]]+-e[[:space:]]+"[^"]*`' "$f" | sed 's/^/  /'
    FAIL=1
  fi

  # Flag: node -e " ... $ ( ... " on same line (written to avoid "$(" literal in this file)
  if grep -nE 'node[[:space:]]+-e[[:space:]]+"[^"]*\$[[:space:]]*\(' "$f" >/dev/null 2>&1; then
    echo "❌ $f contains dollar-paren inside node -e \"...\" (unsafe)."
    grep -nE 'node[[:space:]]+-e[[:space:]]+"[^"]*\$[[:space:]]*\(' "$f" | sed 's/^/  /'
    FAIL=1
  fi
done

if [ "$FAIL" -ne 0 ]; then
  echo
  echo "Fix guidance:"
  echo "  - Prefer: node -e '\''...no shell expansion...'\'' (single quotes)"
  echo "  - Or write JS to a file and run: node path/to/file.js"
  exit 1
fi

echo "✓ Node -e quoting guard OK"
