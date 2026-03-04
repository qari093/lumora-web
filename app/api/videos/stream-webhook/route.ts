export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type AnyJson = Record<string, any>;
function getHeader(req: NextRequest, k: string){ return req.headers.get(k) || req.headers.get(k.toLowerCase()) || req.headers.get(k.toUpperCase()) || ""; }
function num(v:any){ const n=Number(v); return Number.isFinite(n)?n:undefined; }

function extract(body: AnyJson){
  const uid = body.uid || body?.data?.uid || body?.video?.uid || body?.result?.uid || body?.id || body?.asset?.id || "";
  const ready = body.readyToStream ?? body?.data?.readyToStream ?? (body?.status?.state==="ready") ?? (body?.event?.type==="video.ready") ?? false;
  const duration = num(body.duration) ?? num(body?.data?.duration) ?? num(body?.input?.duration) ?? num(body?.asset?.duration);
  const size = num(body?.size) ?? num(body?.data?.size) ?? num(body?.input?.size) ?? num(body?.asset?.size);
  const playbackId = body?.playback?.hls || body?.data?.playback?.hls || body?.playbackId || body?.result?.playback?.hls || null;
  return { uid: String(uid), ready: Boolean(ready), duration, size, playbackId: playbackId?String(playbackId):null };
}

async function tryDeleteFromCloudflare(uid:string){
  const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
  const STREAM_TOKEN = process.env.CLOUDFLARE_STREAM_TOKEN;
  if(!ACCOUNT_ID || !STREAM_TOKEN) return { skipped:true };
  const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/stream/${encodeURIComponent(uid)}`, { method:"DELETE", headers:{ Authorization:`Bearer ${STREAM_TOKEN}` } });
  const j = await r.json().catch(()=>({}));
  return { status:r.status, body:j };
}

export async function POST(req: NextRequest){
  const provided = getHeader(req, "x-lumora-sign");
  const expected = process.env.LUMORA_STREAM_WEBHOOK_SECRET || "";
  if(!expected || provided !== expected){
    return NextResponse.json({ ok:false, error:"unauthorized" }, { status:401 });
  }

  let body: AnyJson;
  try{ body = await req.json(); } catch { return NextResponse.json({ ok:false, error:"invalid_json" }, { status:400 }); }

  const { uid, ready, duration, size, playbackId } = extract(body);
  if(!uid) return NextResponse.json({ ok:false, error:"missing_uid" }, { status:400 });

  const maxDur = Number(process.env.LUMORA_STREAM_DURATION_MAX || 180);
  const tooLong = typeof duration === "number" && duration > maxDur;

  if(tooLong){
    const del = await tryDeleteFromCloudflare(uid).catch(()=>({ error:"delete_failed" }));
    const video = await prisma.video.upsert({
      where:{ cfUid: uid },
      update:{ status:"FLAGGED", flagged:true, reason:"duration_limit", durationSec: Math.round(duration!), sizeBytes: size ?? undefined },
      create:{ cfUid: uid, status:"FLAGGED", flagged:true, reason:"duration_limit", durationSec: Math.round(duration!), sizeBytes: size ?? undefined },
    });
    return NextResponse.json({ ok:true, action:"flagged", delete: del, video });
  }

  const video = await prisma.video.upsert({
    where:{ cfUid: uid },
    update:{ status: ready ? "READY":"PROCESSING", durationSec: duration ? Math.round(duration):undefined, sizeBytes: size ?? undefined, playbackId: playbackId ?? undefined },
    create:{ cfUid: uid, status: ready ? "READY":"PROCESSING", durationSec: duration ? Math.round(duration):undefined, sizeBytes: size ?? undefined, playbackId: playbackId ?? undefined },
  });

  return NextResponse.json({ ok:true, video });
}

export async function GET(){ return NextResponse.json({ ok:true, info:"POST JSON with x-lumora-sign header" }); }
