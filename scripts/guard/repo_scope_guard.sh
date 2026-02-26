
# Hard gate: HOME must not contain global git config artifacts

# Hard gate: HOME must not contain package-manager rc files (often indicates project drift)

# Hard gate: HOME must not contain IDE project dirs (often indicates repo drift)
if [ -d "${HOME_DIR}/.vscode" ]; then
  say "❌ repo_scope_guard: HOME has .vscode dir (unsafe): ${HOME_DIR}/.vscode"
  exit 1
fi
if [ -d "${HOME_DIR}/.idea" ]; then
  say "❌ repo_scope_guard: HOME has .idea dir (unsafe): ${HOME_DIR}/.idea"
  exit 1
fi
if [ -d "${HOME_DIR}/.cursor" ]; then
  say "❌ repo_scope_guard: HOME has .cursor dir (unsafe): ${HOME_DIR}/.cursor"
  exit 1
fi
if [ -f "${HOME_DIR}/.npmrc" ]; then
  say "❌ repo_scope_guard: HOME has .npmrc (unsafe): ${HOME_DIR}/.npmrc"
  exit 1
fi
if [ -f "${HOME_DIR}/.yarnrc" ]; then
  say "❌ repo_scope_guard: HOME has .yarnrc (unsafe): ${HOME_DIR}/.yarnrc"
  exit 1
fi
if [ -f "${HOME_DIR}/.yarnrc.yml" ]; then
  say "❌ repo_scope_guard: HOME has .yarnrc.yml (unsafe): ${HOME_DIR}/.yarnrc.yml"
  exit 1
fi
if [ -f "${HOME_DIR}/.pnpmrc" ]; then
  say "❌ repo_scope_guard: HOME has .pnpmrc (unsafe): ${HOME_DIR}/.pnpmrc"
  exit 1
fi
if [ -f "${HOME_DIR}/.pnpmfile.cjs" ]; then
  say "❌ repo_scope_guard: HOME has .pnpmfile.cjs (unsafe): ${HOME_DIR}/.pnpmfile.cjs"
  exit 1
fi
if [ -f "${HOME_DIR}/.gitconfig" ]; then
  say "❌ repo_scope_guard: HOME has .gitconfig (unsafe): ${HOME_DIR}/.gitconfig"
  exit 1
fi
if [ -f "${HOME_DIR}/.git-credentials" ]; then
  say "❌ repo_scope_guard: HOME has .git-credentials (unsafe): ${HOME_DIR}/.git-credentials"
  exit 1
fi
#!/usr/bin/env bash
set -euo pipefail

say(){ printf "%s\n" "$*"; }

HOME_DIR="${HOME}"

# REPO_ROOT_STRICT_CHECK

# REALPATH_STRICT_CHECK

# GIT_WORKTREE_STRICT_CHECK

# GIT_SUBMODULE_STRICT_CHECK

# GITFILE_POINTER_STRICT_CHECK

# REAL_GITDIR_BOUNDARY_STRICT_CHECK

# CRITICAL_GIT_ENV_OVERRIDE_BLOCK

# CRITICAL_PATH_TAMPER_PROTECTION

# CRITICAL_IFS_TAMPER_PROTECTION
# IFS should be default (space, tab, newline). Tampering can break parsing/guards.
if [ "${IFS-}" != $' \t\n' ]; then
  echo "❌ repo_scope_guard: unsafe IFS override detected"
  exit 1
fi
if [ -z "${PATH:-}" ]; then
  echo "❌ repo_scope_guard: PATH is empty"
  exit 1
fi
case ":$PATH:" in
  *"::"*|*":.:"*|*":./:"*)
    echo "❌ repo_scope_guard: unsafe PATH (empty or relative segments)"
    exit 1
  ;;
esac
if [ -n "${GIT_WORK_TREE:-}" ] || [ -n "${GIT_CEILING_DIRECTORIES:-}" ]; then
  echo "❌ repo_scope_guard: critical git env override detected"
  exit 1
fi
if command -v git >/dev/null 2>&1; then
  gitdir="$(git rev-parse --git-dir 2>/dev/null || true)"
  if [ -n "$gitdir" ]; then
    gitdir_real="$(cd "$gitdir" 2>/dev/null && pwd -P || true)"
    root_real="$(cd "$REPO_ROOT" 2>/dev/null && pwd -P)"
    case "$gitdir_real" in
      "$root_real"/*|"$root_real") ;;
      *)
        echo "❌ repo_scope_guard: real gitdir escapes repo root boundary"
        exit 1
        ;;
    esac
  fi
fi
if [ -f ".git" ]; then
  gitfile="$(sed -n '1p' .git 2>/dev/null || true)"
  case "$gitfile" in
    gitdir:*)
      gd="${gitfile#gitdir:}"
      gd="$(printf "%s" "$gd" | sed 's/^ *//;s/ *$//')" 
      # resolve relative path against REPO_ROOT
      if [ -n "$gd" ]; then
        if [ "${gd#/}" = "$gd" ]; then
          gd_path="$REPO_ROOT/$gd"
        else
          gd_path="$gd"
        fi
        gd_real="$(cd "$(dirname "$gd_path")" 2>/dev/null && pwd -P)/$(basename "$gd_path")"
        root_real="$(cd "$REPO_ROOT" 2>/dev/null && pwd -P)"
        case "$gd_real" in
          "$root_real"/*|"$root_real") ;;
          *)
            echo "❌ repo_scope_guard: .git file points outside repo (gitdir escape)"
            exit 1
            ;;
        esac
      fi
      ;;
  esac
fi
if [ -d ".git/modules" ]; then
  for d in .git/modules/*; do
    [ -d "$d" ] || continue
    REAL_MOD="$(cd "$d" 2>/dev/null && pwd -P)"
    REAL_ROOT="$(cd "$REPO_ROOT" 2>/dev/null && pwd -P)"
    case "$REAL_MOD" in
      "$REAL_ROOT"/*|"$REAL_ROOT") ;;
      *)
        echo "❌ repo_scope_guard: submodule gitdir escape detected"
        exit 1
        ;;
    esac
  done
fi
if [ -f ".git" ]; then
  if grep -q "^gitdir: " .git 2>/dev/null; then
    GITDIR_PATH="$(sed -n 's/^gitdir: //p' .git | head -n1)"
    case "$GITDIR_PATH" in
      /*) ;;
      *) GITDIR_PATH="$PWD/$GITDIR_PATH" ;;
    esac
    REAL_GITDIR="$(cd "$(dirname "$GITDIR_PATH")" 2>/dev/null && pwd -P)"
    REAL_ROOT="$(cd "$REPO_ROOT" 2>/dev/null && pwd -P)"
    case "$REAL_GITDIR" in
      "$REAL_ROOT"/*|"$REAL_ROOT") ;;
      *)
        echo "❌ repo_scope_guard: git worktree escape detected"
        exit 1
        ;;
    esac
  fi
fi
REAL_PWD="$(cd "$PWD" 2>/dev/null && pwd -P)"
REAL_ROOT="$(cd "$REPO_ROOT" 2>/dev/null && pwd -P)"
case "$REAL_PWD" in
  "$REAL_ROOT"/*|"$REAL_ROOT") ;;
  *)
    echo "❌ repo_scope_guard: symlink escape detected (outside repo root)"
    exit 1
    ;;
esac
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [ -z "$REPO_ROOT" ]; then
  echo "❌ repo_scope_guard: not inside a git repository"
  exit 1
fi
if [ "$PWD" != "$REPO_ROOT" ]; then
  echo "❌ repo_scope_guard: must execute from repo root only"
  exit 1
fi

# Hard gate: HOME must not contain system package manager signals
if [ -d "${HOME_DIR}/.linuxbrew" ] || [ -d "${HOME_DIR}/.homebrew" ]; then
  echo "❌ repo_scope_guard: HOME has Homebrew directory"
  exit 1
fi
if [ -d "${HOME_DIR}/.config/apt" ]; then
  echo "❌ repo_scope_guard: HOME has apt config directory"
  exit 1
fi
if [ -d "${HOME_DIR}/.chocolatey" ]; then
  echo "❌ repo_scope_guard: HOME has Chocolatey directory"
  exit 1
fi
if [ -d "${HOME_DIR}/scoop" ]; then
  echo "❌ repo_scope_guard: HOME has Scoop directory"
  exit 1
fi

# Hard gate: HOME must not contain Node version manager signals
if [ -d "${HOME_DIR}/.nvm" ]; then
  echo "❌ repo_scope_guard: HOME has .nvm"
  exit 1
fi
if [ -f "${HOME_DIR}/.nvmrc" ]; then
  echo "❌ repo_scope_guard: HOME has .nvmrc"
  exit 1
fi
if [ -f "${HOME_DIR}/.node-version" ]; then
  echo "❌ repo_scope_guard: HOME has .node-version"
  exit 1
fi
if [ -f "${HOME_DIR}/.tool-versions" ]; then
  echo "❌ repo_scope_guard: HOME has .tool-versions"
  exit 1
fi

# Hard gate: HOME must not contain python site-packages/dist-packages directories
if [ -d "${HOME_DIR}/site-packages" ]; then
  echo "❌ repo_scope_guard: HOME has site-packages"
  exit 1
fi
if [ -d "${HOME_DIR}/dist-packages" ]; then
  echo "❌ repo_scope_guard: HOME has dist-packages"
  exit 1
fi

# Hard gate: HOME must not contain Python requirements/project lock files
if [ -f "${HOME_DIR}/requirements.txt" ]; then
  echo "❌ repo_scope_guard: HOME has requirements.txt"
  exit 1
fi
if [ -f "${HOME_DIR}/Pipfile" ]; then
  echo "❌ repo_scope_guard: HOME has Pipfile"
  exit 1
fi
if [ -f "${HOME_DIR}/poetry.lock" ]; then
  echo "❌ repo_scope_guard: HOME has poetry.lock"
  exit 1
fi

# Hard gate: HOME must not contain PHP/Composer project signals
if [ -f "${HOME_DIR}/composer.json" ]; then
  echo "❌ repo_scope_guard: HOME has composer.json"
  exit 1
fi
if [ -f "${HOME_DIR}/composer.lock" ]; then
  echo "❌ repo_scope_guard: HOME has composer.lock"
  exit 1
fi
if [ -d "${HOME_DIR}/vendor" ]; then
  echo "❌ repo_scope_guard: HOME has vendor directory"
  exit 1
fi

# Hard gate: HOME must not contain .NET project signals
if [ -d "${HOME_DIR}/.nuget" ]; then
  echo "❌ repo_scope_guard: HOME has .nuget directory"
  exit 1
fi
if [ -f "${HOME_DIR}/global.json" ]; then
  echo "❌ repo_scope_guard: HOME has global.json"
  exit 1
fi
# detect .NET solution/project files (bounded; HOME should not be a repo/workspace)
if find "${HOME_DIR}" -maxdepth 2 -type f \( -name "*.csproj" -o -name "*.sln" \) -print -quit 2>/dev/null | grep -q .; then
  echo "❌ repo_scope_guard: HOME has .NET project/solution files (*.csproj/*.sln)"
  exit 1
fi

# Hard gate: HOME must not contain Rust project signals
if [ -f "${HOME_DIR}/Cargo.toml" ]; then
  echo "❌ repo_scope_guard: HOME has Cargo.toml"
  exit 1
fi
if [ -f "${HOME_DIR}/Cargo.lock" ]; then
  echo "❌ repo_scope_guard: HOME has Cargo.lock"
  exit 1
fi
if [ -d "${HOME_DIR}/.cargo" ]; then
  echo "❌ repo_scope_guard: HOME has .cargo directory"
  exit 1
fi

# Hard gate: HOME must not contain Go module signals
if [ -f "${HOME_DIR}/go.mod" ]; then
  echo "❌ repo_scope_guard: HOME has go.mod"
  exit 1
fi
if [ -f "${HOME_DIR}/go.sum" ]; then
  echo "❌ repo_scope_guard: HOME has go.sum"
  exit 1
fi

# Hard gate: HOME must not contain Java/Gradle project signals
if [ -f "${HOME_DIR}/build.gradle" ] || [ -f "${HOME_DIR}/build.gradle.kts" ]; then
  echo "❌ repo_scope_guard: HOME has build.gradle"
  exit 1
fi
if [ -f "${HOME_DIR}/pom.xml" ]; then
  echo "❌ repo_scope_guard: HOME has pom.xml"
  exit 1
fi
if [ -d "${HOME_DIR}/.gradle" ]; then
  echo "❌ repo_scope_guard: HOME has .gradle directory"
  exit 1
fi

# Hard gate: HOME must not contain Ruby project signals
if [ -f "${HOME_DIR}/Gemfile" ]; then
  say "❌ repo_scope_guard: HOME has Gemfile: ${HOME_DIR}/Gemfile"
  exit 1
fi
if [ -d "${HOME_DIR}/.bundle" ]; then
  say "❌ repo_scope_guard: HOME has .bundle: ${HOME_DIR}/.bundle"
  exit 1
fi
if [ -f "${HOME_DIR}/.ruby-version" ]; then
  say "❌ repo_scope_guard: HOME has .ruby-version: ${HOME_DIR}/.ruby-version"
  exit 1
fi

# Hard gate: HOME must not contain secret stores (repo drift + sensitive context)
if [ -d "${HOME_DIR}/.ssh" ]; then
  say "❌ repo_scope_guard: HOME has .ssh (sensitive dir): ${HOME_DIR}/.ssh"
  exit 1
fi
if [ -d "${HOME_DIR}/.gnupg" ]; then
  say "❌ repo_scope_guard: HOME has .gnupg (sensitive dir): ${HOME_DIR}/.gnupg"
  exit 1
fi

# Hard gate: HOME must not contain cloud/kube config dirs (repo drift signal)
if [ -d "${HOME_DIR}/.kube" ]; then
  say "❌ repo_scope_guard: HOME has .kube (unsafe kube config dir): ${HOME_DIR}/.kube"
  exit 1
fi
if [ -d "${HOME_DIR}/.aws" ]; then
  say "❌ repo_scope_guard: HOME has .aws (unsafe aws config dir): ${HOME_DIR}/.aws"
  exit 1
fi
if [ -d "${HOME_DIR}/.config/gcloud" ]; then
  say "❌ repo_scope_guard: HOME has .config/gcloud (unsafe gcloud config dir): ${HOME_DIR}/.config/gcloud"
  exit 1
fi

# Hard gate: HOME must not contain IaC / Terraform signals (repo drift signal)
if [ -d "${HOME_DIR}/.terraform" ]; then
  say "❌ repo_scope_guard: HOME has .terraform (unsafe terraform dir): ${HOME_DIR}/.terraform"
  exit 1
fi
if [ -f "${HOME_DIR}/terraform.tfstate" ]; then
  say "❌ repo_scope_guard: HOME has terraform.tfstate (unsafe terraform state): ${HOME_DIR}/terraform.tfstate"
  exit 1
fi
if [ -f "${HOME_DIR}/terraform.tfstate.backup" ]; then
  say "❌ repo_scope_guard: HOME has terraform.tfstate.backup (unsafe terraform state): ${HOME_DIR}/terraform.tfstate.backup"
  exit 1
fi
# Also block common terraform configs at HOME root
if ls "${HOME_DIR}"/*.tf >/dev/null 2>&1; then
  say "❌ repo_scope_guard: HOME has *.tf files (unsafe terraform config): ${HOME_DIR}/*.tf"
  exit 1
fi

# Hard gate: HOME must not contain Docker project signals (repo drift signal)
if [ -d "${HOME_DIR}/.docker" ]; then
  say "❌ repo_scope_guard: HOME has .docker (unsafe docker config dir): ${HOME_DIR}/.docker"
  exit 1
fi
if [ -f "${HOME_DIR}/docker-compose.yml" ]; then
  say "❌ repo_scope_guard: HOME has docker-compose.yml (unsafe compose project): ${HOME_DIR}/docker-compose.yml"
  exit 1
fi
if [ -f "${HOME_DIR}/docker-compose.yaml" ]; then
  say "❌ repo_scope_guard: HOME has docker-compose.yaml (unsafe compose project): ${HOME_DIR}/docker-compose.yaml"
  exit 1
fi

# Hard gate: HOME must not contain Python project/venv signals (repo drift signal)
if [ -d "${HOME_DIR}/.venv" ]; then
  say "❌ repo_scope_guard: HOME has .venv (unsafe python venv): ${HOME_DIR}/.venv"
  exit 1
fi
if [ -d "${HOME_DIR}/venv" ]; then
  say "❌ repo_scope_guard: HOME has venv (unsafe python venv): ${HOME_DIR}/venv"
  exit 1
fi
if [ -f "${HOME_DIR}/pyproject.toml" ]; then
  say "❌ repo_scope_guard: HOME has pyproject.toml (unsafe python project): ${HOME_DIR}/pyproject.toml"
  exit 1
fi
if [ -d "${HOME_DIR}/__pycache__" ]; then
  say "❌ repo_scope_guard: HOME has __pycache__ (unsafe python cache): ${HOME_DIR}/__pycache__"
  exit 1
fi

# Hard gate: HOME must not contain Next.js / Turbo build artifacts
if [ -d "${HOME_DIR}/.next" ]; then
  say "❌ repo_scope_guard: HOME has .next (unsafe build artifact): ${HOME_DIR}/.next"
  exit 1
fi
if [ -d "${HOME_DIR}/.turbo" ]; then
  say "❌ repo_scope_guard: HOME has .turbo (unsafe build artifact): ${HOME_DIR}/.turbo"
  exit 1
fi

# Hard gate: HOME must not contain Prisma project artifacts (schema/config)
if [ -d "${HOME_DIR}/prisma" ] || [ -f "${HOME_DIR}/schema.prisma" ] || [ -f "${HOME_DIR}/prisma/schema.prisma" ]; then
  say "❌ repo_scope_guard: HOME has prisma/ schema (unsafe): ${HOME_DIR}/prisma or schema.prisma"
  exit 1
fi
if [ -f "${HOME_DIR}/prisma.config.ts" ] || [ -f "${HOME_DIR}/prisma.config.js" ] || [ -f "${HOME_DIR}/prisma.config.mjs" ]; then
  say "❌ repo_scope_guard: HOME has prisma.config* (unsafe): ${HOME_DIR}/prisma.config.*"
  exit 1
fi

# Hard gate: HOME must not contain project configs (tsconfig/next.config*)
if [ -f "${HOME_DIR}/tsconfig.json" ] || [ -f "${HOME_DIR}/jsconfig.json" ]; then
  say "❌ repo_scope_guard: HOME has tsconfig/jsconfig (unsafe): ${HOME_DIR}/tsconfig.json or jsconfig.json"
  exit 1
fi
if [ -f "${HOME_DIR}/next.config.js" ] || [ -f "${HOME_DIR}/next.config.mjs" ] || [ -f "${HOME_DIR}/next.config.ts" ]; then
  say "❌ repo_scope_guard: HOME has next.config* (unsafe): ${HOME_DIR}/next.config.*"
  exit 1
fi

# Hard gate: HOME must not contain .env files (often indicates wrong cwd / unsafe secrets scope)
if [ -f "${HOME_DIR}/.env" ]; then
  say "❌ repo_scope_guard: HOME has .env file (unsafe): ${HOME_DIR}/.env"
  exit 1
fi
if ls "${HOME_DIR}/.env."* >/dev/null 2>&1; then
  say "❌ repo_scope_guard: HOME has .env.* files (unsafe): ${HOME_DIR}/.env.*"
  exit 1
fi

# Hard gate: HOME must not contain node_modules (prevents npm/pnpm drift at HOME)

# Hard gate: HOME must not look like a repo working tree
if [ -f "${HOME_DIR}/.gitmodules" ]; then
  say "❌ repo_scope_guard: HOME has .gitmodules (unsafe): ${HOME_DIR}/.gitmodules"
  exit 1
fi
if [ -d "${HOME_DIR}/.github" ]; then
  say "❌ repo_scope_guard: HOME has .github dir (unsafe): ${HOME_DIR}/.github"
  exit 1
fi
if [ -f "${HOME_DIR}/.gitignore" ]; then
  say "❌ repo_scope_guard: HOME has .gitignore (unsafe): ${HOME_DIR}/.gitignore"
  exit 1
fi
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
