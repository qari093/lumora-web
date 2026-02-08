. "$(cd "$(dirname "$0")/../.."  pwd)/.lumora_safe_bootstrap.sh"
#!/bin/sh
set +e
set +u

# Usage:
#   . scripts/dev/port_resolve.sh
#   echo "$PORT"
#
# Rules:
# - If PORT is set and numeric, keep it.
# - Else default to 3040.

is_num() { echo "${1:-}" | grep -Eq '^[0-9]+$'; }

if is_num "${PORT:-}"; then
  : # keep
else
  PORT="3040"
fi

export PORT
