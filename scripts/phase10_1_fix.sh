#!/usr/bin/env bash
set -euo pipefail

# Ensure demo video exists (only if missing)
if [ ! -f public/videos/test-1.mp4 ]; then
  mkdir -p public/videos
  if command -v ffmpeg >/dev/null 2>&1; then
    ffmpeg -hide_banner -loglevel error -f lavfi -t 6 -i color=c=black:s=720x1280:r=30       -vf "drawtext=fontfile=/System/Library/Fonts/Supplemental/Arial Unicode.ttf:text=Lumora