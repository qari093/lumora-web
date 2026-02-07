#!/bin/sh
set -euo pipefail

echo "▶️ CI Gate — Terminal Safety (no-heredoc + paste-trap guard)"
echo "──────────────────────────────────────────────────────────────"

[ -x scripts/guard/no_heredoc_gate.sh ] || { echo "❌ missing scripts/guard/no_heredoc_gate.sh"; exit 2; }
[ -x scripts/guard/paste_trap_guard.sh ] || { echo "❌ missing scripts/guard/paste_trap_guard.sh"; exit 2; }

echo "• no-heredoc gate (scripts/launch)"
sh scripts/guard/no_heredoc_gate.sh scripts/launch

echo "• no-heredoc gate (scripts/ci)"
sh scripts/guard/no_heredoc_gate.sh scripts/ci

echo "• no-heredoc gate (scripts/guard)"
sh scripts/guard/no_heredoc_gate.sh scripts/guard

echo "• paste-trap guard (smoke)"
sh scripts/guard/paste_trap_guard.sh >/tmp/ci_paste_trap_guard.out 2>/tmp/ci_paste_trap_guard.err || true
if ! grep -q "paste_trap_guard_ok" /tmp/ci_paste_trap_guard.out 2>/dev/null; then
  echo "❌ paste-trap guard did not emit ok"
  echo "— stdout —"; cat /tmp/ci_paste_trap_guard.out 2>/dev/null || true
  echo "— stderr —"; cat /tmp/ci_paste_trap_guard.err 2>/dev/null || true
  exit 2
fi
echo "✓ paste-trap guard ok"

echo "✅ CI Gate — Terminal Safety — OK"
