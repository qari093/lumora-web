#!/usr/bin/env bash
set -euo pipefail

# --- repo scope guard (prevents HOME root drift) ---
bash "$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)/scripts/guard/repo_scope_guard.sh"
__LUMORA_GUARD_RC__=$?
if [ "${__LUMORA_GUARD_RC__:-0}" -ne 0 ]; then
  exit "${__LUMORA_GUARD_RC__}"
fi

# ------------------------------------------------------
set +e; set +u; set +o pipefail

# If current shell is zsh, disable history expansion (prevents paste crashes)
set +H 2>/dev/null || true

ROOT="$(pwd 2>/dev/null || true)"
if [ -z "${ROOT}" ] && [ -n "${BASH_SOURCE[0]-}" ]; then
  ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." 2>/dev/null && pwd || true)"
fi

BOOTSTRAP="${ROOT}/.lumora_safe_bootstrap.sh"
[ -f "${BOOTSTRAP}" ] && . "${BOOTSTRAP}" >/dev/null 2>&1 || true

# Provide a "timeout" function if missing (macOS often lacks it)
if ! command -v timeout >/dev/null 2>&1; then
  timeout() {
    # usage: timeout <sec> <cmd...>
    sec="${1:-0}"; shift || true
    sh "${ROOT}/scripts/guard/timeout.sh" "${sec}" "$@"
  }
fi

if [ "${1-}" = "--" ]; then shift; fi
[ "${#}" -gt 0 ] || exit 0
"$@"
exit $?