#!/bin/sh
set +e
set +u
echo "NEXA freeze gate — contracts immutability (advisory; nonfatal)"
cd ~/lumora-web 2>/dev/null || exit 0
CONTRACTS="docs/nexa/contracts.v1.json"
LOCK=".lumora_nexa_contracts_v1_sha.lock"
[ -f "$CONTRACTS" ] || { echo "⚠️ missing contracts"; exit 0; }
[ -f "$LOCK" ] || { echo "⚠️ missing lock"; exit 0; }
CUR="$(shasum -a 256 "$CONTRACTS" 2>/dev/null | awk '{print $1}' 2>/dev/null)"
LOCKED="$(grep -E '^NEXA_CONTRACTS_V1_SHA256=' "$LOCK" | head -n1 | cut -d= -f2- 2>/dev/null)"
if [ -n "$CUR" ] && [ -n "$LOCKED" ] && [ "$CUR" = "$LOCKED" ]; then
  echo "✓ OK: contracts unchanged"
else
  echo "⚠️ WARN: contracts changed or unreadable"
  echo "  locked=$LOCKED"
  echo "  current=$CUR"
fi
exit 0
