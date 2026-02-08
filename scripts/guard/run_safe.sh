#!/usr/bin/env bash
# Backward-compatible shim to SAFE_EXEC.
set +e
set +u
set +o pipefail
if [ "${1:-}" = "--" ]; then shift; fi
bash "$(cd "$(dirname "$0")" && pwd)/safe_exec.sh" -- "$@"
