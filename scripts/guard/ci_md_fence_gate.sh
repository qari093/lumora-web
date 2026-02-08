. "$(cd "$(dirname "$0")/../.."  pwd)/.lumora_safe_bootstrap.sh"
#!/bin/sh
set -euo pipefail

echo "▶️ Markdown Fence CI Gate"
sh scripts/guard/check_md_fences.sh
echo "✓ Markdown fences validated"
