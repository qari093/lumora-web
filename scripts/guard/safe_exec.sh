. "$(cd "$(dirname "$0")/../.."  pwd)/.lumora_safe_bootstrap.sh"
#!/usr/bin/env bash
# SAFE EXEC — sourced by all Lumora scripts
set +e
set +u
set +o pipefail

safe_run() {
  "$@" || return 0
}

safe_source() {
  [ -f "$1" ] && . "$1" || true
}

export -f safe_run safe_source
