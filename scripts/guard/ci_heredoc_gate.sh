. "$(cd "$(dirname "$0")/../.."  pwd)/.lumora_safe_bootstrap.sh"
#!/bin/sh
set -euo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

echo "▶️ Heredoc CI Gate"
sh scripts/guard/check_heredocs.sh
echo "✓ Heredocs validated"
echo "✓ CI gate passed"
