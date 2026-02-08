#!/usr/bin/env bash
###############################################################################
# Lumora SAFE EXEC — never terminates the terminal
# Usage:
#   bash scripts/guard/safe_exec.sh -- <command> [args...]
###############################################################################
set +e
set +u
set +o pipefail

trap ':' EXIT
trap ':' ERR
trap ':' INT
trap ':' TERM

if [ "${1:-}" != "--" ]; then
  echo "usage: bash scripts/guard/safe_exec.sh -- <command> [args...]" >&2
  true
  exit 0
fi
shift || true

ts="$(date -u +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date)"
LOG="/tmp/lumora_safe_exec_$(echo "$ts" | tr ':T' '__')_$$.log"

echo "▶️ SAFE_EXEC"
echo "• ts: ${ts}"
echo "• log: ${LOG}"
echo "• cmd: $*"
echo

rc=0
{
  # Forcefully neutralize any inherited strict mode from parent shells.
  set +e
  set +u
  set +o pipefail

  "$@" || rc=$?

  echo
  echo "✓ SAFE_EXEC completed (rc=${rc})"
} 2>&1 | tee "${LOG}" >/dev/null 2>&1

# Hard guarantee: NEVER propagate failure upward
true
exit 0
