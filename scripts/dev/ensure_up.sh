#!/usr/bin/env bash
set +e

PORT="${PORT:-3040}"
URL="http://127.0.0.1:${PORT}/api/nexa/health"

echo "Ensure dev server is up — ${URL}"
echo

# If already up, exit quickly.
curl -sS -m 1 "${URL}" >/dev/null 2>&1
if [ "$?" -eq 0 ]; then
  echo "✓ Server already up on port ${PORT}"
  exit 0
fi

echo "• Server not reachable. Starting dev server..."
echo "  (This script will NOT keep it running; it prints the command you should run in a separate terminal.)"
echo
echo "RUN THIS IN A NEW TERMINAL:"
echo "  cd ~/lumora-web && PORT=${PORT} pnpm -s dev -- --port ${PORT}"
echo

echo "Then re-run:"
echo "  PORT=${PORT} sh scripts/dev/ensure_up.sh"
echo
exit 0
