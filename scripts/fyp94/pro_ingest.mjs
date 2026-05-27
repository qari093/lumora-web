import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";

const OUT = "public/native-fyp/real";
const META = "public/native-fyp/real-meta/manifest.json";

const QUERIES = [
  "football match","basketball game","gym workout","street food cooking",
  "dogs playing","city street","night traffic","cars driving",
  "mountain hiking","ocean waves","festival crowd","concert crowd",
  "airport travel","office work","kids playing","rain street",
  "drone landscape","sunset beach","forest trail","skateboard tricks"
];

function loadManifest(){
  if(!fs.existsSync(META)) return [];
  try { return JSON.parse(fs.readFileSync(META,"utf8")); }
  catch { return []; }
}

function saveManifest(data){
  fs.writeFileSync(META, JSON.stringify(data,null,2));
}

function nextId(list){
  return (Math.max(0,...list.map(x=>Number(x.id)||0))+1);
}

async function fetchPexels(q,page){
  const url=`https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&orientation=portrait&per_page=10&page=${page}`;
  const res=await fetch(url,{headers:{Authorization:process.env.PEXELS_API_KEY}});
  if(!res.ok) return [];
  const j=await res.json();

  return (j.videos||[]).map(v=>{
    const f=(v.video_files||[]).find(f=>f.height>=f.width && f.file_type==="video/mp4");
    if(!f) return null;
    return {
      source:"pexels",
      sourceId:String(v.id),
      mp4Url:f.link,
      query:q
    };
  }).filter(Boolean);
}

async function fetchPixabay(q,page){
  if(!process.env.PIXABAY_API_KEY) return [];
  const url=`https://pixabay.com/api/videos/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(q)}&per_page=10&page=${page}`;
  const res=await fetch(url);
  if(!res.ok) return [];
  const j=await res.json();

  return (j.hits||[]).map(v=>{
    const f=v.videos?.medium||v.videos?.small;
    if(!f) return null;
    return {
      source:"pixabay",
      sourceId:String(v.id),
      mp4Url:f.url,
      query:q
    };
  }).filter(Boolean);
}

async function download(url,file){
  const r=await fetch(url);
  if(!r.ok) return false;
  const b=Buffer.from(await r.arrayBuffer());
  if(b.length<50000) return false;
  await fsp.writeFile(file,b);
  return true;
}

async function run(){
  const manifest=loadManifest();
  const seen=new Set(manifest.map(x=>x.source+":"+x.sourceId));
  let id=nextId(manifest);
  let added=0;

  for(let page=1;page<=5;page++){
    for(const q of QUERIES){
      const clips=[
        ...(await fetchPexels(q,page)),
        ...(await fetchPixabay(q,page))
      ];

      for(const c of clips){
        const key=c.source+":"+c.sourceId;
        if(seen.has(key)) continue;

        const file=path.join(OUT,`${id}.mp4`);
        const ok=await download(c.mp4Url,file);
        if(!ok) continue;

        manifest.push({
          id,
          localUrl:`/native-fyp/real/${id}.mp4`,
          ...c
        });

        seen.add(key);
        added++;
        console.log("✓",id,q,c.source);
        id++;

        if(added>=120) break;
      }
      if(added>=120) break;
    }
    if(added>=120) break;
  }

  saveManifest(manifest);

  console.log("ADDED=",added);
  console.log("TOTAL=",manifest.length);

  if(added<30) throw new Error("LOW_INGEST");
}

run();
