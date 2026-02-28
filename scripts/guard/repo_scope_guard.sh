#!/usr/bin/env bash
set -euo pipefail

say(){ printf "%s\n" "$*"; }

################################################################################
# SAFE SHELL OPTION VALIDATION
################################################################################

lumora_shellopts_ok(){
  local v="${1:-}"
  case "$v" in
    (*[!a-z0-9:-]* ) return 1 ;;
    (*) return 0 ;;
  esac
}

################################################################################
# ENV INJECTION BLOCKS (CRITICAL)
################################################################################

block_env_vars(){
  for _v in "$@"; do
    if env | grep -q "^${_v}=" 2>/dev/null; then
      echo "❌ repo_scope_guard: env injection detected (${_v})"
      exit 1
    fi
  done
}

# Dynamic loaders
block_env_vars LD_PRELOAD LD_LIBRARY_PATH DYLD_INSERT_LIBRARIES DYLD_LIBRARY_PATH DYLD_FRAMEWORK_PATH

# Shell injection
block_env_vars BASH_ENV ENV

# Node loader
if env | grep -q "^NODE_OPTIONS=" 2>/dev/null; then
  if printf "%s" "${NODE_OPTIONS:-}" | grep -Eq '(^|[[:space:]])(--require|-r|--loader|--import|--eval|-e)([[:space:]]|$)'; then
    echo "❌ repo_scope_guard: NODE_OPTIONS loader injection detected"
    exit 1
  fi
fi

################################################################################
# BASIC SHELL SANITY
################################################################################

if [ -n "${CDPATH-}" ]; then
  echo "❌ repo_scope_guard: unsafe CDPATH detected"
  exit 1
fi

if [ -n "${PS4-}" ]; then
  case "${PS4}" in
    *'$('*|*'`'* )
      echo "❌ repo_scope_guard: unsafe PS4 detected"
      exit 1
      ;;
  esac
fi

if [ "${IFS-}" != $' \t\n' ]; then
  echo "❌ repo_scope_guard: unsafe IFS override"
  exit 1
fi

if [ -z "${PATH:-}" ]; then
  echo "❌ repo_scope_guard: PATH empty"
  exit 1
fi

case ":$PATH:" in
  *"::"*|*":.:"*|*":./:"*)
    echo "❌ repo_scope_guard: unsafe PATH segments"
    exit 1
  ;;
esac

################################################################################
# SHELL OPTIONS SANITY
################################################################################

if [ -n "${SHELLOPTS-}" ]; then
  if ! lumora_shellopts_ok "${SHELLOPTS}"; then
    echo "❌ repo_scope_guard: unsafe SHELLOPTS content"
    exit 1
  fi
fi

if [ -n "${BASHOPTS-}" ]; then
  if ! lumora_shellopts_ok "${BASHOPTS}"; then
    echo "❌ repo_scope_guard: unsafe BASHOPTS content"
    exit 1
  fi
fi

################################################################################
# TMPDIR & UMASK
################################################################################

if [ -n "${TMPDIR:-}" ]; then
  case "$TMPDIR" in
    /*) ;;
    *) echo "❌ repo_scope_guard: TMPDIR must be absolute"; exit 1 ;;
  esac
fi

current_umask="$(umask)"
case "$current_umask" in
  000|002|0222|0777)
    echo "❌ repo_scope_guard: unsafe umask ($current_umask)"
    exit 1
  ;;
esac

################################################################################
# GIT ENV OVERRIDES
################################################################################

block_env_vars GIT_DIR GIT_WORK_TREE GIT_CEILING_DIRECTORIES \
               GIT_INDEX_FILE GIT_OBJECT_DIRECTORY \
               GIT_ALTERNATE_OBJECT_DIRECTORIES \
               GIT_EXEC_PATH

################################################################################
# PWD / HOME SANITY
################################################################################

if [ -n "${PWD:-}" ]; then
  case "$PWD" in
    /*) ;;
    *) echo "❌ repo_scope_guard: PWD must be absolute"; exit 1 ;;
  esac
fi

if [ -n "${HOME:-}" ]; then
  case "$HOME" in
    /*) ;;
    *) echo "❌ repo_scope_guard: HOME must be absolute"; exit 1 ;;
  esac
  if [ ! -d "$HOME" ]; then
    echo "❌ repo_scope_guard: HOME does not exist"
    exit 1
  fi
fi

################################################################################
# REPO ROOT VALIDATION
################################################################################

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [ -z "$REPO_ROOT" ]; then
  echo "❌ repo_scope_guard: not inside a git repository"
  exit 1
fi

if [ "$PWD" != "$REPO_ROOT" ]; then
  echo "❌ repo_scope_guard: must execute from repo root"
  exit 1
fi

################################################################################
# TARGET VALIDATION
################################################################################

HOME_DIR="$HOME"
TARGET_DEFAULT="${HOME_DIR}/lumora-web"
TARGET="${LUMORA_ROOT:-$TARGET_DEFAULT}"

if [ ! -d "$TARGET" ]; then
  echo "❌ repo_scope_guard: TARGET missing ($TARGET)"
  exit 1
fi

if ! git -C "$TARGET" rev-parse --show-toplevel >/dev/null 2>&1; then
  echo "❌ repo_scope_guard: TARGET not a git repo"
  exit 1
fi

TOP="$(git -C "$TARGET" rev-parse --show-toplevel)"
if [ "$TOP" != "$TARGET" ]; then
  echo "❌ repo_scope_guard: TARGET git root mismatch"
  exit 1
fi

################################################################################
# FINAL STATUS CHECK
################################################################################

STATUS_OUT="$(git -C "$TARGET" status -sb 2>&1 || true)"
if echo "$STATUS_OUT" | grep -Eq 'Desktop/|Documents/|Library/|Downloads/'; then
  echo "❌ repo_scope_guard: TARGET status contains HOME folders"
  exit 1
fi

say "✓ repo_scope_guard: all checks passed"
exit 0