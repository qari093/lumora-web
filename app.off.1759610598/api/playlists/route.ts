import { NextResponse } from "next/server";
import fs from "fs"; import path from "path";

type Playlist = { id:string; name:string; tracks:string[]; createdAt:number; updatedAt:number };
type Store = { playlists: Playlist[] };

const storePath = path.join(process.cwd(),"public","music","playlists.json");
function readStore(): Store { try{ return JSON.parse(fs.readFileSync(storePath,"utf8")); }catch{ return {playlists:[]} } }
function writeStore(s:Store){ fs.mkdirSync(path.dirname(storePath),{recursive:true}); fs.writeFileSync(storePath, JSON.stringify(s,null,2)); }
function id(){ return "pl_"+Math.random().toString(36).slice(2,9); }

export async function GET(){ return NextResponse.json(readStore(), {status:200}); }
export async function POST(req:Request){
  const body = await req.json().catch(()=>({}));
  const name = (body.name||"My Playlist").toString().slice(0,64);
  const s = readStore();
  const pl:Playlist = { id:id(), name, tracks:[], createdAt:Date.now(), updatedAt:Date.now() };
  s.playlists.push(pl); writeStore(s);
  return NextResponse.json({ ok:true, playlist:pl }, {status:201});
}
