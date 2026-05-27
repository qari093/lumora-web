#!/usr/bin/env bash
set -euo pipefail

cd ~/lumora-web || exit 1

echo "Checking first 30 videos for audio tracks..."

HAS_AUDIO=0
CHECKED=0

for f in public/native-fyp/real/*.mp4; do
  [ -f "$f" ] || continue
  CHECKED=$((CHECKED + 1))

  if command -v ffprobe >/dev/null 2>&1; then
    AUDIO=$(ffprobe -v error -select_streams a -show_entries stream=codec_type -of csv=p=0 "$f" 2>/dev/null || true)
    if [ -n "$AUDIO" ]; then
      echo "AUDIO ✅ $f"
      HAS_AUDIO=$((HAS_AUDIO + 1))
    else
      echo "SILENT ❌ $f"
    fi
  fi

  [ "$CHECKED" -ge 30 ] && break
done

echo "CHECKED=$CHECKED"
echo "HAS_AUDIO=$HAS_AUDIO"

if [ "$HAS_AUDIO" -eq 0 ]; then
  echo "RESULT=NO_AUDIO_TRACKS_IN_CURRENT_VIDEOS"
else
  echo "RESULT=AUDIO_TRACKS_FOUND"
fi
