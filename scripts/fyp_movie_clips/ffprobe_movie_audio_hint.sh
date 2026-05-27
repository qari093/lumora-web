#!/usr/bin/env bash
set -euo pipefail

FILE="${1:-}"

if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
  echo "Usage: $0 /path/to/movie.mp4"
  exit 1
fi

ffprobe -v error -print_format json -show_streams -show_format "$FILE"
