#!/bin/sh
set -euo pipefail
# Usage:
#   sh scripts/guard/write_text_file.sh path/to/file "literal text..."
#   sh scripts/guard/write_text_file.sh path/to/file --stdin  (reads from stdin)
#
# This avoids heredocs entirely.

dest="${1:-}"
mode="${2:-}"

if [ -z "${dest:-}" ]; then
  echo "❌ dest required"
  exit 2
fi

if [ "${mode:-}" = "--stdin" ]; then
  python3 - "$dest" <<'PY'
import sys
from pathlib import Path
p = Path(sys.argv[1])
data = sys.stdin.read()
p.parent.mkdir(parents=True, exist_ok=True)
p.write_text(data, encoding="utf-8")
print("✓ wrote:", str(p))
PY
  exit 0
fi

# join remaining args as exact text (preserve newlines passed via $'..' if used)
shift || true
python3 - "$dest" "$*" <<'PY'
import sys
from pathlib import Path
p = Path(sys.argv[1])
data = sys.argv[2] if len(sys.argv) > 2 else ""
p.parent.mkdir(parents=True, exist_ok=True)
p.write_text(data, encoding="utf-8")
print("✓ wrote:", str(p))
PY
