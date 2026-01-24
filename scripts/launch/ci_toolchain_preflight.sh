#!/bin/sh
set -euo pipefail
want="20.20.0"
got="$(node -v | sed 's/^v//')"
if [ "$got" != "$want" ]; then
  echo "❌ Node mismatch: want=$want got=$got"
  echo "   Fix: nvm install $want && nvm use $want"
  exit 2
fi
echo "✓ Node OK: $got"
