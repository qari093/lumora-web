import { NextResponse } from "next/server";
import fs from "fs"; import path from "path";

type Playlist = { id:string; name:string; tracks:string[]; createdAt:number; updatedAt:number };
type Store = { playlists: Playlist[] };

const storePath = path.join(process.cwd(),"public","music","playlists.json");
function readStore(): Store { try{ return JSON.parse(fs.readFileSync(storePath,"utf8")); }catch{ return {playlists:[]} } }
function writeStore(s:Store){ fs.mkdirSync(path.dirname(storePath),{recursive:true}); fs.writeFileSync(storePath, JSON.stringify(s,null,2)); }

export async function GET(_:Request,{params}:{params:{id:string}}){
  const s=readStore(); const pl=s.playlists.find(p=>p.id===params.id);
  if(!pl) return NextResponse.json({ok:false,error:"not_found"},{status:404});
  return NextResponse.json({ok:true,playlist:pl},{status:200});
}

export async function PUT(req:Request,{params}:{params:{id:string}}){
  const body=await req.json().catch(()=>({}));
  const s=readStore(); const pl=s.playlists.find(p=>p.id===params.id);
  if(!pl) return NextResponse.json({ok:false,error:"not_found"},{status:404});

  if (body.name) pl.name = String(body.name).slice(0,64);
  if (Array.isArray(body.tracks)) pl.tracks = body.tracks.map(String);
  pl.updatedAt = Date.now();
  writeStore(s);
  return NextResponse.json({ok:true,playlist:pl},{status:200});
}

export async function DELETE(_:Request,{params}:{params:{id:string}}){
  const s=readStore(); const n=s.playlists.filter(p=>p.id!==params.id); 
  if(n.length===s.playlists.length) return NextResponse.json({ok:false,error:"not_found"},{status:404});
  s.playlists=n; writeStore(s);
  return NextResponse.json({ok:true},{status:200});
}
