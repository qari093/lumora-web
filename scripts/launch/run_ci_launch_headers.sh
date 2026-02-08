. "$(cd "$(dirname "$0")/../.."  pwd)/.lumora_safe_bootstrap.sh"
#!/bin/sh
set -eu

STEP=63
TOTAL=91

cd "$HOME/lumora-web" || { echo "❌ project not found"; exit 1; }

echo "▶️ Step ${STEP}/${TOTAL} — RUN: ci:launch-headers"
echo "──────────────────────────────────────────────────────────────"

if command -v pnpm >/dev/null 2>&1; then
  pnpm -s run ci:launch-headers
else
  npm run -s ci:launch-headers
fi

echo
echo "Artifacts:"
echo "  - /tmp/step53_security_headers_core_routes.txt"
echo "  - /tmp/step54_headers_regression_matrix.txt"
echo "  - /tmp/step57_api_headers_regression.txt"
echo "  - /tmp/launch_steps_53_57_summary.txt"
echo
echo "✅ Step ${STEP}/${TOTAL} — done"
