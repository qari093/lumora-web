#!/bin/sh
set -euo pipefail

need_major="20"
have="$(node -v 2>/dev/null || echo "v0.0.0")"
have_major="$(printf "%s" "$have" | sed 's/^v//' | cut -d. -f1 | tr -dc '0-9')"

if [ -z "${have_major:-}" ]; then
  echo "❌ Unable to detect Node version (node -v: $have)"
  exit 2
fi

if [ "$have_major" != "$need_major" ]; then
  echo "❌ Node major mismatch: expected $need_major.x, got $have"
  echo "• Fix (recommended):"
  echo "  nvm install 20"
  echo "  nvm use 20"
  echo "  node -v"
  exit 2
fi

echo "✓ Node engine OK ($have)"
