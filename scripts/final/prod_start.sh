. "$(cd "$(dirname "$0")/../.."  pwd)/.lumora_safe_bootstrap.sh"
#!/bin/sh
set -euo pipefail
PORT="${PORT:-3000}"
HOSTNAME="${HOSTNAME:-0.0.0.0}"
/tmp/lumora_final_restart_prod_${PORT}.sh
