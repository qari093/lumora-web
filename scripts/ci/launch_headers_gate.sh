. "$(cd "$(dirname "$0")/../.."  pwd)/.lumora_safe_bootstrap.sh"
#!/bin/sh
set -eu

echo "▶️ CI Gate — Launch Headers Suite (Steps 53–57)"
echo "──────────────────────────────────────────────────────────────"

[ -x "scripts/launch/run_steps_53_57.sh" ] || { echo "❌ missing scripts/launch/run_steps_53_57.sh"; exit 2; }
sh scripts/launch/run_steps_53_57.sh

echo "
✅ CI Gate — Launch Headers Suite — OK"
