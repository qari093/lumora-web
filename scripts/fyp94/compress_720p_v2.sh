#!/usr/bin/env bash
set -euo pipefail

INPUT="${1:-}"
OUTPUT="${2:-}"

if [ -z "$INPUT" ] || [ -z "$OUTPUT" ]; then
  echo "Usage: compress_720p_v2.sh in.mp4 out.mp4"
  exit 1
fi

ffmpeg -y -i "$INPUT" \
  -vf "scale='min(720,iw)':-2" \
  -c:v libx264 \
  -preset veryfast \
  -crf 28 \
  -movflags +faststart \
  -an \
  "$OUTPUT"
