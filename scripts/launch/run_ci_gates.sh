#!/bin/sh
set -euo pipefail

echo "▶️ Launch — Local CI Gates Runner"
echo "──────────────────────────────────────────────────────────────"

# Ensure scripts exist
[ -x scripts/ci/launch_headers_gate.sh ] || { echo "❌ missing scripts/ci/launch_headers_gate.sh"; exit 2; }
[ -x scripts/ci/terminal_safety_gate.sh ] || { echo "❌ missing scripts/ci/terminal_safety_gate.sh"; exit 2; }
[ -x scripts/ci/launch_mega_gate.sh ] || { echo "❌ missing scripts/ci/launch_mega_gate.sh"; exit 2; }

echo "• running: ci:launch-headers"
if command -v pnpm >/dev/null 2>&1; then
  pnpm -s run ci:launch-headers
else
  npm run -s ci:launch-headers
fi

echo
echo "• running: ci:terminal-safety"
if command -v pnpm >/dev/null 2>&1; then
  pnpm -s run ci:terminal-safety
else
  npm run -s ci:terminal-safety
fi

echo
echo "• running: ci:launch-mega"
if command -v pnpm >/dev/null 2>&1; then
  pnpm -s run ci:launch-mega
else
  npm run -s ci:launch-mega
fi

echo
echo "✅ Launch — Local CI Gates Runner — OK"
