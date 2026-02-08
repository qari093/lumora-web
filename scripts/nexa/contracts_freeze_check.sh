#!/bin/sh
set -e

cd ~/lumora-web 2>/dev/null || { echo "❌ project not found"; exit 2; }

CONTRACTS="docs/nexa/contracts.v1.json"
LOCK=".lumora_nexa_contracts_v1_sha.lock"

[ -f "$CONTRACTS" ] || { echo "❌ missing: $CONTRACTS"; exit 3; }
[ -f "$LOCK" ] || { echo "❌ missing: $LOCK"; exit 4; }

CUR="$(shasum -a 256 "$CONTRACTS" | awk '{print $1}')"
LOCKED="$(grep -E '^NEXA_CONTRACTS_V1_SHA256=' "$LOCK" | head -n1 | cut -d= -f2-)"

if [ -z "$CUR" ] || [ -z "$LOCKED" ]; then
  echo "❌ unreadable sha (cur/locked empty)"
  echo "cur=$CUR"
  echo "locked=$LOCKED"
  exit 5
fi

if [ "$CUR" != "$LOCKED" ]; then
  echo "❌ NEXA contracts frozen — change rejected"
  echo "locked=$LOCKED"
  echo "current=$CUR"
  echo
  echo "If you intentionally need to change contracts, rotate lock explicitly:"
  echo "  shasum -a 256 $CONTRACTS | awk '{print \$1}'"
  echo "  (then update .lumora_nexa_contracts_v1_sha.lock in a dedicated step)"
  exit 6
fi

echo "✓ OK: NEXA contracts unchanged"
