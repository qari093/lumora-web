#!/bin/sh
set +e
set +u
cd ~/lumora-web 2>/dev/null || exit 0
echo "NEXA freeze CI gate (nonfatal wrapper)"
sh scripts/nexa/contracts_freeze_check.sh
rc=$?
if [ "$rc" -eq 0 ]; then
  echo "✓ gate ok"
else
  echo "❌ gate failed rc=$rc"
fi
exit $rc
