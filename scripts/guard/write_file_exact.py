#!/usr/bin/env python3
import sys
from pathlib import Path

def die(msg: str) -> None:
  print("❌ " + msg, file=sys.stderr)
  sys.exit(1)

# Usage:
#   python3 scripts/guard/write_file_exact.py <path> <base64>
if len(sys.argv) != 3:
  die("usage: write_file_exact.py <path> <base64>")

out = Path(sys.argv[1])
b64 = sys.argv[2].strip()

# Minimal base64 validation
if not b64 or any(c.isspace() for c in b64):
  die("base64 must be a single token (no spaces/newlines)")

try:
  import base64
  data = base64.b64decode(b64, validate=True)
except Exception as e:
  die(f"invalid base64: {e}")

out.parent.mkdir(parents=True, exist_ok=True)
out.write_bytes(data)
print("✓ wrote:", str(out))
