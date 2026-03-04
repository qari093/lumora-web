#!/usr/bin/env bash
set -euo pipefail


lumora_timeout() {
  # Usage: lumora_timeout <seconds> <cmd...>
  local secs="${1:-10}"; shift || true
  if command -v timeout >/dev/null 2>&1; then
    timeout "${secs}s" "$@"
    return $?
  fi
  if command -v python3 >/dev/null 2>&1; then
    python3 - <<'PYT' "$secs" "$@"
import os, signal, subprocess, sys, time
secs = float(sys.argv[1])
cmd = sys.argv[2:]
if not cmd:
  sys.exit(0)
p = subprocess.Popen(cmd)
t0 = time.time()
while True:
  rc = p.poll()
  if rc is not None:
    sys.exit(rc)
  if time.time() - t0 >= secs:
    try:
      p.send_signal(signal.SIGTERM)
    except Exception:
      pass
    time.sleep(0.2)
    try:
      if p.poll() is None:
        p.kill()
    except Exception:
      pass
    sys.exit(124)
  time.sleep(0.05)
PYT
    return $?
  fi
  # last resort: no timeout
  "$@"
}


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