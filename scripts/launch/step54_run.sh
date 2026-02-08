. "$(cd "$(dirname "$0")/../.."  pwd)/.lumora_safe_bootstrap.sh"
#!/bin/sh
set -eu
STEP=54
TOTAL=91
echo "▶️ Step ${STEP}/${TOTAL} — RUN"
echo "──────────────────────────────────────────────────────────────"
sh tests/launch/step54_headers_regression.sh
echo "✅ Step ${STEP}/${TOTAL} — done"
