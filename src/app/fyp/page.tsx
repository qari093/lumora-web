"use client";
import React, { useEffect, useRef, useState } from "react";

type Clip = { id: string; title: string; url: string; createdAt: number };

export default function FypPage_Min() {
  const [clip, setClip] = useState<Clip | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [genBusy, setGenBusy] = useState(false);
  const [vidErr, setVidErr] = useState<string | null>(null);
  const vref = useRef<HTMLVideoElement|null>(null);

  async function fetchTop() {
    try {
      setLoading(true); setErr(null);
      const res = await fetch("/api/fyp/recommend?limit=1", { cache: "no-store" });
      if (!res.ok) throw new Error("recommend " + res.status);
      const j = await res.json();
      const c = (Array.isArray(j) ? j[0] : (Array.isArray(j.items) ? j.items[0] : (j.data?.items?.[0] ?? null))) as Clip | null;
      setClip(c ?? null);
    } catch (e:any) {
      setErr(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchTop(); }, []);

  useEffect(() => {
    // force video reload every time clip changes
    const v = vref.current;
    if (!v || !clip) return;
    const src = clip.url + "?v=" + clip.createdAt;
    v.src = src;
    setVidErr(null);
    v.load();
    const p = v.play?.();
    if (p && typeof (p as any).catch === "function") (p as any).catch(()=>{ /* user may need to click play */ });
  }, [clip?.id, clip?.createdAt, clip?.url]);

  async function handleGenerate() {
    if (genBusy) return;
    setGenBusy(true);
    try {
      const res = await fetch("/api/fyp/generate", { method: "POST", cache: "no-store" });
      const j = await res.json();
      if (!res.ok || !j?.ok) throw new Error("generate failed");
      await fetchTop(); // re-pull newest, then the effect will reload <video>
    } catch (e:any) {
      alert(String(e?.message || e));
    } finally {
      setGenBusy(false);
    }
  }

  return (
    <div style={{ width:"100vw", height:"100vh", background:"#000", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
      {loading && <div>Loading…</div>}
      {err && <div style={{position:"absolute", top:16, left:16, color:"#f66"}}>Error: {err}</div>}

      {clip && (
        <div style={{ width:"100%", height:"100%", position:"relative" }}>
          <video
            key={clip.id}
            ref={vref}
            src={clip.url + "?v=" + clip.createdAt}
            controls
            autoPlay
            muted
            playsInline
            loop
            onError={()=>setVidErr("media failed to load")}
            style={{ width:"100%", height:"100%", objectFit:"contain", background:"#000" }}
          />
          <div style={{ position:"absolute", top:16, left:16, padding:"8px 12px", borderRadius:12, background:"rgba(0,0,0,.55)", fontWeight:800 }}>
            {clip.title}
          </div>
          <div style={{ position:"absolute", top:16, right:16, padding:"6px 10px", borderRadius:10, background:"rgba(0,0,0,.55)", fontSize:12 }}>
            url: {clip.url}
            <div><a href={clip.url} target="_blank" rel="noreferrer" style={{color:"#7ec0ff", textDecoration:"underline"}}>Open file</a></div>
            {vidErr && <div style={{marginTop:6, color:"#ff9a9a"}}>{vidErr}</div>}
          </div>
        </div>
      )}

      <div style={{ position:"absolute", bottom:16, right:16, display:"flex", gap:10 }}>
        <button
          onClick={handleGenerate}
          disabled={genBusy}
          style={{ padding:"10px 14px", borderRadius:12, border:"1px solid #2f2f2f", background: genBusy ? "#333" : "#1e90ff", color:"#fff", fontWeight:800 }}
        >
          {genBusy ? "Generating…" : "+ Generate Clip"}
        </button>
        <button
          onClick={fetchTop}
          style={{ padding:"10px 14px", borderRadius:12, border:"1px solid #2f2f2f", background:"#111", color:"#ddd", fontWeight:700 }}
        >
          Refresh Top
        </button>
      </div>
    </div>
  );
}
\TSX

# --- 2) Ensure the demo videos exist (blue + green) so change is visible ---
mkdir -p public/videos
if command -v ffmpeg >/dev/null 2>&1; then
  [ -f public/videos/test-1.mp4 ] || ffmpeg -hide_banner -loglevel error -f lavfi -t 3 -i color=c=blue:s=640x360:r=25 -pix_fmt yuv420p -y public/videos/test-1.mp4
  [ -f public/videos/test-2.mp4 ] || ffmpeg -hide_banner -loglevel error -f lavfi -t 3 -i color=c=green:s=640x360:r=25 -vf "drawtext=text=AI\ Generated:fontcolor=white:fontsize=28:x=(w-text_w)/2:y=(h-text_h)/2" -pix_fmt yuv420p -y public/videos/test-2.mp4
fi

# --- 3) Make sure /api returns the newest-first top item and generation targets the green file ---
mkdir -p src/app/api/fyp
cat > src/app/api/fyp/_store.ts <<TS
export type Clip = { id: string; title: string; url: string; createdAt: number };

const g = globalThis as unknown as { __FYP_STORE?: Clip[] };
if (!g.__FYP_STORE) g.__FYP_STORE = [];
const _clips: Clip[] = g.__FYP_STORE!;

export function ensureSeed(): void {
  if (_clips.length === 0) {
    _clips.push({ id: "seed-1", title: "Blue Placeholder", url: "/videos/test-1.mp4", createdAt: Date.now() });
  }
}
export function all(): Clip[] { ensureSeed(); return _clips.slice().sort((a,b)=>b.createdAt-a.createdAt); }
export function addGenerated(): Clip {
  ensureSeed();
  const now = new Date();
  const clip: Clip = {
    id: "gen-"+now.getTime(),
    title: "AI Generated "+String(now.getHours()).padStart(2,"0")+":"+
           String(now.getMinutes()).padStart(2,"0")+":"+
           String(now.getSeconds()).padStart(2,"0"),
    url: "/videos/test-2.mp4",
    createdAt: now.getTime(),
  };
  _clips.unshift(clip);
  return clip;
}
export function page(opts:{limit:number; cursor?:number|null}) {
  const sorted = all();
  let start = 0;
  if (opts.cursor) {
    const i = sorted.findIndex(c=>c.createdAt < (opts.cursor as number));
    start = i < 0 ? sorted.length : i;
  }
  const lim = Math.max(1, Number.isFinite(opts.limit) ? opts.limit : 10);
  const items = sorted.slice(start, start + lim);
  const last = items[items.length-1];
  const more = last ? sorted.some(c=>c.createdAt < last.createdAt) : false;
  return { items, nextCursor: more && last ? last.createdAt : null };
}
\TS

mkdir -p src/app/api/fyp/recommend
cat > src/app/api/fyp/recommend/route.ts <<TS
import { NextResponse } from "next/server";
import { page } from "../_store";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit") || 10);
    const cursorParam = searchParams.get("cursor");
    const cursor = cursorParam ? Number(cursorParam) : null;
    const { items, nextCursor } = page({ limit: isNaN(limit) ? 10 : Math.max(1, limit), cursor });
    return NextResponse.json({ ok:true, items, hasMore:Boolean(nextCursor), nextCursor, count: items.length });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message || e) }, { status:500 });
  }
}
\TS

mkdir -p src/app/api/fyp/generate
cat > src/app/api/fyp/generate/route.ts <<TS
import { NextResponse } from "next/server";
import { addGenerated } from "../_store";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export async function POST() {
  try {
    const clip = addGenerated();
    return NextResponse.json({ ok:true, clip });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message || e) }, { status:500 });
  }
}
\TS

# --- 4) Restart Next, prove API, and open the page ---
pkill -f "next dev" >/dev/null 2>&1 || true
rm -rf .next >/dev/null 2>&1 || true
PORT=3000 npx next dev >/tmp/next-dev.out 2>&1 & disown
sleep 8
echo "--- next logs (tail) ---"; tail -n 20 /tmp/next-dev.out || true; echo
echo "--- GET /api/fyp/recommend?limit=1 ---"; curl -sS http://127.0.0.1:3000/api/fyp/recommend?limit=1; echo
echo "--- POST /api/fyp/generate ---";        curl -sS -X POST http://127.0.0.1:3000/api/fyp/generate; echo
echo
echo "➡ Open: http://127.0.0.1:3000/fyp  (You should see a video with controls, title+URL HUD, and it will refresh after Generate.)"
