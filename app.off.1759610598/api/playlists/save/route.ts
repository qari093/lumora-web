import { NextResponse } from "next/server";
import { supaService } from "../../../../lib/supabase";
import fs from "node:fs/promises";
import path from "node:path";

const LOCAL_MODE = process.env.PULSE_LOCAL_MODE === "1";

type Item = { id:string; title:string; artist?:string; url:string; genre?:string; bpm?:number; lang?:string; niche?:string; };
type Body = { name:string; items:Item[]; meta?:Record<string,any>; visibility?: "public"|"private" };

async function saveJson(body:Body, userId:string|null){
  const file = path.join(process.cwd(),"data","playlists.json");
  try{ await fs.mkdir(path.dirname(file), { recursive: true }); }catch{}
  let j:{playlists:any[]} = { playlists: [] };
  try{ j = JSON.parse(await fs.readFile(file,"utf8")); }catch{}
  const payload = {
    id: "local_"+Date.now(),
    userId, name: body.name, items: body.items, meta: body.meta||{},
    visibility: body.visibility || "private",
    createdAt: Date.now()
  };
  j.playlists.unshift(payload);
  await fs.writeFile(file, JSON.stringify(j,null,2));
  return payload;
}

export async function POST(req:Request){
  const body = await req.json().catch(()=>null) as Body|null;
  if(!body || !body.name || !Array.isArray(body.items) || body.items.length===0){
    return NextResponse.json({ error:"Invalid payload" },{ status:400 });
  }
  const visibility = (body.visibility==="public"||body.visibility==="private") ? body.visibility : "private";

  // If Local Mode is on, accept without Supabase and save locally
  if(LOCAL_MODE){
    const saved = await saveJson({...body, visibility}, "local-dev");
    return NextResponse.json({ ok:true, id: saved.id, saved:"json-local", visibility, mode:"LOCAL" });
  }

  // Otherwise: require Supabase login
  const auth = req.headers.get("authorization") || "";
  const m = auth.match(/^Bearer\s+(.+)$/i);
  if(!m) return NextResponse.json({ error:"Unauthorized (missing token)" },{ status:401 });
  const token = m[1];

  let userId:string|null = null;
  try{
    const supa = supaService();
    const { data, error } = await supa.auth.getUser(token);
    if(error || !data?.user) return NextResponse.json({ error:"Unauthorized (invalid token)" },{ status:401 });
    userId = data.user.id;
  }catch{
    return NextResponse.json({ error:"Unauthorized (verification failed)" },{ status:401 });
  }

  try{
    if(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY){
      const supa = supaService();
      const { data:pl, error:perr } = await supa
        .from("playlists")
        .insert({ user_id: userId, name: body.name, meta: body.meta||{}, visibility })
        .select()
        .single();
      if(perr) throw perr;

      const rows = body.items.map((t,i)=>({
        playlist_id: pl.id, track_id: t.id, title: t.title, artist: t.artist||null,
        url: t.url, genre: t.genre||null, bpm: t.bpm||null, lang: t.lang||null, niche: t.niche||null, position: i
      }));
      const { error:ierr } = await supa.from("playlist_items").insert(rows);
      if(ierr) throw ierr;

      return NextResponse.json({ ok:true, id: pl.id, saved:"supabase", visibility, mode:"SUPABASE" });
    }
    // If keys missing, fallback to JSON
    const saved = await saveJson({...body, visibility}, userId);
    return NextResponse.json({ ok:true, id: saved.id, saved:"json", visibility, mode:"FALLBACK" });
  }catch{
    const saved = await saveJson({...body, visibility}, userId);
    return NextResponse.json({ ok:true, id: saved.id, saved:"json", note:"supabase failed; saved locally", visibility, mode:"FALLBACK" });
  }
}
