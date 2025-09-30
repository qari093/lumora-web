#!/usr/bin/env bash
set -euo pipefail
KEEP="${KEEP:-14}"
DIR="${1:-backups}"
cd "$DIR" 2>/dev/null || exit 0
ls -1t | tail -n +$((KEEP+1)) | xargs -r rm -f
echo "Rotation complete; kept $KEEP most recent files."
