"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { CrossfadePlayer } from "../../lib/advancedPlayer";

type Track = { id:string; title:string; artist:string; genre?:string; energy?:string; bpm?:number; url:string };
type Playlist = { id:string; name:string; tracks:string[]; createdAt:number; updatedAt:number };

async function fetchCatalog(): Promise<Track[]> {
  const r = await fetch("/music/manifest.json", { cache:"no-store" });
  const j = await r.json(); return j.catalog || [];
}
async function search(q:string): Promise<Track[]> {
  const r = await fetch("/api/music/search?q="+encodeURIComponent(q));
  const j = await r.json(); return j.items || [];
}
async function getPlaylists(): Promise<Playlist[]> {
  const r = await fetch("/api/playlists"); const j = await r.json(); return j.playlists || [];
}
async function createPlaylist(name:string){ 
  const r = await fetch("/api/playlists", {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({name})});
  const j = await r.json(); return j.playlist as Playlist;
}
async function updatePlaylist(id:string, payload:Partial<Playlist>){
  const r = await fetch("/api/playlists/"+id, {method:"PUT", headers:{"Content-Type":"application/json"}, body: JSON.stringify(payload)});
  const j = await r.json(); return j.playlist as Playlist;
}
async function removePlaylist(id:string){ await fetch("/api/playlists/"+id, {method:"DELETE"}); }

export default function MusicPro(){
  const [catalog,setCatalog]=useState<Track[]>([]);
  const [query,setQuery]=useState("");
  const [results,setResults]=useState<Track[]>([]);
  const [queue,setQueue]=useState<Track[]>([]);
  const [cur,setCur]=useState<Track|null>(null);
  const [liked,setLiked]=useState<Record<string,boolean>>({});
  const [history,setHistory]=useState<string[]>([]);
  const [pls,setPls]=useState<Playlist[]>([]);
  const [selPl,setSelPl]=useState<string>("");
  const [shuffle,setShuffle]=useState(true);
  const [repeat,setRepeat]=useState<"off"|"one"|"all">("all");

  const aRef=useRef<HTMLAudioElement|null>(null);
  const bRef=useRef<HTMLAudioElement|null>(null);
  const fxRef=useRef<CrossfadePlayer|null>(null);
  useEffect(()=>{ 
    fxRef.current = new CrossfadePlayer(3);
    fxRef.current.attach(aRef.current!, bRef.current!);
  },[]);

  useEffect(()=>{ (async()=>{ setCatalog(await fetchCatalog()); setPls(await getPlaylists()); })(); },[]);

  useEffect(()=>{ let t:any; t=setTimeout(async()=>{ if(query.trim().length===0){ setResults([]); return; } setResults(await search(query)); }, 200); return ()=>clearTimeout(t); },[query]);

  const recs = useMemo(()=>{
    if(!catalog.length) return [];
    const likedIds = new Set(Object.keys(liked).filter(k=>liked[k]));
    const base = likedIds.size? catalog.filter(t=>!likedIds.has(t.id)) : catalog;
    const last = cur || catalog[0];
    const scored = base.map(t=>{
      let s = 0;
      if (t.energy && last?.energy && t.energy===last.energy) s+=2;
      if (t.genre && last?.genre && t.genre===last.genre) s+=1.5;
      if (likedIds.has(t.id)) s-=5;
      return [t,s] as const;
    }).sort((a,b)=>b[1]-a[1]);
    return scored.slice(0,10).map(x=>x[0]);
  },[catalog, liked, cur]);

  function enqueue(t:Track){ setQueue(q=>[...q,t]); if(!cur){ setCur(t); fxRef.current?.play(t.url); } }
  function playNow(t:Track){ setCur(t); fxRef.current?.play(t.url); setHistory(h=>[t.id,...h].slice(0,100)); }

  function next(){
    if(!queue.length){ if(repeat==="one" && cur) return fxRef.current?.play(cur.url);
      if(repeat==="all" && catalog.length){ const n=catalog[(catalog.findIndex(x=>x.id===cur?.id)+1)%catalog.length]; return playNow(n); }
      return;
    }
    const n = shuffle ? queue[Math.floor(Math.random()*queue.length)] : queue[0];
    setQueue(q=> q.filter(x=>x.id!==n.id) );
    playNow(n);
  }
  function prev(){
    const last = history.find(id=>id!==cur?.id);
    const t = catalog.find(x=>x.id===last);
    if(t) playNow(t);
  }

  function toggleLike(id:string){ setLiked(l=>({...l, [id]: !l[id]})); }

  async function addToPlaylist(plId:string, trackId:string){
    const pl = pls.find(p=>p.id===plId); if(!pl) return;
    const tracks = Array.from(new Set([...pl.tracks, trackId]));
    const upd = await updatePlaylist(plId, { tracks });
    setPls(ps=>ps.map(p=>p.id===plId?upd:p));
  }

  async function createNewPlaylist(){
    const name = prompt("Playlist name?") || "My Playlist";
    const pl = await createPlaylist(name);
    setPls(p=>[...p,pl]); setSelPl(pl.id);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8" style={{fontFamily:"ui-sans-serif,system-ui",background:"#0a0a0a",color:"#e5e7eb",minHeight:"100vh"}}>
      <h1 className="text-2xl font-semibold">NEXA Music — Pro Portal</h1>

      <section className="mt-4 rounded-2xl p-4" style={{background:"#18181b",border:"1px solid #27272a"}}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">{cur?.title ?? "—"}</div>
            <div className="opacity-70">{cur?.artist ?? ""}</div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <button onClick={()=>setShuffle(s=>!s)} className="px-3 py-1.5 rounded" style={{background: shuffle?"#4f46e5":"#3f3f46",color:"#fff"}}>Shuffle</button>
            <button onClick={()=>setRepeat(r=> r==="off"?"one": r==="one"?"all":"off")} className="px-3 py-1.5 rounded" style={{background:"#3f3f46",color:"#fff"}}>Repeat: {repeat}</button>
          </div>
        </div>

        <audio ref={aRef} className="hidden"/>
        <audio ref={bRef} className="hidden"/>

        <div className="mt-3 flex gap-2">
          <button onClick={prev} className="px-3 py-1.5 rounded bg-zinc-700">Prev</button>
          <button onClick={()=>fxRef.current?.pause()} className="px-3 py-1.5 rounded bg-zinc-700">Pause</button>
          <button onClick={next} className="px-3 py-1.5 rounded bg-zinc-700">Next</button>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl p-4" style={{background:"#18181b",border:"1px solid #27272a"}}>
          <h3 className="font-medium mb-2">Search</h3>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search title, artist, genre..."
            className="w-full px-3 py-2 rounded" style={{background:"#0a0a0a",border:"1px solid #27272a",color:"#e5e7eb"}} />
          <div className="mt-3 grid gap-2 max-h-[300px] overflow-auto">
            {(results.length?results:catalog).map(t=>(
              <div key={t.id} className="rounded p-2 flex items-center justify-between" style={{background:"#27272a"}}>
                <div>
                  <div className="font-medium">{t.title}</div>
                  <div className="text-xs opacity-80">{t.artist} {t.genre?`• ${t.genre}`:""} {t.energy?`• ${t.energy}`:""}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={()=>playNow(t)} className="px-2 py-1 rounded bg-indigo-600 text-white text-sm">Play</button>
                  <button onClick={()=>enqueue(t)} className="px-2 py-1 rounded bg-zinc-600 text-white text-sm">Queue</button>
                  <button onClick={()=>toggleLike(t.id)} className="px-2 py-1 rounded text-sm" style={{background: (liked as any)[t.id]?"#16a34a":"#3f3f46",color:"#fff"}}>♥️</button>
                  <select value={selPl} onChange={e=>setSelPl(e.target.value)} className="px-2 py-1 rounded text-sm" style={{background:"#0a0a0a",border:"1px solid #3f3f46",color:"#e5e7eb"}}>
                    <option value="">Add to playlist…</option>
                    {pls.map(pl=><option key={pl.id} value={pl.id}>{pl.name}</option>)}
                  </select>
                  <button disabled={!selPl} onClick={()=>{ if(selPl) addToPlaylist(selPl, t.id); }} className="px-2 py-1 rounded bg-zinc-700 text-white text-sm disabled:opacity-50">Add</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-2xl p-4" style={{background:"#18181b",border:"1px solid #27272a"}}>
            <h3 className="font-medium mb-2">Recommended for you</h3>
            <div className="grid gap-2 max-h-[160px] overflow-auto">
              { (catalog.slice(0,10)).map(t=>(
                <div key={t.id} className="rounded p-2 flex items-center justify-between" style={{background:"#27272a"}}>
                  <div>
                    <div className="font-medium">{t.title}</div>
                    <div className="text-xs opacity-80">{t.artist} {t.genre?`• ${t.genre}`:""} {t.energy?`• ${t.energy}`:""}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={()=>playNow(t)} className="px-2 py-1 rounded bg-indigo-600 text-white text-sm">Play</button>
                    <button onClick={()=>enqueue(t)} className="px-2 py-1 rounded bg-zinc-600 text-white text-sm">Queue</button>
                  </div>
                </div>
              )) }
            </div>
          </div>

          <div className="rounded-2xl p-4" style={{background:"#18181b",border:"1px solid #27272a"}}>
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Playlists</h3>
              <button onClick={createNewPlaylist} className="px-2 py-1 rounded bg-indigo-600 text-white text-sm">New</button>
            </div>
            <div className="mt-2 grid gap-2 max-h-[200px] overflow-auto">
              {pls.map(pl=>(
                <div key={pl.id} className="rounded p-2" style={{background:"#27272a"}}>
                  <div className="font-medium">{pl.name}</div>
                  <div className="text-xs opacity-70">{pl.tracks.length} tracks</div>
                  <div className="mt-1 flex gap-2">
                    <button onClick={async ()=>{
                      const map = new Map(catalog.map(t=>[t.id,t]));
                      const tracks = pl.tracks.map(id=>map.get(id)).filter(Boolean) as Track[];
                      if (tracks.length){ setQueue(tracks.slice(1)); playNow(tracks[0]); }
                    }} className="px-2 py-1 rounded bg-zinc-600 text-white text-sm">Play</button>
                    <button onClick={async ()=>{
                      const name = prompt("Rename playlist", pl.name) || pl.name;
                      const upd = await fetch("/api/playlists/"+pl.id,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({name})}).then(r=>r.json());
                      if (upd.playlist) setPls(ps=>ps.map(p=>p.id===pl.id?upd.playlist:p));
                    }} className="px-2 py-1 rounded bg-zinc-700 text-white text-sm">Rename</button>
                    <button onClick={async ()=>{ await removePlaylist(pl.id); setPls(ps=>ps.filter(p=>p.id!==pl.id)); }} className="px-2 py-1 rounded bg-red-600 text-white text-sm">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
