#!/bin/sh
set -euo pipefail

echo "▶️ Guard mode guard (enforce executable allowlist)"
echo "──────────────────────────────────────────────────────────────"

# Newline-delimited allowlist to avoid word-splitting bugs.
ALLOWLIST="$(cat <<'LIST'
scripts/guard/run_safe.sh
scripts/guard/with_node20.sh
scripts/guard/nvm_use_node20.sh
scripts/guard/check_md_fences.sh
scripts/guard/check_heredocs.sh
scripts/guard/check_node_engine.sh
scripts/guard/ci_final36_gate.sh
scripts/guard/ci_md_fence_gate.sh
scripts/guard/ci_heredoc_gate.sh
scripts/guard/ci_node_e_quoting_guard.sh
scripts/guard/ci_stray_heredoc_prompt_guard.sh
scripts/guard/ci_md_fence_autofix_scope_guard.sh
scripts/guard/md_fence_autofix.sh
scripts/guard/ci_guard_mode_guard.sh
LIST
)"

is_allowlisted() {
  # exact line match
  printf "%s\n" "$ALLOWLIST" | grep -Fxq "$1"
}

bad=0

# Hard checks: allowlisted files must exist and be executable.
printf "%s\n" "$ALLOWLIST" | while IFS= read -r f; do
  [ -n "$f" ] || continue
  if [ ! -f "$f" ]; then
    echo "❌ missing: $f"
    bad=1
    continue
  fi
  if [ ! -x "$f" ]; then
    echo "❌ not executable (expected +x): $f"
    bad=1
  fi
done

# If we used a subshell above, the 'bad' won't propagate; re-evaluate deterministically:
bad2=0
printf "%s\n" "$ALLOWLIST" | while IFS= read -r f; do
  [ -n "$f" ] || continue
  if [ ! -f "$f" ] || [ ! -x "$f" ]; then
    bad2=1
    break
  fi
done

# Portable re-check without relying on subshell variable propagation:
# If any allowlisted file is missing or non-executable, fail.
fail=0
while IFS= read -r f; do
  [ -n "$f" ] || continue
  if [ ! -f "$f" ] || [ ! -x "$f" ]; then
    fail=1
    break
  fi
done <<EOF
$ALLOWLIST
EOF

# Warn (not fail) about extra executables in scripts/guard not in allowlist.
if command -v find >/dev/null 2>&1; then
  find scripts/guard -type f -perm -111 2>/dev/null | while IFS= read -r f; do
    if ! is_allowlisted "$f"; then
      echo "⚠ executable but not allowlisted: $f"
    fi
  done
fi

if [ "$fail" -ne 0 ]; then
  echo "❌ guard mode guard failed"
  exit 2
fi

echo "✓ guard mode guard OK"
