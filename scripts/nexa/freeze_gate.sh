#!/bin/sh
set -euo pipefail
echo "NEXA freeze gate — contracts immutability (advisory; nonfatal)"
cd ~/lumora-web || exit 0

CONTRACTS="docs/nexa/contracts.v1.json"
LOCK=".lumora_nexa_contracts_v1_sha.lock"
if [ ! -f "$CONTRACTS" ] || [ ! -f "$LOCK" ]; then
  echo "⚠️ missing contracts or lock; skip"
  exit 0
fi

CUR="$(shasum -a 256 "$CONTRACTS" | awk '{print $1}')"
LOCKED="$(grep -E '^NEXA_CONTRACTS_V1_SHA256=' "$LOCK" | head -n1 | cut -d= -f2- || true)"
if [ -z "${LOCKED:-}" ]; then
  echo "⚠️ lock unreadable; skip"
  exit 0
fi

if [ "$CUR" = "$LOCKED" ]; then
  echo "✓ OK: contracts.v1.json unchanged"
else
  echo "⚠️ WARN: contracts.v1.json changed since freeze"
  echo "  locked=$LOCKED"
  echo "  current=$CUR"
  echo "  If this is intentional: bump contracts version + refresh lock."
fi
exit 0
