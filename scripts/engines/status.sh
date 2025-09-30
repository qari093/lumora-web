#!/usr/bin/env bash
set -euo pipefail
ROOT="$HOME/lumora-web"
VIDDIR="$ROOT/public/videos"
INDEX="$VIDDIR/index.json"

# counts
COUNT=$(node -e 'try{const fs=require("fs");const p=process.argv[1];const j=JSON.parse(fs.readFileSync(p,"utf8"));console.log(Array.isArray(j)?j.length:0)}catch(e){console.log(0)}' "$INDEX" 2>/dev/null || echo 0)
FILES=$(find "$VIDDIR" -type f -name "*.mp4" 2>/dev/null | wc -l | tr -d " ")
SIZE=$(du -sh "$VIDDIR" 2>/dev/null | awk '{print $1}')

# cron job line (if any)
JOB=$(crontab -l 2>/dev/null | grep -F "scripts/engines/video-factory.mjs" || true)

echo "=== Video Factory Status ==="
echo "Index entries:   $COUNT"
echo "MP4 files:       ${FILES:-0}"
echo "Folder size:     ${SIZE:-0}"
echo "Cron job:        ${JOB:-none}"

# recent logs
LOG=/tmp/video-factory.log
RPT=/tmp/video-factory-report.log
[ -f "$LOG" ] && { echo "--- tail $LOG ---"; tail -n 20 "$LOG"; }
[ -f "$RPT" ] && { echo "--- tail $RPT ---"; tail -n 20 "$RPT"; }

# latest 5 slugs from index
node -e 'try{const fs=require("fs");const j=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));const n=j.length;console.log("--- latest 5 slugs ---");for(let i=Math.max(0,n-5);i<n;i++)console.log(j[i].slug)}catch(e){}' "$INDEX" || true
