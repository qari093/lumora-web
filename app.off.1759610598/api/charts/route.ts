import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

type Bucket = { id:string; title:string; artist?:string|null; url:string; plays:number };

function bucketsFromPlays(rows:any[]){
  const map = new Map<string, Bucket>();
  for(const r of rows){
    const k=r.trackId;
    const b = map.get(k) || { id:k, title:r.track.title, artist:r.track.artist, url:r.track.url, plays:0 };
    b.plays += 1;
    map.set(k,b);
  }
  return Array.from(map.values()).sort((a,b)=>b.plays-a.plays);
}

export async function GET(req:Request){
  const { searchParams } = new URL(req.url);
  const window = (searchParams.get("window")||"hour").toLowerCase(); // hour|day|week
  const lang = searchParams.get("lang") || undefined;
  const niche = searchParams.get("niche") || undefined;

  let since = new Date(Date.now() - 60*60*1000);
  if(window==="day") since = new Date(Date.now() - 24*60*60*1000);
  if(window==="week") since = new Date(Date.now() - 7*24*60*60*1000);

  const plays = await prisma.trackPlay.findMany({
    where: { at: { gte: since }, ...(lang?{ track: { lang } }:{}), ...(niche?{ track:{ niche } }:{}) },
    include: { track: true },
    orderBy: { at: "desc" },
    take: 5000
  });

  const ranking = bucketsFromPlays(plays).slice(0, 100);
  return NextResponse.json({ ok:true, window, since: since.toISOString(), ranking });
}
