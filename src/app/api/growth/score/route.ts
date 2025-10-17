import { NextRequest, NextResponse } from "next/server";
import { predictVirality } from "@/lib/growth";
export const runtime = "edge";
export async function GET() {
  return NextResponse.json({ ok: true, ping: "/api/growth/score" }, { headers: { "Cache-Control": "no-store" } });
}
export async function POST(req: NextRequest){
  const b = await req.json().catch(()=> ({} as any));
  const out = predictVirality({
    title: b.title, caption: b.caption,
    durationSec: Number(b.durationSec||0),
    tags: Array.isArray(b.tags)? b.tags : [],
    hourLocal: Number.isFinite(b.hourLocal) ? Number(b.hourLocal) : undefined
  });
  return NextResponse.json({ ok:true, ...out }, { headers:{ "Cache-Control":"no-store" } });
}
\TS

cat > src/app/api/growth/boost/route.ts <<TS
import { NextRequest, NextResponse } from "next/server";
import { boostAdvice, predictVirality } from "@/lib/growth";
export const runtime = "edge";
export async function GET() {
  return NextResponse.json({ ok: true, ping: "/api/growth/boost" }, { headers: { "Cache-Control": "no-store" } });
}
export async function POST(req: NextRequest){
  const b = await req.json().catch(()=> ({} as any));
  const s = predictVirality({
    title: b.title, caption: b.caption,
    durationSec: Number(b.durationSec||0),
    tags: Array.isArray(b.tags)? b.tags : [],
    hourLocal: Number.isFinite(b.hourLocal) ? Number(b.hourLocal) : undefined
  });
  return NextResponse.json({ ok:true, score: s.score, grade: s.grade, advice: boostAdvice(s.score) }, { headers:{ "Cache-Control":"no-store" } });
}
\TS

cat > src/app/api/growth/copilot/route.ts <<TS
import { NextRequest, NextResponse } from "next/server";
import { copilotSuggestions } from "@/lib/growth";
export const runtime = "edge";
export async function GET() {
  return NextResponse.json({ ok: true, ping: "/api/growth/copilot" }, { headers: { "Cache-Control": "no-store" } });
}
export async function POST(req: NextRequest){
  const b = await req.json().catch(()=> ({} as any));
  const out = copilotSuggestions({
    title: b.title, caption: b.caption,
    durationSec: Number(b.durationSec||0),
    tags: Array.isArray(b.tags)? b.tags : [],
    hourLocal: Number.isFinite(b.hourLocal) ? Number(b.hourLocal) : undefined
  });
  return NextResponse.json({ ok:true, ...out }, { headers:{ "Cache-Control":"no-store" } });
}
\TS

# Clean restart
pkill -f "next dev" >/dev/null 2>&1 || true
rm -rf .next >/dev/null 2>&1 || true
PORT=3000 npx next dev >/tmp/next-dev.out 2>&1 & disown

# Detect port & wait for POST /api/growth/score to succeed
: "http://127.0.0.1:3000"
cat >/tmp/pay.json <<'JSON'
{"title":"Unlock instant joy in 5s","caption":"I love Lumora - amazing! #joy","durationSec":12,"tags":["joy","wellness"],"hourLocal":19}
JSON
for i in {1..60}; do
  sleep 1
  if grep -q "Port 3000 is in use, trying 3001" /tmp/next-dev.out 2>/dev/null; then BASE="http://127.0.0.1:3001"; fi
  curl -sf -X POST "http://127.0.0.1:3000/api/growth/score" -H "content-type: application/json" --data-binary @/tmp/pay.json >/dev/null 2>&1 && break || true
done

echo "— BASE => http://127.0.0.1:3000"
echo; echo "— GET /api/growth/score —";  curl -sS "http://127.0.0.1:3000/api/growth/score"; echo
echo; echo "— POST /api/growth/score —"; curl -sS -X POST "http://127.0.0.1:3000/api/growth/score"  -H "content-type: application/json" --data-binary @/tmp/pay.json | head -c 400; echo
echo; echo "— POST /api/growth/boost —"; curl -sS -X POST "http://127.0.0.1:3000/api/growth/boost"  -H "content-type: application/json" --data-binary @/tmp/pay.json | head -c 260; echo
echo; echo "— POST /api/growth/copilot —"; curl -sS -X POST "http://127.0.0.1:3000/api/growth/copilot" -H "content-type: application/json" --data-binary @/tmp/pay.json | head -c 280; echo
echo; echo "➡ Dashboard: http://127.0.0.1:3000/dash/growth"
