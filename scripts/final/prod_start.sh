#!/bin/sh
set -euo pipefail
PORT="${PORT:-3000}"
/tmp/lumora_final_restart_prod_${PORT}.sh
