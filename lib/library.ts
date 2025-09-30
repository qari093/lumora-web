import fs from "node:fs/promises";
import path from "node:path";

export type Track = {
  id:string; title:string; artist?:string; url:string;
  genre?:string; energy?:string; bpm?:number; source?:string; createdAt?: number;
};
const MANIFEST = path.join(process.cwd(),"public/music/manifest.json");

export async function readManifest(){
  try{ return JSON.parse(await fs.readFile(MANIFEST,"utf8")); }
  catch{ return { version:3, catalog:[], lastUpdated:0 }; }
}
export async function writeManifest(m:any){
  m.lastUpdated = Date.now();
  await fs.mkdir(path.dirname(MANIFEST),{recursive:true});
  await fs.writeFile(MANIFEST, JSON.stringify(m,null,2));
  return m;
}
export function mergeDedupe(existing:Track[], incoming:Track[]){
  const seen = new Map<string,Track>();
  for(const t of existing){ if(t?.id) seen.set(t.id, t); }
  for(const t of incoming){ if(!t?.id) continue; if(seen.has(t.id)) continue; t.createdAt=Date.now(); seen.set(t.id,t); }
  return Array.from(seen.values());
}
export async function scanLocalAudio():Promise<Track[]>{
  const audioDir = path.join(process.cwd(),"public/audio");
  let files:string[]=[]; try{ files = await fs.readdir(audioDir); } catch{ return []; }
  return files.filter(f=>f.toLowerCase().endsWith(".mp3")).map(f=>({
    id: "local_"+f.replace(/\W+/g,"_"),
    title: f.replace(/\.[^/.]+$/, ""),
    artist: "Local",
    url: "/audio/"+f,
    genre: guessGenreFromName(f),
    source: "local"
  }));
}
function guessGenreFromName(n:string){
  const s=n.toLowerCase();
  if(s.includes("lofi")||s.includes("lo-fi")) return "lofi";
  if(s.includes("focus")) return "focus";
  if(s.includes("calm")||s.includes("ambient")) return "calm";
  if(s.includes("hype")||s.includes("edm")) return "hype";
  if(s.includes("sleep")) return "sleep";
  return "pop";
}
