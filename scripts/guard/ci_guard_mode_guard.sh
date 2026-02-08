. "$(cd "$(dirname "$0")/../.."  pwd)/.lumora_safe_bootstrap.sh"
#!/bin/sh
set -euo pipefail

echo "▶️ Guard mode guard (enforce executable allowlist)"
echo "──────────────────────────────────────────────────────────────"

ROOT="${1:-scripts/guard}"

# Only enforce inside scripts/guard (and its bin/); anything else is out of scope.
case "$ROOT" in
  scripts/guard|scripts/guard/*) : ;;
  *)
    echo "ℹ guard mode guard skipped (out of scope ROOT=$ROOT)"
    exit 0
  ;;
esac

# Collect executable files under ROOT, excluding backups.
# Note: macOS find supports -perm -111.
# Print as relative paths without leading ./ for stable logs.
TMP="$(mktemp)"
find "$ROOT" -type f ! -name '*.bak*' -perm -111 -print | sed 's|^\./||' >"$TMP" || true

fail=0
while IFS= read -r f; do
  [ -n "$f" ] || continue

  # Allow all executables under scripts/guard and scripts/guard/bin explicitly.
  case "$f" in
    scripts/guard/*|scripts/guard/bin/*) : ;;
    *)
      echo "⚠ executable but not allowlisted: $f"
      fail=1
    ;;
  esac
done <"$TMP"

rm -f "$TMP" || true

if [ "$fail" -ne 0 ]; then
  echo "❌ guard mode guard failed"
  exit 1
fi

echo "✓ guard mode guard OK"
