#!/usr/bin/env python3
"""
Safe file writer.
Usage:
  python3 scripts/guard/write_file.py <path> <base64-content>
Prevents shell heredoc issues completely.
"""
import sys, base64, pathlib

if len(sys.argv) != 3:
    print("usage: write_file.py <path> <base64-content>")
    sys.exit(2)

path = pathlib.Path(sys.argv[1])
data = base64.b64decode(sys.argv[2]).decode("utf-8")

path.parent.mkdir(parents=True, exist_ok=True)
path.write_text(data, encoding="utf-8")

print(f"✓ wrote: {path}")
