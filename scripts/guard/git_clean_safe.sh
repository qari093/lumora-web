#!/usr/bin/env bash
set -euo pipefail

# Safe wrapper for git clean:
# - ALWAYS protects .lumora_* locks and quarantine dir via -e excludes.
# - Works even when callers pass -x / -X (which ignore .gitignore).
# - Adds defaults but preserves caller flags and paths.
#
# Usage:
#   bash scripts/guard/git_clean_safe.sh -ndx
#   bash scripts/guard/git_clean_safe.sh -fd   (normal)
#
# NOTE: This wrapper intentionally does NOT auto-delete; it just forwards to git clean.
#       The caller controls -n/-f.

EX1=".lumora_*"
EX2=".lumora_quarantine_home_root_files/"

# Build args, ensuring -e excludes are present.
args=("$@")

have_ex1=0
have_ex2=0
for ((i=0; i<${#args[@]}; i++)); do
  if [[ "${args[$i]}" == "-e" && $((i+1)) -lt ${#args[@]} ]]; then
    [[ "${args[$((i+1))]}" == "$EX1" ]] && have_ex1=1
    [[ "${args[$((i+1))]}" == "$EX2" ]] && have_ex2=1
  fi
done

if [[ $have_ex1 -eq 0 ]]; then
  args+=("-e" "$EX1")
fi
if [[ $have_ex2 -eq 0 ]]; then
  args+=("-e" "$EX2")
fi

exec git clean "${args[@]}"
