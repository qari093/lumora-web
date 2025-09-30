import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { readManifest, writeManifest, mergeDedupe, Track } from "../../../../lib/library";

type SourceCfg = { id:string; kind:"json"; url:string; map:Record<string,string>; defaultGenre?:string; sourceLabel?:string };

export async function POST(){
  const cfgPath = path.join(process.cwd(),"data/trend-sources.json");
  let cfg:{sources:SourceCfg[]} = { sources: [] };
  try{ cfg = JSON.parse(await fs.readFile(cfgPath,"utf8")); }catch{}

  const incoming:Track[] = [];
  for(const s of cfg.sources||[]){
    try{
      const res = await fetch(s.url, { cache: "no-store" });
      if(!res.ok) continue;
      const data = await res.json();
      const arr = Array.isArray(data) ? data : (Array.isArray((data as any).items) ? (data as any).items : []);
      for(const it of arr){
        const id = get(it, s.map.id), title = get(it, s.map.title), url = get(it, s.map.url);
        if(!id || !title || !url) continue;
        incoming.push({
          id: `${s.id}:${id}`,
          title, artist: s.map.artist ? get(it, s.map.artist) : "Unknown",
          url, genre: s.map.genre ? get(it, s.map.genre) : (s.defaultGenre||"pop"),
          bpm: s.map.bpm ? Number(get(it, s.map.bpm)) : undefined,
          source: s.sourceLabel || s.id
        });
      }
    }catch{}
  }
  const m = await readManifest();
  m.catalog = mergeDedupe(m.catalog, incoming);
  await writeManifest(m);
  return NextResponse.json({added: incoming.length, total:m.catalog.length, ok:true});
}
function get(o:any, d:string){ return d?.split(".").reduce((a,k)=>a?.[k], o); }
