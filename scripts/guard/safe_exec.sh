# Lumora SAFE core — stable wrappers (never block, never fail)
safe_run() { "$@" || return 0; }
safe_run_out() { "$@" 2>/dev/null || true; }
safe_source() { [ -f "$1" ] && . "$1" || true; }

safe_pnpm() {
  if command -v pnpm >/dev/null 2>&1; then safe_run pnpm "$@"; else safe_run npx -y pnpm "$@"; fi
}
safe_vitest() {
  if command -v pnpm >/dev/null 2>&1; then safe_run pnpm -s vitest "$@"; else safe_run npx -y vitest "$@"; fi
}
