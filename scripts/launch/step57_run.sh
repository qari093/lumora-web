#!/bin/sh
set -eu
STEP=57
TOTAL=91
echo "▶️ Step ${STEP}/${TOTAL} — RUN"
echo "──────────────────────────────────────────────────────────────"
sh tests/launch/step57_api_headers_regression.sh
echo "✅ Step ${STEP}/${TOTAL} — done"
