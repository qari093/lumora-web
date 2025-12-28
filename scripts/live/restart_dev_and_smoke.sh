#!/bin/sh
set -euo pipefail

echo "Live Restart+Smoke — start"

PORT="${PORT:-3000}"
LOG="/tmp/lumora_live_smoke_next_dev.log"

echo "• Kill anything on :$PORT (best-effort)"
lsof -tiTCP:"$PORT" -sTCP:LISTEN 2>/dev/null | xargs -n1 kill -9 2>/dev/null || true

echo "• Clean .next"
rm -rf .next 2>/dev/null || true

echo "• Start dev server → $LOG"
nohup sh -c "PORT=$PORT npx next dev" >"$LOG" 2>&1 &
sleep 2

echo "• Wait for server"
i=0
until curl -fsS "http://127.0.0.1:$PORT" >/dev/null 2>&1; do
  i=$((i+1))
  if [ "$i" -gt 40 ]; then
    echo "❌ server did not start. tail:"
    tail -n 80 "$LOG" || true
    exit 2
  fi
  sleep 0.5
done
echo "✓ server OK"

echo "• Smoke: /api/live/portal-spec (first 120 chars)"
curl -fsS "http://127.0.0.1:$PORT/api/live/portal-spec" | head -c 120 || true
echo

echo "• Smoke: /api/persona/manifest (counts)"
node - <<'NODE'
const http=require("http");
http.get("http://127.0.0.1:3000/api/persona/manifest",(res)=>{
  let d=""; res.on("data",c=>d+=c); res.on("end",()=>{
    try{ const j=JSON.parse(d); console.log(`✓ emojis=${j?.emojis?.count} avatars=${j?.avatars?.count}`); }
    catch{ console.log("⚠ parse failed"); }
  });
}).on("error",()=>console.log("⚠ request failed"));
NODE

echo "• Smoke: /api/live/portal-hubs (first 160 chars)"
curl -fsS "http://127.0.0.1:$PORT/api/live/portal-hubs" | head -c 160 || true
echo

echo "• Headers: rate-limit (portal-spec)"
curl -fsSI "http://127.0.0.1:$PORT/api/live/portal-spec" | tr -d '\r' | sed -n '1,25p' || true

echo "• Headers: rate-limit (portal-hubs)"
curl -fsSI "http://127.0.0.1:$PORT/api/live/portal-hubs" | tr -d '\r' | sed -n '1,25p' || true

echo
echo "OPEN:"
echo "  http://localhost:$PORT/live"
echo "  http://localhost:$PORT/live/hubs"
echo "LOG:"
echo "  $LOG"
echo
echo "Live Restart+Smoke — OK"
