#!/usr/bin/env bash
set -euo pipefail

say(){ printf "%s\n" "$*"; }

HOME_DIR="${HOME}"

# Hard gate: HOME must not contain node_modules (prevents npm/pnpm drift at HOME)
if [ -d "${HOME_DIR}/node_modules" ]; then
  say "❌ repo_scope_guard: HOME/node_modules exists (unsafe): ${HOME_DIR}/node_modules"
  exit 1
fi

# Hard guard: if HOME has a .git dir/file, it is effectively a git repo/worktree.
# This catches `git init` even before `git rev-parse` is usable in some states.
if [ -e "${HOME_DIR}/.git" ]; then
  say "❌ repo_scope_guard: HOME contains .git (${HOME_DIR}/.git)"
  exit 1
fi
TARGET_DEFAULT="${HOME_DIR}/lumora-web"
TARGET="${LUMORA_ROOT:-$TARGET_DEFAULT}"

say "repo_scope_guard: HOME=$HOME_DIR"
say "repo_scope_guard: TARGET=$TARGET"

# 1) HOME must NOT be a git repo
if git -C "$HOME_DIR" rev-parse --show-toplevel >/dev/null 2>&1; then
  say "❌ repo_scope_guard: HOME is a git repo: $(git -C "$HOME_DIR" rev-parse --show-toplevel)"
  say "   Fix: run 'rm -rf \"$HOME_DIR/.git\"' only if it was accidental; ensure real repo is ~/lumora-web."
  exit 1
fi
say "✓ repo_scope_guard: HOME is not a git repo"

# 2) HOME must NOT contain package.json (prevents naive root autodetect from picking HOME)
if [ -f "$HOME_DIR/package.json" ]; then
  say "❌ repo_scope_guard: HOME/package.json exists: $HOME_DIR/package.json"

# Hard gate: HOME must not contain JS lockfiles (prevents tool drift at HOME)
for f in "pnpm-lock.yaml" "yarn.lock" "package-lock.json"; do
  if [ -f "${HOME_DIR}/${f}" ]; then
    say "❌ repo_scope_guard: HOME lockfile exists (unsafe): ${HOME_DIR}/${f}"
    exit 1
  fi
done
  say "   Fix: move it out (quarantine) e.g.:"
  say "     mkdir -p \"$HOME_DIR/.lumora_quarantine_home_root_files\""
  say "     mv \"$HOME_DIR/package.json\" \"$HOME_DIR/.lumora_quarantine_home_root_files/package.json.$(date -u +%Y%m%dT%H%M%SZ)\""
  exit 1
fi
say "✓ repo_scope_guard: HOME/package.json absent"

# 3) TARGET must exist and be a git repo with top-level == TARGET
if [ ! -d "$TARGET" ]; then
  say "❌ repo_scope_guard: missing TARGET dir: $TARGET"
  exit 1
fi
if ! git -C "$TARGET" rev-parse --show-toplevel >/dev/null 2>&1; then
  say "❌ repo_scope_guard: TARGET is not a git repo: $TARGET"
  exit 1
fi
TOP="$(git -C "$TARGET" rev-parse --show-toplevel)"
if [ "$TOP" != "$TARGET" ]; then
  say "❌ repo_scope_guard: TARGET git root mismatch: $TOP != $TARGET"
  exit 1
fi
say "✓ repo_scope_guard: TARGET git root ok: $TOP"

# 4) TARGET status output must not mention HOME folders (extra safety)
STATUS_OUT="$(git -C "$TARGET" status -sb 2>&1 || true)"
if echo "$STATUS_OUT" | grep -Eq 'Desktop/|Documents/|Library/|Downloads/|Pictures/|Movies/|Music/|\.Trash/'; then
  say "❌ repo_scope_guard: TARGET status contains HOME folders; scope drift suspected"
  say "$STATUS_OUT" | sed -n '1,120p'
  exit 1
fi
say "✓ repo_scope_guard: TARGET status clean of HOME folders"
