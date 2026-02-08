. "$(cd "$(dirname "$0")/../.."  pwd)/.lumora_safe_bootstrap.sh"
#!/bin/sh
set -euo pipefail

echo "▶️ CI Mega Gate — Launch (Headers + Terminal Safety)"
echo "──────────────────────────────────────────────────────────────"

# Require scripts
[ -x scripts/ci/launch_headers_gate.sh ] || { echo "❌ missing scripts/ci/launch_headers_gate.sh"; exit 2; }
[ -x scripts/ci/terminal_safety_gate.sh ] || { echo "❌ missing scripts/ci/terminal_safety_gate.sh"; exit 2; }

echo "• gate A: launch headers suite (Steps 53–57)"
sh scripts/ci/launch_headers_gate.sh

echo
echo "• gate B: terminal safety (no-heredoc + paste-guard)"
sh scripts/ci/terminal_safety_gate.sh

echo
echo "✅ CI Mega Gate — OK"
