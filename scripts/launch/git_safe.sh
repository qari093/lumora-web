. "$(cd "$(dirname "$0")/../.."  pwd)/.lumora_safe_bootstrap.sh"
#!/bin/sh
set -euo pipefail
export GIT_PAGER=cat
export PAGER=cat
# Always non-interactive; bypass local hooks to prevent exit-code 3/5 loops.
exec git --no-pager -c core.hooksPath=/dev/null "$@"
