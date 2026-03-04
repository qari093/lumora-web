#!/usr/bin/env bash
set -e
set -u
set -o pipefail

node_ver="$(node -v 2>/dev/null || true)"
if [ -z "${node_ver}" ]; then
  echo "⚠ node not found in PATH"
  exit 0
fi

v="${node_ver#v}"
major="${v%%.*}"

case "${major}" in
  20|21|22)
    echo "✓ node ${node_ver} within supported engines (>=20 <23)"
    exit 0
    ;;
  *)
    echo "⚠ WARNING: node ${node_ver} is outside supported engines (>=20 <23)."
    echo "  Recommended: use Node 22.x (see .nvmrc/.node-version)."
    exit 0
    ;;
esac
