import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { addDocuments } from "../../../../lib/search";
import fs from "node:fs/promises";
import path from "node:path";

type M = { version:number; catalog:{ id:string; title:string; artist?:string; genre?:string; bpm?:number; url:string; lang?:string; niche?:string }[] };

export async function POST(){
  const added:any[] = [];

  // manifest
  try{
    const mPath = path.join(process.cwd(),"public","music","manifest.json");
    const raw = await fs.readFile(mPath,"utf8");
    const m = JSON.parse(raw) as M;
    for(const t of (m.catalog||[])){
      const rec = await prisma.track.upsert({
        where: { id: t.id },
        update: { title:t.title, artist:t.artist||null, genre:t.genre||null, bpm:t.bpm??null, url:t.url, lang:t.lang||null, niche:t.niche||null, source:"manifest" },
        create: { id:t.id, title:t.title, artist:t.artist||null, genre:t.genre||null, bpm:t.bpm??null, url:t.url, lang:t.lang||null, niche:t.niche||null, source:"manifest" }
      });
      added.push(rec);
    }
  }catch{}

  // public/audio
  try{
    const dir = path.join(process.cwd(),"public","audio");
    const files = await fs.readdir(dir);
    for(const f of files){
      if(!f.toLowerCase().endsWith(".mp3")) continue;
      const id = "local_"+f;
      const url = "/audio/"+f;
      const rec = await prisma.track.upsert({
        where: { id },
        update: { url },
        create: { id, title: f.replace(/\.mp3$/i,""), url, source:"seed" }
      });
      added.push(rec);
    }
  }catch{}

  // index in unified search
  try{ await addDocuments(added.map(r=>({ id:r.id, title:r.title, artist:r.artist||undefined, genre:r.genre||undefined, bpm:r.bpm||undefined, url:r.url, lang:r.lang||undefined, niche:r.niche||undefined }))); }catch{}

  return NextResponse.json({ ok:true, added: added.length });
}
