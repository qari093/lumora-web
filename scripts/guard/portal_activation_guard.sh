#!/bin/sh
set -e

PORTALS="video live nexa movies music"

for p in $PORTALS; do
  if grep -R "ENABLE_${p^^}_PORTAL=true" -n .env* app >/dev/null 2>&1; then
    echo "❌ Portal guard: ${p} activated without explicit step"
    exit 1
  fi
done

echo "✓ Portal activation guard OK"
