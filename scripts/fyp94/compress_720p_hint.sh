#!/usr/bin/env bash
set -euo pipefail

INPUT="${1:-}"
OUTPUT="${2:-}"

if [ -z "$INPUT" ] || [ -z "$OUTPUT" ]; then
  echo "Usage: bash scripts/fyp94/compress_720p_hint.sh input.mp4 output.mp4"
  exit 1
fi

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "❌ ffmpeg missing"
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
