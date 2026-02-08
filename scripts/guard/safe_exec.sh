# Lumora SAFE core — zsh/bash compatible, never hard-fails.
# This file MUST NOT source .lumora_safe_bootstrap.sh (bootstrap sources this file).

# Determine this file path in bash/zsh
_lumora_safe_self_path() {
  if [ -n "${BASH_SOURCE[0]+x}" ] && [ -n "${BASH_SOURCE[0]}" ]; then
    printf '%s\n' "${BASH_SOURCE[0]}"
    return 0
  fi
  if [ -n "${ZSH_VERSION-}" ]; then
    # zsh: expands to current sourced file
    eval 'printf "%s\n" "${(%):-%x}"'
    return 0
  fi
  printf '%s\n' "$0"
}

_lumora_safe_root() {
  # Prefer git to find repo root (works from anywhere)
  if command -v git >/dev/null 2>&1; then
    local top
    top="$(git rev-parse --show-toplevel 2>/dev/null)" || top=""
    if [ -n "${top}" ] && [ -d "${top}" ]; then
      printf '%s\n' "${top}"
      return 0
    fi
  fi

  # Fallback: walk up from this file location
  local self dir
  self="$(_lumora_safe_self_path)"
  dir="$(cd "$(dirname "${self}")" 2>/dev/null && pwd -P)" || dir=""
  if [ -n "${dir}" ]; then
    # scripts/guard -> go up two
    printf '%s\n' "$(cd "${dir}/../.." 2>/dev/null && pwd -P || printf '%s\n' "${dir}")"
    return 0
  fi

  # Last resort: current PWD
  pwd -P 2>/dev/null || pwd
}

LUMORA_ROOT="$(_lumora_safe_root)"

safe_run() { "$@" >/dev/null 2>&1 || return 0; }
safe_run_out() { "$@" 2>&1 || return 0; }
safe_source() { [ -f "$1" ] && . "$1" || true; }

safe_env_default() {
  # usage: safe_env_default VAR VALUE
  # shellcheck disable=SC2163
  eval "[ -n \"\${$1-}\" ] || export $1=\"${2}\""
}

safe_cd() {
  [ -d "$1" ] && cd "$1" 2>/dev/null || true
  return 0
}

# Tool wrappers (never fail the caller)
safe_curl() { command -v curl >/dev/null 2>&1 && curl "$@" 2>/dev/null || true; }

safe_node() {
  if command -v node >/dev/null 2>&1; then
    node "$@" || true
  else
    true
  fi
}

safe_pnpm() {
  if command -v pnpm >/dev/null 2>&1; then
    pnpm -s "$@" || true
  else
    # fallback to npx where possible
    if command -v npx >/dev/null 2>&1; then
      npx --yes pnpm -s "$@" || true
    else
      true
    fi
  fi
}

safe_vitest() {
  # uses pnpm if present else npx
  if command -v pnpm >/dev/null 2>&1; then
    pnpm -s vitest "$@" || true
  else
    if command -v npx >/dev/null 2>&1; then
      npx --yes vitest "$@" || true
    else
      true
    fi
  fi
}
